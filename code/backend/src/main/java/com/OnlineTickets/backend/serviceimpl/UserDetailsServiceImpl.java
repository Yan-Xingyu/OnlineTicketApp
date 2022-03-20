package com.OnlineTickets.backend.serviceimpl;

import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.Collections.emptyList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository applicationUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<MyUser> applicationUser = applicationUserRepository.findByUsername(username);
        if (applicationUser.size() == 0) {
            throw new UsernameNotFoundException(username);
        }
        return new User(applicationUser.get(0).getUsername(), applicationUser.get(0).getPassword(), emptyList());
    }
}
