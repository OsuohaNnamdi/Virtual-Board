package com.Lagos.State.University.Virtual.Notice.Board.Entity;

import com.Lagos.State.University.Virtual.Notice.Board.DTO.ProfileDTO;

public record LoginResponse(
        ProfileDTO profileDTO,
        String token

) {
}
