package com.Lagos.State.University.Virtual.Notice.Board.DTO;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.AccountTools;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Enum.AccountType;

public record ProfileDTO(

        String firstName,
        String lastName,
        String set,
        String faculty,
        String department,
        String matricNumber,
        Boolean isVerified,
        AccountType Type
        
) {
}
