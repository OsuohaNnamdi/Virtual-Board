package com.Lagos.State.University.Virtual.Notice.Board;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Enum.AccountType;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.ProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class VirtualNoticeBoardApplication {

	public static void main(String[] args) {
		SpringApplication.run(VirtualNoticeBoardApplication.class, args);
	}

	

}