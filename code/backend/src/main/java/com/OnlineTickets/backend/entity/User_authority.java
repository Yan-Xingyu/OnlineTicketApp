package com.OnlineTickets.backend.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "user_authority")
@JsonIgnoreProperties(value={"handler", "hibernateLazyInitializer","fieldHandler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
public class User_authority {
    private int id;
    private String password;
    private String e_mail;
    private String tel_number;
    private String username;

    @Id
    @Column(name = "user_id")
    public int getId(){ return this.id; }
    public void setId(int id){ this.id = id;}

    @Basic
    @Column(name = "username")
    public String getUsername(){ return this.username; }
    public void setUsername(String username){ this.username = username; }

    @Basic
    @Column(name = "password")
    public String getPassword(){ return this.password; }
    public void setPassword(String password){ this.password = password; }

    @Basic
    @Column(name = "email")
    public String getE_mail(){ return this.e_mail; }
    public void setE_mail(String e_mail){ this.e_mail = e_mail; }

    @Basic
    @Column(name = "tel_number")
    public String getTel_number(){ return this.tel_number; }
    public void setTel_number(String tel_number){ this.tel_number = tel_number; }

}
