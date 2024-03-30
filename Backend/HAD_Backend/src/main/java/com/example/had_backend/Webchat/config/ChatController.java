package com.example.had_backend.Webchat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @MessageMapping("/message") // /app/message
    @SendTo("/chatroom/public")
    public ChatMessage receivePublicMessage(@Payload ChatMessage chatmessage){
        return chatmessage;
    }

    @MessageMapping("/private-message")
    public ChatMessage receivePrivateMessage(@Payload ChatMessage chatmessage)
    {
        simpMessagingTemplate.convertAndSendToUser(chatmessage.getReceiverName(),"/private",chatmessage);
        return chatmessage;
    }

}
