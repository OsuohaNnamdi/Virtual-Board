package com.Lagos.State.University.Virtual.Notice.Board.Controller;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.LoginRequest;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.LoginResponse;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation.ProfileImplementation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1")
public class ProfileController {

    private final ProfileImplementation profileImplementation;

    public ProfileController(ProfileImplementation profileImplementation) {
        this.profileImplementation = profileImplementation;
    }


    @PostMapping("/register")
    public ResponseEntity<?> Add_users(@RequestBody Profile profile){

        profileImplementation.addStudent(profile);
        return  ResponseEntity
                .ok()
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResponse response = profileImplementation.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, response.token())
                .body(response);
    }

}
