package com.webserdi.backend.controller;

import com.webserdi.backend.dto.ChatMessageCreateDto;
import com.webserdi.backend.dto.ChatMessageDto;
import com.webserdi.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tickets/{ticketId}/chat") // Nested under tickets
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Get messages for a ticket's chat
    @GetMapping("/messages")
    // Add appropriate authorization check - e.g., user must have read access to the ticket
    @PreAuthorize("hasRole('ROLE_ADMIN')") // Example using Spring's permission evaluator
    public Page<ChatMessageDto> getChatMessages(
            @PathVariable Long ticketId,
            @PageableDefault(size = 20) Pageable pageable) { // Default sort by timestamp
        return chatService.getMessagesByTicketId(ticketId, pageable);
    }

    @PostMapping(
            value = "/messages",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.CREATED)
    public ChatMessageDto postChatMessage(
            @PathVariable Long ticketId,
            @RequestPart(value = "message")
            @Validated ChatMessageCreateDto messageDto,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return chatService.postMessage(ticketId, messageDto, file, authentication);
    }
}