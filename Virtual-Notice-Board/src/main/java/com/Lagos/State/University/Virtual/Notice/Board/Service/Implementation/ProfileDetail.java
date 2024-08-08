package com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation;

import com.Lagos.State.University.Virtual.Notice.Board.Exception.ProfileException;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.ProfileRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ProfileDetail implements UserDetailsService {

    private final ProfileRepository profileRepository;

    public ProfileDetail(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return profileRepository.findByMatricNumber(username)
                .orElseThrow(()-> new ProfileException("Student With Username "+username+" Not Found"));
    }
}
