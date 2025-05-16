package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Room findRoomById(Long id);

}
