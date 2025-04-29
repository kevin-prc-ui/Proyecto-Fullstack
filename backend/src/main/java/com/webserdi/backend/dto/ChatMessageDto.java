package com.webserdi.backend.dto;

import com.webserdi.backend.entity.ChatMessage; // Import enum
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDto {
    private Long id;
    private Long chatId; // ID of the chat it belongs to
    private UsuarioSimpleDto sender; // Use the simple DTO for sender info
    private String content;
    private ChatMessage.MessageType messageType;
    private String attachmentUrl;
    private String attachmentFilename;
    private String attachmentMimeType;
    private LocalDateTime timestamp;
}