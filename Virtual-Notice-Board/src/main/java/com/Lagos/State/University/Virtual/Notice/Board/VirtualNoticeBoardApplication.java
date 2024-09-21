package com.Lagos.State.University.Virtual.Notice.Board;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Enum.AccountType;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.ProfileException;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.ProfileRepository;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootApplication
public class VirtualNoticeBoardApplication {

	public static void main(String[] args) {
		SpringApplication.run(VirtualNoticeBoardApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(ProfileRepository profileRepository, PasswordEncoder passwordEncoder){
		return args -> {
			Profile admin = new Profile();

			admin.setFirstName("Abdul-Jalal");
			admin.setSet("2020/2021");
			admin.setLastName("Ahmeed");
			admin.setVerified(true);
			admin.setFaculty("Faculty of Science");
			admin.setDepartment("Department of Computer Science");
			admin.setMatricNumber("test1");
			admin.setType(AccountType.STUDENT);
			admin.setPassword(passwordEncoder.encode("12345"));


			Optional<Profile> response = profileRepository.findByMatricNumber(admin.getMatricNumber());

			if (response.isPresent()){
				return;
			}
			else{
				profileRepository.save(admin);
			}

		};
	}

}