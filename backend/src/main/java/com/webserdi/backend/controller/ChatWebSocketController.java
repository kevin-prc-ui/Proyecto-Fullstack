package com.webserdi.backend.controller;

import com.webserdi.backend.dto.ChatMessageCreateDto;
import com.webserdi.backend.dto.ChatMessageDto;
import com.webserdi.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{ticketId}")
    @SendTo("/topic/chat/{ticketId}")
    public ChatMessageDto handleMessage(@DestinationVariable Long ticketId,
                                        ChatMessageCreateDto message,
                                        Authentication authentication) {
        ChatMessageDto savedMessage = chatService.processMessage(ticketId.toString(), message, authentication);
        // Notificar a los usuarios suscritos al chat específico
        messagingTemplate.convertAndSend("/topic/chat/" + ticketId, savedMessage);

        return savedMessage;
    }
}