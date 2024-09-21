package com.Lagos.State.University.Virtual.Notice.Board.Service;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.LoginRequest;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.LoginResponse;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.ProfileException;

import java.util.UUID;

public interface ProfileService {

    void addStudent (Profile profile) throws ProfileException;

    LoginResponse login(LoginRequest request) throws ProfileException;

    void deleteById(Long id);
}
