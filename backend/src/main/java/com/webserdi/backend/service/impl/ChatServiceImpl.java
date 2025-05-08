package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.ChatMessageCreateDto;
import com.webserdi.backend.dto.ChatMessageDto;
import com.webserdi.backend.dto.UsuarioSimpleDto;
import com.webserdi.backend.entity.*;
import com.webserdi.backend.exception.GlobalExceptionHandler;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.ChatMessageMapper;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MimeTypeUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatServiceImpl.class);
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(MimeTypeUtils.IMAGE_JPEG_VALUE, MimeTypeUtils.IMAGE_PNG_VALUE, MimeTypeUtils.IMAGE_GIF_VALUE);
    private static final String ALLOWED_PDF_TYPE = "application/pdf";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

    private final TicketRepository ticketRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UsuarioRepository usuarioRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final FileStorageService fileStorageService; // Inject file storage service

    @Override
    @Transactional(readOnly = true) // Read-only transaction for fetching
    public Page<ChatMessageDto> getMessagesByTicketId(Long ticketId, Pageable pageable) {
        // Find the ticket first to ensure it exists and get the chat
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado con id: " + ticketId));

        if (ticket.getChat() == null) {
            // This shouldn't happen if @PrePersist works, but good to check
            logger.warn("Ticket with ID {} has no associated chat.", ticketId);
            return Page.empty(pageable);
        }

        // Fetch messages using the optimized query
        Page<ChatMessage> messagesPage = chatMessageRepository.findByChatIdFetchingSender(ticket.getChat().getId(), pageable);

        return messagesPage.map(chatMessageMapper::toDto);
    }

    @Override
    @Transactional // Write transaction for creating message
    public ChatMessageDto postMessage(Long ticketId, ChatMessageCreateDto messageDto, MultipartFile file, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new GlobalExceptionHandler();
        }
//        String userEmail = authentication.getName();
        String userEmail = "practicante.sistemas2@serdi.com.mx";
        Usuario sender = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado con id: " + ticketId));

        Chat chat = ticket.getChat();
        if (chat == null) {
            // Should be created by @PrePersist, but handle defensively
            chat = new Chat();
            ticket.setChat(chat);
            // No need to save chat explicitly due to cascade from ticket
        }

        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(sender);

        if (file != null && !file.isEmpty()) {
            validateFile(file); // Validate size and type

            String storedFilename = fileStorageService.storeFile(file);
            message.setAttachmentUrl("/api/files/" + storedFilename); // Example URL structure
            message.setAttachmentFilename(StringUtils.cleanPath(file.getOriginalFilename()));
            message.setAttachmentMimeType(file.getContentType());

            if (ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
                message.setMessageType(ChatMessage.MessageType.IMAGE);
            }else if (ALLOWED_PDF_TYPE.equals(file.getContentType())) {
                message.setMessageType(ChatMessage.MessageType.PDF);
            }

            // Optionally set content based on file type, or leave it null
             message.setContent("Archivo adjunto: " + message.getAttachmentFilename());

        } else if (messageDto.getContent() != null && !messageDto.getContent().isBlank()) {
            // Handle text message
            message.setContent(messageDto.getContent().trim());
            message.setMessageType(ChatMessage.MessageType.TEXT);
        } else {
            // No content and no file
//            throw new BadRequestException("El mensaje debe tener contenido o un archivo adjunto.");
        }

        ChatMessage savedMessage = chatMessageRepository.save(message);
        logger.info("Mensaje guardado con ID {} en chat ID {} para ticket ID {}", savedMessage.getId(), chat.getId(), ticketId);

        // Fetch the sender eagerly for the response DTO
        // (Alternatively, manually create the UsuarioSimpleDto from the sender object we already have)
        // ChatMessage fetchedMessage = chatMessageRepository.findByIdFetchingSender(savedMessage.getId()).orElse(savedMessage);
        // return chatMessageMapper.toDto(fetchedMessage);

        // Simpler: Use the sender object we already loaded
        return chatMessageMapper.toDto(savedMessage); // Mapper will use the sender object
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
//            throw new BadRequestException("El archivo excede el tamaño máximo permitido de " + (MAX_FILE_SIZE / 1024 / 1024) + "MB.");
        }

        String contentType = file.getContentType();
    }

    @Transactional
    public ChatMessageDto processMessage(String chatId, ChatMessageCreateDto messageDto, Authentication authentication) {
        // Obtener el usuario actual
        String username = authentication.getName();
        Usuario sender = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Convertir chatId a Long (asumiendo que es el ID del ticket)
        Long ticketId = Long.parseLong(chatId);
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        // Crear y guardar el mensaje
        ChatMessage message = ChatMessage.builder()
                .content(messageDto.getContent())
                .sender(sender)
                .chat(ticket.getChat())
                .timestamp(LocalDateTime.now())
                .messageType(ChatMessage.MessageType.TEXT)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Convertir a DTO para enviar a través de WebSocket
        return ChatMessageDto.builder()
                .id(savedMessage.getId())
                .chatId(savedMessage.getChat().getId())
                .content(savedMessage.getContent())
                .sender(new UsuarioSimpleDto(savedMessage.getSender().getId(), savedMessage.getSender().getNombre()))
                .timestamp(savedMessage.getTimestamp())
                .build();
    }
}