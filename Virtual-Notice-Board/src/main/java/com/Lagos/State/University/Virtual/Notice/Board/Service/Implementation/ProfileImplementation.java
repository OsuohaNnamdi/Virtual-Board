package com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation;

import com.Lagos.State.University.Virtual.Notice.Board.Configuration.JWT.JWT;
import com.Lagos.State.University.Virtual.Notice.Board.DTO.DTO_Mapper.ProfileMapper;
import com.Lagos.State.University.Virtual.Notice.Board.DTO.ProfileDTO;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.LoginRequest;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.LoginResponse;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.ProfileException;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.ProfileRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class ProfileImplementation implements ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private  final JWT jwt;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public ProfileImplementation(ProfileRepository profileRepository, ProfileMapper profileMapper, JWT jwt, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
        this.jwt = jwt;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public void addStudent(Profile request) throws ProfileException {



        Optional<Profile> response = profileRepository.findByEmail(request.getEmail());

        if (response.isPresent()){
            throw new ProfileException("Student Exist");
        }
        else {
            Profile profile = new Profile();

            profile.setEmail(request.getEmail());
            profile.setFirstName(request.getFirstName());
            profile.setLastName(request.getLastName());
            profile.setPassword(passwordEncoder.encode(request.getPassword()));
            profile.setFaculty(request.getFaculty());
            profile.setDepartment(request.getDepartment());
            profile.setSet(request.getSet());
            if (request.getVerified() == null || request.getVerified().equals(false)){
                profile.setVerified(false);
            }else {
                profile.setVerified(true);
            }

            profile.setType(request.getType());


            profileRepository.save(profile);
        }
    }

    @Override
    public LoginResponse login(LoginRequest request) throws ProfileException {
        try{
            Authentication authentication = authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.password()
            ));
            Profile principal = (Profile) authentication.getPrincipal();

            ProfileDTO profileDTO = profileMapper.apply(principal);

            String token = jwt.issuedToken(profileDTO.email(), "Student");

            return new LoginResponse(profileDTO , token);
        }catch (AuthenticationException e) {

            return null;
        }
    }

    @Override
    public void deleteById(Long id) {
        profileRepository.deleteById(id);
    }


}
