package com.webserdi.backend.controller;

import com.webserdi.backend.entity.Message;
import com.webserdi.backend.entity.Room;
import com.webserdi.backend.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    //Crear Room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Long roomId){
        if (roomRepository.findRoomById(roomId) != null) {
            return ResponseEntity.badRequest().body("Ya existe una sala con ese ID");
        }
        Room room = new Room();
        room.setId(roomId);
        Room savedRoom = roomRepository.save(room);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    //Ingresar a Room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable Long roomId) {
        Room room = roomRepository.findRoomById(roomId);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(room);
    }


    //Obtener mensajes de Room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getRoomMessages(@PathVariable Long roomId,
                                                         @RequestParam(value="page", defaultValue = "0", required = false) int page,
                                                         @RequestParam(value="size", defaultValue = "20", required = false) int size) {
        Room room = roomRepository.findRoomById(roomId);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);
        List<Message> paginatedMessages = messages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);
    }


}

