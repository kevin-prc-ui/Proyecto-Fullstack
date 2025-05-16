package com.webserdi.backend.config;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.authorization.AuthorizationEventPublisher;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.authorization.SpringAuthorizationEventPublisher;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker // Habilita el broker de mensajes WebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilita un broker de mensajes simple en memoria para llevar los mensajes
        // de vuelta al cliente en los destinos con prefijo "/ticket" (para chats de tickets) y "/topic" (genérico).
        config.enableSimpleBroker("/topic", "/ticket");

        // Designa el prefijo "/app" para los mensajes que están destinados a ser manejados
        // por métodos anotados con @MessageMapping en los controladores.
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registra el endpoint "/ws" que los clientes usarán para conectarse al servidor WebSocket.
        // withSockJS() habilita fallbacks SockJS para navegadores que no soportan WebSockets directamente.
        // setAllowedOrigins("*") permite conexiones desde cualquier origen (ajustar para producción).
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173", "http://localhost:3000") // Especifica tus orígenes de frontend
                .withSockJS();
    }

    // Podrías añadir aquí un ChannelInterceptor para manejar la autenticación de conexiones STOMP
    // y asociar el `java.security.Principal` con la sesión WebSocket.
    // Esto es crucial para que `SimpMessageHeaderAccessor.getUser()` funcione.
    // Ver documentación de Spring Security WebSocket para más detalles.

}