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

	/*@Bean
	CommandLineRunner runner (ProfileRepository repository, PasswordEncoder passwordEncoder){

		return args -> {

			Profile profile = new Profile();

			profile.setFirstName("Abdul Jalal");
			profile.setLastName("Ahmeed");
			profile.setSet( "2020/2021");
			profile.setMatricNumber("200591016");
			profile.setDepartment("Department of Computer Science");
			profile.setFaculty("Faculty of Science");
			profile.setPassword(passwordEncoder.encode("12345"));
			profile.setType(AccountType.STUDENT);

			repository.save(profile);

			
		};
	}*/

}