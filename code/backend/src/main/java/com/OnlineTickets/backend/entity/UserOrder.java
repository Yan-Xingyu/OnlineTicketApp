package com.OnlineTickets.backend.entity;

import com.fasterxml.jackson.annotation.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Setter
@Getter
@Entity
@JsonIgnoreProperties(value = {"handler", "hibernateLazyInitializer", "fieldHandler"})
@Table(name = "user_order")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "orderId")
@NamedEntityGraph(name = "UserOrder.Graph", attributeNodes = {@NamedAttributeNode("orderItems")})
public class UserOrder {
    @Id
    @Column(name = "order_id")
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private int orderId;
    private String startStation;
    private String endStation;
    private Date orderTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;

    private Integer trainType;
    private Integer trainId;
    private String trainTag;
    @JsonIgnore
    private Integer userId;
    private Integer status;
    @OneToMany(orphanRemoval = true,cascade = {CascadeType.MERGE,CascadeType.REFRESH,CascadeType.PERSIST,CascadeType.REMOVE},targetEntity = OrderItem.class)
    @JoinColumn(name = "order_id",referencedColumnName = "order_id")  //这里要写类的属性名不能写表的column名，不然会报错
    private Set<OrderItem> orderItems;
    private Integer modifyId;
}
