package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.ChatMessageCreateDto;
import com.webserdi.backend.dto.ChatMessageDto;
import com.webserdi.backend.entity.*;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.ChatMessageMapper;
import com.webserdi.backend.repository.ChatRepository; // Necesitarás un ChatRepository
import com.webserdi.backend.repository.ChatMessageRepository;
import com.webserdi.backend.repository.TicketRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.ChatService;
import com.webserdi.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate; // Para enviar mensajes STOMP programáticamente
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MimeTypeUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatServiceImpl.class);
    // ... (constantes ALLOWED_IMAGE_TYPES, etc. se mantienen) ...
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(MimeTypeUtils.IMAGE_JPEG_VALUE, MimeTypeUtils.IMAGE_PNG_VALUE, MimeTypeUtils.IMAGE_GIF_VALUE);
    private static final String ALLOWED_PDF_TYPE = "application/pdf";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit


    private final TicketRepository ticketRepository;
    private final ChatRepository chatRepository; // Añadir ChatRepository
    private final ChatMessageRepository chatMessageRepository;
    private final UsuarioRepository usuarioRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final FileStorageService fileStorageService;
    private final SimpMessagingTemplate messagingTemplate; // Para enviar mensajes STOMP

    @Override
    @Transactional(readOnly = true)
    public Page<ChatMessageDto> getMessagesByTicketId(Long ticketId, Pageable pageable) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado con id: " + ticketId));

        if (ticket.getChat() == null) {
            logger.warn("Ticket con ID {} has no associated chat.", ticketId);
            return Page.empty(pageable);
        }
        // Usar el ID del chat del ticket para buscar los mensajes
        Page<ChatMessage> messagesPage = chatMessageRepository.findByChatIdFetchingSender(ticket.getChat().getId(), pageable);
        return messagesPage.map(chatMessageMapper::toDto);
    }

    /**
     * Guarda un mensaje enviado a través de una solicitud REST (HTTP POST).
     * Después de guardar, también transmite el mensaje a través de WebSocket.
     */
    @Override
    @Transactional
    public ChatMessageDto postMessage(Long ticketId, ChatMessageCreateDto messageDto, MultipartFile file, Authentication authentication) {
        // 1. Validar autenticación y obtener sender
        if (authentication == null || !authentication.isAuthenticated()) {
            // throw new GlobalExceptionHandler(); // Lanza una excepción más específica
            throw new SecurityException("Usuario no autenticado. No se puede enviar el mensaje.");
        }
        String userEmail = authentication.getName();
        Usuario sender = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        // 2. Obtener Ticket y su Chat asociado
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado con id: " + ticketId));

        Chat chat = ticket.getChat(); // @PrePersist en Ticket debe asegurar que chat no sea null
        if (chat == null) {
            // Esto es una condición de error si @PrePersist está configurado correctamente
            logger.error("CRÍTICO: El chat es nulo para el ticket ID: {}. Esto no debería ocurrir.", ticketId);
            throw new IllegalStateException("El chat asociado al ticket no existe.");
        }

        // 3. Crear y configurar la entidad ChatMessage
        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(sender);
        // message.setTimestamp(LocalDateTime.now()); // @CreationTimestamp lo hará

        boolean hasContent = messageDto != null && StringUtils.hasText(messageDto.getContent());
        boolean hasFile = file != null && !file.isEmpty();

        if (!hasContent && !hasFile) {
            throw new ResourceNotFoundException("El mensaje debe tener contenido o un archivo adjunto.");
        }

        if (hasFile) {
            validateFile(file);
            String storedFilename = fileStorageService.storeFile(file);
            message.setAttachmentUrl("/api/files/" + storedFilename);
            message.setAttachmentFilename(StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename())));
            message.setAttachmentMimeType(file.getContentType());

            if (ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
                message.setMessageType(ChatMessage.MessageType.IMAGE);
            } else if (ALLOWED_PDF_TYPE.equals(file.getContentType())) {
                message.setMessageType(ChatMessage.MessageType.PDF);
            } else {
                // Tipo de archivo no soportado explícitamente, pero se guarda como adjunto genérico
                // Se podría añadir un tipo MessageType.FILE o similar
                logger.warn("Tipo de archivo no reconocido explícitamente: {}. Se guardará como adjunto.", file.getContentType());
                // Por ahora, si no es imagen o PDF, el MessageType.TEXT por defecto se mantendrá si hay contenido,
                // o se podría forzar un tipo genérico si se añade.
            }
            // Si hay un archivo, el contenido del DTO se ignora o se añade como descripción.
            // Aquí, si hay archivo, el contenido principal es el archivo.
            // El frontend ya añade "Archivo adjunto:"
            if (hasContent) {
                message.setContent(messageDto.getContent().trim() + "\n(Archivo: " + message.getAttachmentFilename() + ")");
            } else {
                message.setContent("Archivo adjunto: " + message.getAttachmentFilename());
            }

        } else { // Solo mensaje de texto
            message.setContent(messageDto.getContent().trim());
            message.setMessageType(ChatMessage.MessageType.TEXT);
        }

        // 4. Guardar el mensaje
        ChatMessage savedMessage = chatMessageRepository.save(message);
        logger.info("Mensaje (vía REST) guardado con ID {} en chat ID {} para ticket ID {}", savedMessage.getId(), chat.getId(), ticketId);

        // 5. Mapear a DTO
        ChatMessageDto messageDtoToSend = chatMessageMapper.toDto(savedMessage);

        // 6. Transmitir el mensaje a través de WebSocket
        // El topic es /ticket/chat/{chatId}
        String destination = "/ticket/chat/" + chat.getId();
        logger.info("Transmitiendo mensaje (desde REST) a STOMP topic: {}", destination);
        messagingTemplate.convertAndSend(destination, messageDtoToSend);

        return messageDtoToSend; // Devolver al cliente REST
    }

    /**
     * Procesa y guarda un mensaje recibido a través de WebSocket.
     * Este método es llamado por WebSocketChatController.
     */
    @Override
    @Transactional
    public ChatMessageDto processMessage(String chatIdString, ChatMessageCreateDto messageDto, Authentication authentication) {
        // 1. Validar autenticación y obtener sender
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Usuario no autenticado. No se puede procesar el mensaje.");
        }
        String username = authentication.getName();
        Usuario sender = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // 2. Validar y obtener Chat
        Long chatId;
        try {
            chatId = Long.parseLong(chatIdString);
        } catch (NumberFormatException e) {
            logger.error("El ID del chat '{}' (recibido vía WebSocket) no es un número válido.", chatIdString);
            throw new ResourceNotFoundException("El ID del chat proporcionado no es válido.");
        }

        Chat chat = chatRepository.findById(chatId) // Usar ChatRepository
                .orElseThrow(() -> new ResourceNotFoundException("Chat no encontrado con ID: " + chatId));

        // 3. Crear y guardar el mensaje (solo texto para este método, los archivos se manejan vía REST)
        // Si se quisiera soportar archivos directamente vía STOMP, sería más complejo (base64, etc.)
        if (messageDto == null || !StringUtils.hasText(messageDto.getContent())) {
            throw new ResourceNotFoundException("El contenido del mensaje no puede estar vacío para mensajes WebSocket.");
        }

        ChatMessage message = ChatMessage.builder()
                .content(messageDto.getContent().trim())
                .sender(sender)
                .chat(chat)
                // .timestamp(LocalDateTime.now()) // @CreationTimestamp lo hará
                .messageType(ChatMessage.MessageType.TEXT) // Asumir TEXT para mensajes directos de STOMP
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);
        logger.info("Mensaje (vía WebSocket) guardado con ID {} en chat ID {}", savedMessage.getId(), chatId);

        // 4. Mapear a DTO usando el mapper para consistencia
        return chatMessageMapper.toDto(savedMessage);
        // El DTO devuelto por este método será el que @SendTo envíe a los suscriptores.
    }


    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResourceNotFoundException("El archivo excede el tamaño máximo permitido de " + (MAX_FILE_SIZE / 1024 / 1024) + "MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || (!ALLOWED_IMAGE_TYPES.contains(contentType) && !ALLOWED_PDF_TYPE.equals(contentType))) {
            throw new ResourceNotFoundException("Tipo de archivo no permitido: " + contentType + ". Permitidos: JPG, PNG, GIF, PDF.");
        }
    }

    /**
     * Este método es un placeholder o podría usarse para notificaciones push, etc.
     * La transmisión real del mensaje a los clientes STOMP se hace con @SendTo
     * o SimpMessagingTemplate.
     */
    @Override
    public void notifyUsersNewMessage(Long ticketId, ChatMessageDto message) {
        // Implementación futura si se necesitan notificaciones adicionales (ej. email, push)
        logger.debug("Placeholder: Notificar a usuarios sobre nuevo mensaje en ticket ID {}: {}", ticketId, message.getId());
    }
}