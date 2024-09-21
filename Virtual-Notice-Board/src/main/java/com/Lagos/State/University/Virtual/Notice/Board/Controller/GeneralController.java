package com.Lagos.State.University.Virtual.Notice.Board.Controller;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Answer;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Dashboard;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;
import com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation.GeneralImplementation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping(path = "/api/v1/dashboard")
public class GeneralController {


    private final GeneralImplementation generalImplementation;

    public GeneralController(GeneralImplementation generalImplementation) {
        this.generalImplementation = generalImplementation;
    }

    @GetMapping("/faculty/list/{id}")
    public List<Dashboard> getFacultyList (@PathVariable String id){

        return generalImplementation.getFacultyList(id);
    }

    @GetMapping("/main/list/{id}")
    public List<Dashboard> getMainList (@PathVariable String id){

        return generalImplementation.getMainList(id);
    }

    @GetMapping("/department/list/{id}")
    public List<Dashboard> getDepartmentList (@PathVariable String id){

        
        return generalImplementation.getDepartmentList(id);
    }

    @GetMapping
    public ResponseEntity<List<Dashboard>> getAllDashboards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Dashboard> dashboards = generalImplementation.getAllNotice(page, size);
            return ResponseEntity.ok(dashboards);
        } catch (GeneralException e) {
            return ResponseEntity.status(500).build();
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Dashboard> getDashboardById(@PathVariable Long id) {
        try {
            Dashboard dashboard = generalImplementation.getNoticeById(id);
            return ResponseEntity.ok(dashboard);
        } catch (GeneralException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

        @PostMapping("/add")
        public ResponseEntity<Dashboard> createNotice(@ModelAttribute Dashboard request,
                                                         @RequestPart("document") MultipartFile document) {
            try {
                generalImplementation.createNotice(request , document);
                return ResponseEntity.ok().build();
            } catch (GeneralException e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    @PostMapping("/adder")
    public ResponseEntity<Dashboard> createDashboard(@RequestBody Dashboard request) {
        try {
            generalImplementation.createDashboard(request);
            return ResponseEntity.ok().build();
        } catch (GeneralException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

        @PutMapping("/update/{id}")
        public ResponseEntity<Dashboard> updateDashboard(@PathVariable Long id,
                                                         @ModelAttribute Dashboard request                                                      ) {
            try {
                generalImplementation.updateNotice(id, request);
                return ResponseEntity.ok()
                        .build();

            } catch (GeneralException e) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        }

        @DeleteMapping("/delete/{id}")
        public ResponseEntity<HttpStatus> deleteDashboard(@PathVariable Long id) {
            try {
               generalImplementation.deleteNotice(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (RuntimeException e) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }

