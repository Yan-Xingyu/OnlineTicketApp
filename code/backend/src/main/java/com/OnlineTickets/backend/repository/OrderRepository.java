package com.OnlineTickets.backend.repository;

import com.OnlineTickets.backend.entity.UserOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<UserOrder, Integer> {

    @EntityGraph(value = "UserOrder.Graph", type = EntityGraph.EntityGraphType.FETCH)
    List<UserOrder> findByUserId(Integer userId);

    @Query(value= "from UserOrder u WHERE u.userId=?1 AND u.orderTime>=?2 AND u.status =1")
    @EntityGraph(value = "UserOrder.Graph", type = EntityGraph.EntityGraphType.FETCH)
    List<UserOrder> findFutureOrder(Integer userId,Date tmpTime);

    @Query(value= "from UserOrder u WHERE u.userId=?1 AND u.orderTime<?2")
    @EntityGraph(value = "UserOrder.Graph", type = EntityGraph.EntityGraphType.FETCH)
    List<UserOrder> findHistoryOrder(Integer userId,Date tmpTime);

    @Query(value = "from UserOrder u WHERE u.userId=?1 AND u.orderTime>=?2 AND u.orderTime<?3 AND u.status =1" )
    @EntityGraph(value = "UserOrder.Graph", type = EntityGraph.EntityGraphType.FETCH)
    List<UserOrder> findUserOrderByTime(Integer userId, Date startDate, Date endDate);

    @Modifying
    @Query("UPDATE UserOrder u SET u.status=?2 WHERE u.orderId=?1")
    void changeStatus(Integer orderId,int status);

}
