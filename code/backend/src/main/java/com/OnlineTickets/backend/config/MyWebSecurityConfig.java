package com.OnlineTickets.backend.config;

import com.OnlineTickets.backend.filter.JWTLoginFilter;
import com.OnlineTickets.backend.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.boot.autoconfigure.security.SecurityProperties;

@Configuration
public class MyWebSecurityConfig extends WebSecurityConfigurerAdapter {
    private UserDetailsService userDetailsService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public MyWebSecurityConfig(UserDetailsService userDetailsService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userDetailsService = userDetailsService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests()
                .antMatchers(HttpMethod.POST, "/Register").permitAll()
                .antMatchers(HttpMethod.POST, "/searchStation").permitAll()
                .antMatchers(HttpMethod.POST,"/JudgeUsername").permitAll()
                .antMatchers(HttpMethod.POST, "/mail").permitAll()
                .antMatchers(HttpMethod.POST,"/PtoPSearch").permitAll()
                .antMatchers(HttpMethod.POST,"/PassBySearch").permitAll()
                .antMatchers(HttpMethod.POST, "/trainNoSearch").permitAll()
                .antMatchers(HttpMethod.POST, "/getSmsAsk").permitAll()
                .antMatchers(HttpMethod.POST, "/PasswordAsk").permitAll()
                .antMatchers(HttpMethod.GET,"/download").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginProcessingUrl("/Login")
                .and()
                .addFilter(new JWTLoginFilter(authenticationManager()))
                .addFilter(new JwtAuthenticationFilter(authenticationManager()));
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
    }
}
