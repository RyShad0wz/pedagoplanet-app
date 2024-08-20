package com.cda.pedagoplanet.repository;

import com.cda.pedagoplanet.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllBySenderId(Long senderId);
    List<Message> findAllByReceiverId(Long receiverId);
    List<Message> findAllBySenderIdAndReceiverIdOrReceiverIdAndSenderId(Long senderId, Long receiverId, Long receiverId2, Long senderId2);
}

