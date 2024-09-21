package com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation;


import com.Lagos.State.University.Virtual.Notice.Board.Entity.Dashboard;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.DashboardRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Service.GeneralService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
public class GeneralImplementation implements GeneralService {

    private final DashboardRepository dashboardRepository;

    private final CloudinaryService cloudinaryService;

    public GeneralImplementation(DashboardRepository dashboardRepository, CloudinaryService cloudinaryService) {
        this.dashboardRepository = dashboardRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public List<Dashboard> getDepartmentList(String request) throws GeneralException {
        return dashboardRepository.findByDepartment(request);
    }

    @Override
    public List<Dashboard> getFacultyList(String request) throws GeneralException {
        return dashboardRepository.findByFaculty(request);
    }

    @Override
    public List<Dashboard> getMainList(String request) throws GeneralException {
        return dashboardRepository.findByMains(request);
    }

    @Override
    public void createNotice(Dashboard request, MultipartFile image) throws GeneralException {

        String response = cloudinaryService.uploadImage(image);


        Dashboard dashboard = new Dashboard();


        dashboard.setSubject(request.getSubject());
        dashboard.setSource(request.getSource());
        if (response != null){
            dashboard.setImageUrl(response);
        }else {
            dashboard.setImageUrl("https://images.app.goo.gl/y1xZCSrs7EwKEWcA8");
        }
        dashboard.setContent(request.getContent());
        dashboard.setMains(request.getMains());
        dashboard.setFaculty(request.getFaculty());
        dashboard.setDepartment(request.getDepartment());
        dashboard.setDate(LocalDate.now());



        dashboardRepository.save(dashboard);

    }



    @Override
    public Dashboard getNoticeById(Long id) throws GeneralException {

        try {
            Optional<Dashboard> dashboardOptional = dashboardRepository.findById(id);
            if (dashboardOptional.isPresent()) {
                return dashboardOptional.get();
            } else {
                throw new GeneralException("Dashboard not found with id " + id);
            }
        } catch (Exception e) {
            throw new GeneralException("Failed to fetch dashboard by id");
        }
    }



    @Override
    public List<Dashboard> getAllNotice(int page, int size) throws GeneralException {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Dashboard> dashboardPage = dashboardRepository.findAll(pageable);
            return dashboardPage.getContent();
        } catch (GeneralException e) {
            throw new GeneralException("Failed to fetch notices");
        }
    }

    @Override
    public void updateNotice(Long id, Dashboard request) throws GeneralException{

        Optional<Dashboard> optionalDashboard = dashboardRepository.findById(id);



        if (optionalDashboard.isPresent()) {

            
            Dashboard dashboard = optionalDashboard.get();
            dashboard.setSubject(request.getSubject());
            dashboard.setSource(request.getSource());
            dashboard.setContent(request.getContent());
            dashboard.setDate(LocalDate.now());

            dashboardRepository.save(dashboard);
        }

        else {
            throw new RuntimeException("Dashboard not found with id ");
        }
    }

    @Override
    public void deleteNotice(Long id) throws GeneralException {

        Optional<Dashboard> optionalDashboard = dashboardRepository.findById(id);
        if (optionalDashboard.isPresent()) {
            cloudinaryService.deleteImage(optionalDashboard.get().getImageUrl());
            dashboardRepository.deleteById(id);
        } else {
            throw new RuntimeException("Dashboard not found with id " + id);
        }
    }

    @Override
    public void createDashboard(Dashboard request) {
        dashboardRepository.save(request);
    }
}


