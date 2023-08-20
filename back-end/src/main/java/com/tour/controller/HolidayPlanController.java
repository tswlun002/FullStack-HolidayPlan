package com.tour.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.dto.HolidayPlaDTO;
import com.tour.dto.HolidayPlanResponseDTO;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.service.HolidayPlanService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/holiday-plan/api/")
public class HolidayPlanController {
    @Autowired
    HolidayPlanService holidayPlanService;
    @PostMapping(value = "holiday/save/", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public void saveHolidayPlan(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        var holiday = request.getPart("holiday");
        var  images = request.getParts().stream().filter(part -> part.getName().equals("images")).toList();
        if(holiday==null) throw  new NullException("Holiday is invalid");
        HolidayPlaDTO holidayDTO  =new  ObjectMapper().readValue(holiday.getInputStream().readAllBytes(), HolidayPlaDTO.class);
        var saved= holidayPlanService.saveHolidayPlan(holidayDTO,images);
        Map<String,String> response_ = new HashMap<>();
        response_.put("message", saved?"Saved successfully":"Not saved");
        response.setStatus(saved?OK.value(): NOT_ACCEPTABLE.value());
        new ObjectMapper().writeValue(response.getOutputStream(),response_);

    }
    @GetMapping(value = "holiday/holidays/")
    public ResponseEntity<Set<HolidayPlanResponseDTO>> getHolidayPlans()  {
        var holidayPlans=  holidayPlanService.getHolidayPlans();
        if(holidayPlans.isEmpty()) throw  new NotFoundException("No HolidayPlan");

        var response =  holidayPlans.stream().map(hp->{
             var images  = holidayPlanService.getHolidayPlanImages(hp.getId());
             return  HolidayPlanResponseDTO.builder().event(hp.getEvent()).description(hp.getDescription())
                     .startDate(hp.getStartDate()).endDate(hp.getEndDate()).city(hp.getCity()).images(images).
            priorityLevel(String.valueOf(hp.getPriorityLevel())).id(hp.getId()).location(hp.getLocation()).build();

        }).collect(Collectors.toSet());
        return  response.isEmpty()?new ResponseEntity<>(null,HttpStatus.NOT_FOUND):new ResponseEntity<>(response, OK);
    }
    Date parseDate(String date){
        try {
            return new SimpleDateFormat("dd/MM/yyyy").parse(date);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
    @GetMapping(value = "holiday/filtered-holiday-plans/")
    public ResponseEntity<Set<HolidayPlanResponseDTO>> getHolidayPlans(
            @RequestParam(name = "username") String username,
            @RequestParam(required = false,name = "city",defaultValue = " ") List<String> city,
            @RequestParam(required = false ,name = "location", defaultValue = "") List<String> location,
            @RequestParam(required = false, name = "start", defaultValue = "")  List<Date> start,
            @RequestParam(required = false, name = "end", defaultValue = "")   List<Date>  end,
            @RequestParam(required = false , name = "event") List<String>event,
            @RequestParam(required = false, name = "priorityLevel")List<Integer> priorityLevel
    )  {

        var holidayPlans=  holidayPlanService.filterHolidayPlan(username,city, location,start,end, event, priorityLevel);
        if(holidayPlans.isEmpty()) throw  new NotFoundException("No HolidayPlan for given filter(s)");

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
        if(updatedHolidayPlan) return  new ResponseEntity<>(true, OK);
        return  new ResponseEntity<>(false, NOT_ACCEPTABLE);
    }
}
