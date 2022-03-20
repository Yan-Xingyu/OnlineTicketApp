package com.OnlineTickets.backend.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "train_info")
@JsonIgnoreProperties(value={"handler", "hibernateLazyInitializer","fieldHandler"})
@NamedEntityGraph(name = "TrainInfo.Graph", attributeNodes = {@NamedAttributeNode("trainStationInfoSet")})
public class TrainInfo {
    @Id
    @Column(name="train_id")
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private int trainId;

    @Column(name = "train_no")
    private String trainNo;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_date")
    private Date startDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "end_date")
    private Date endDate;
    @Column(name = "train_tag")
    private String trainTag;
    @Column(name = "train_type")
    private Integer trainType;


    @OneToMany(cascade = CascadeType.ALL,targetEntity = TrainStationInfo.class)
    @JoinColumn(name = "train_id",referencedColumnName = "train_id")
    private Set<TrainStationInfo> trainStationInfoSet;


}
