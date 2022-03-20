package com.OnlineTickets.backend.repository;

import com.OnlineTickets.backend.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PassengerRepository extends JpaRepository<Passenger, Integer> {
    @Query(value = "from Passenger WHERE id in ?1")
    List<Passenger> getPassengerById(List<Integer> pid);
}
