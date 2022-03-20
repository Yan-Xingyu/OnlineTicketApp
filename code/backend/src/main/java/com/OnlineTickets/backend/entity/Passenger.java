package com.OnlineTickets.backend.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "passenger")
@JsonIgnoreProperties(value={"handler", "hibernateLazyInitializer","fieldHandler"})

public class Passenger {
    private int id;
    private int certificate_type;
    private int type;
    private String real_name;
    private String tel_number;
    private String card_id;

    @Id
    @Column(name = "passenger_id")
    @GeneratedValue(strategy = IDENTITY)
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "certificate_type")
    public int getCertificate_type() {
        return this.certificate_type;
    }

    public void setCertificate_type(int certificate_type) {
        this.certificate_type = certificate_type;
    }

    @Basic
    @Column(name = "type")
    public int getType(){
        return this.type;
    }
    public void setType(int type){
        this.type = type;
    }

    @Basic
    @Column(name = "real_name")
    public String getReal_name() {
        return this.real_name;
    }

    public void setReal_name(String real_name) {
        this.real_name = real_name;
    }

    @Basic
    @Column(name = "tel_number")
    public String getTel_number() {
        return this.tel_number;
    }

    public void setTel_number(String tel_number) {
        this.tel_number = tel_number;
    }

    @Basic
    @Column(name = "id_number")
    public String getCard_id(){
        return this.card_id;
    }
    public void setCard_id(String card_id){
        this.card_id = card_id;
    }

}
