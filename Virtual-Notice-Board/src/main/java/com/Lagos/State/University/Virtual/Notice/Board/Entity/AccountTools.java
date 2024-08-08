package com.Lagos.State.University.Virtual.Notice.Board.Entity;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Enum.AccountType;



import jakarta.persistence.*;

@Entity
@Table(name = "AccountTools")
public class AccountTools {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private boolean isVerified;

    @Enumerated(EnumType.STRING)
    private AccountType type;

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Boolean getVerified() {
        return isVerified;
    }

    public void setVerified(Boolean verified) {
        isVerified = verified;
    }

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }
}
