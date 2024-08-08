package com.Lagos.State.University.Virtual.Notice.Board.Service;


import com.Lagos.State.University.Virtual.Notice.Board.Entity.Dashboard;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

public interface GeneralService {

    List<Dashboard> getAllNotice (int page, int size) throws GeneralException;

    List<Dashboard> getDepartmentList(String request) throws GeneralException;

    List<Dashboard> getFacultyList(String request) throws GeneralException;

    List<Dashboard> getMainList(String request) throws GeneralException;

    void createNotice (Dashboard request , MultipartFile image ) throws GeneralException;

    Dashboard getNoticeById (Long id) throws GeneralException;

    void updateNotice (Long id , Dashboard request , MultipartFile image ) throws GeneralException;

    void deleteNotice (Long id) throws GeneralException;


    

}
