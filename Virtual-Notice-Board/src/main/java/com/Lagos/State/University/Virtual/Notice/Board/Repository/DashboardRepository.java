package com.Lagos.State.University.Virtual.Notice.Board.Repository;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {

    @Query("SELECT b FROM Dashboard b WHERE b.faculty = :faculty")
    List<Dashboard> findByFaculty(@Param("faculty") String faculty);

    @Query("SELECT b FROM Dashboard b WHERE b.mains = :mains")
    List<Dashboard> findByMains(@Param("mains") String mains);

    @Query("SELECT b FROM Dashboard b WHERE b.department = :department")
    List<Dashboard> findByDepartment(@Param("department") String department);
}
