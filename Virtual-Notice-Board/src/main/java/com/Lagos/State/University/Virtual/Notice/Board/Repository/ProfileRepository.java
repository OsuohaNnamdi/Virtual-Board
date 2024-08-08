package com.Lagos.State.University.Virtual.Notice.Board.Repository;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Optional;

@EnableJpaRepositories
public interface ProfileRepository extends JpaRepository<Profile , Long> {


    Optional<Profile> findByMatricNumber(String matricNumber);
}
