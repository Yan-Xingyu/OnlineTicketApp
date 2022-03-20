package com.OnlineTickets.backend.repository;

import com.OnlineTickets.backend.entity.MyUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<MyUser, Integer> {
    List<MyUser> findByUsername(String username);
    List<MyUser> findByEmail(String e_mail);
}
