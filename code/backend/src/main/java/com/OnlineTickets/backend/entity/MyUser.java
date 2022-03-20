package com.OnlineTickets.backend.entity;

import com.fasterxml.jackson.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;

import java.util.Date;
import java.util.Set;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "user")
@JsonIgnoreProperties(value={"handler", "hibernateLazyInitializer","fieldHandler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
public class MyUser {
    private int id;
    private int tourist_type;
    private int state;
    private String username;
    private String password;
    private String email;
    private String region;
    private String real_name;
    private String tel_number;
    private String address;
    private String certificate_type;
    private Set<Passenger> passengers;
    private Date last_login_time;



    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = IDENTITY)
    public int getId(){ return this.id; }
    public void setId(int id){ this.id = id;}

    @Basic
    @Column(name = "state")
    public int getState(){ return this.state; }
    public void setState(int state){ this.state = state; }

    @Basic
    @Column(name = "username")
    public String getUsername(){ return this.username; }
    public void setUsername(String username){ this.username = username; }

    @Basic
    @Column(name = "password")
    public String getPassword(){ return this.password; }
    public void setPassword(String password){ this.password = password; }

    @Basic
    @Column(name = "region")
    public String getRegion(){ return this.region; }
    public void setRegion(String region){ this.region = region; }

    @Basic
    @Column(name = "real_name")
    public String getReal_name(){ return this.real_name; }
    public void setReal_name(String real_name){ this.real_name = real_name; }

    @Basic
    @Column(name = "tourist_type")
    public int getTourist_type(){ return this.tourist_type; }
    public void setTourist_type(int tourist_type){ this.tourist_type = tourist_type; }

    @Basic
    @Column(name = "email")
    public String getEmail(){ return this.email; }
    public void setEmail(String e_mail){ this.email = e_mail; }

    @Basic
    @Column(name = "tel_number")
    public String getTel_number(){ return this.tel_number; }
    public void setTel_number(String tel_number){ this.tel_number = tel_number; }

    @Basic
    @Column(name = "address")
    public String getAddress(){ return this.address; }
    public void setAddress(String address){ this.address = address; }

    @Basic
    @Column(name = "certificate_type")
    public String getCertificate_type(){ return this.certificate_type; }
    public void setCertificate_type(String certificate_type){ this.certificate_type = certificate_type; }

    @Column(name = "last_login_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    public Date getLast_login_time(){ return this.last_login_time; }
    public void setLast_login_time(Date login_time){ this.last_login_time = login_time; }

    @JsonIgnore
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "user_passengers", joinColumns={@JoinColumn(name="user_id")},
            inverseJoinColumns={@JoinColumn(name="passenger_id")})
    public Set<Passenger> getPassengers(){ return this.passengers; }
    public void setPassengers(Set<Passenger> passengers){ this.passengers = passengers; }



}

