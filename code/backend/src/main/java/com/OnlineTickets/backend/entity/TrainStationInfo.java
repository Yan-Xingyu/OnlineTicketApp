package com.OnlineTickets.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.BitSet;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "train_stationinfo")
@JsonIgnoreProperties(value={"handler", "hibernateLazyInitializer","fieldHandler"})
public class TrainStationInfo implements Comparable<TrainStationInfo>{
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    Integer id;
    private Integer arriveCid;

    private Integer stopTime;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "arrive_sid")
    private Integer arriveSid;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date arriveTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date leaveTime;
    private byte[] firstSeatBits;
    private byte[] secondSeatBits;
    private byte[] vipSeatBits;
    private byte[] standSeatBits;
    private byte[] hardLieBits;
    /*@JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL,targetEntity = TrainInfo.class)
    @JoinColumn(name = "train_id",referencedColumnName = "train_id")
    private TrainInfo trainInfo;*/
    @Column(name = "train_id")
    private Integer trainId;
    private byte[] softLieBits;
    private Integer stationNo;
    private String stationName;

    @Override
    public int compareTo(TrainStationInfo o) {
        return this.stationNo.compareTo(o.stationNo);
    }
}
