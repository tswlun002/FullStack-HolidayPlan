package com.Tour.controller;


import com.Tour.exception.NotFoundException;
import com.Tour.exception.NullException;
import com.Tour.dto.HolidayPlaDTO;
import com.Tour.dto.HolidayPlanResponseDTO;
import com.Tour.service.HolidayPlanService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;

@RestController
@CrossOrigin( origins = "*",originPatterns = "http://localhost:3000/**")
@RequestMapping("/holiday-plan/api/")
public class HolidayPlanController {
    @Autowired
    HolidayPlanService holidayPlanService;
    @PostMapping(value = "holiday/save/", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public void saveHolidayPlan(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        var holiday = request.getPart("holiday");
        var  images = request.getParts().stream().filter(part -> part.getName().equals("images")).toList();
        if(holiday==null) throw  new NullException("Holiday is invalid");
        HolidayPlaDTO holidayDTO  =new  ObjectMapper().readValue(holiday.getInputStream().readAllBytes(), HolidayPlaDTO.class);;
        var saved= holidayPlanService.saveHolidayPlan(holidayDTO,images);
        Map<String,String> response_ = new HashMap<>();
        response_.put("message", saved?"Saved successfully":"Not saved");
        response.setStatus(saved?OK.value(): NOT_ACCEPTABLE.value());
        new ObjectMapper().writeValue(response.getOutputStream(),response_);

    }
    @GetMapping(value = "holiday/holidays/")
<<<<<<< HEAD
    public ResponseEntity<Set<HolidayPlanResponseDTO>> getHolidayPlans()  {
        var holidayPlans=  holidayPlanService.getHolidayPlans();
        if(holidayPlans.size()==0) throw  new NotFoundException("No HolidayPlan");
=======
    public ResponseEntity<Set<HolidayPlan>> getHolidayPlans()  {
        var holidayPlans=  holidayPlanService.getHolidayPlans();
        if(holidayPlans.size()==0) throw  new NotFoundException("No HolidayPlan");
        HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("desc","HolidayPlans");
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7

        var response =  holidayPlans.stream().map(hp->{
             var images  = holidayPlanService.getHolidayPlanImages(hp.getId());
             return  HolidayPlanResponseDTO.builder().event(hp.getEvent()).description(hp.getDescription())
                     .startDate(hp.getStartDate()).endDate(hp.getEndDate()).city(hp.getCity()).images(images).
            priorityLevel(String.valueOf(hp.getPriorityLevel())).id(hp.getId()).location(hp.getLocation()).build();

        }).collect(Collectors.toSet());
        return  response.isEmpty()?new ResponseEntity<>(null,HttpStatus.NOT_FOUND):new ResponseEntity<>(response, OK);
    }

    @DeleteMapping("holiday/delete/holiday-plan/{id}")
    public  ResponseEntity<Boolean> deleteHolidayPlan(@PathVariable("id") long id){
        boolean deleteHolidayPlan= holidayPlanService.deleteHolidayPlan(id);
       if(deleteHolidayPlan) return  new ResponseEntity<>(true, OK);
       return  new ResponseEntity<>(false, NOT_ACCEPTABLE);
    }

    @PatchMapping("holiday/update/holiday-plan/")
    public  ResponseEntity<Boolean>  updateHolidayPlan(@RequestParam long holidayPlanId,@RequestParam int level){
        boolean updatedHolidayPlan= holidayPlanService.updateHolidayPlan( holidayPlanId,level);
<<<<<<< HEAD
        if(updatedHolidayPlan) return  new ResponseEntity<>(true, OK);
        return  new ResponseEntity<>(false, NOT_ACCEPTABLE);
=======
        if(updatedHolidayPlan) return  new ResponseEntity<>(true,HttpStatus.OK);
        return  new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
    }
}
