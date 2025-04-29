package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.ChatMessageDto;
import com.webserdi.backend.dto.UsuarioSimpleDto;
import com.webserdi.backend.entity.ChatMessage;
import com.webserdi.backend.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageMapper {

    public ChatMessageDto toDto(ChatMessage message) {
        if (message == null) {
            return null;
        }

        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(message.getId());
        dto.setChatId(message.getChat() != null ? message.getChat().getId() : null);
        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setAttachmentUrl(message.getAttachmentUrl()); // You might transform this URL if needed
        dto.setAttachmentFilename(message.getAttachmentFilename());
        dto.setAttachmentMimeType(message.getAttachmentMimeType());
        dto.setTimestamp(message.getTimestamp());

        Usuario sender = message.getSender();
        if (sender != null) {
            String senderNombreCompleto = sender.getNombre() + " " + sender.getApellido();
            dto.setSender(new UsuarioSimpleDto(sender.getId(), senderNombreCompleto));
        }

        return dto;
    }

    // No toEntity needed typically, as creation happens in the service
}