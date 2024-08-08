package com.Lagos.State.University.Virtual.Notice.Board.DTO.DTO_Mapper;

import com.Lagos.State.University.Virtual.Notice.Board.DTO.ProfileDTO;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import org.springframework.stereotype.Component;

import java.util.function.Function;
@Component
public class ProfileMapper implements Function <Profile , ProfileDTO>{

    @Override
    public ProfileDTO apply(Profile profile) {
        return new ProfileDTO(
                profile.getFirstName(),
                profile.getLastName(),
                profile.getSet(),
                profile.getFaculty(),
                profile.getDepartment(),
                profile.getMatricNumber(),
                profile.getVerified(),
                profile.getType()
        );
    }
}
