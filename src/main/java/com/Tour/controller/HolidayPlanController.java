package com.Tour.controller;


import com.Tour.exception.CatchException;
import com.Tour.exception.NotFoundException;
import com.Tour.exception.NullException;
import com.Tour.model.HolidayLocationImages;
import com.Tour.model.HolidayPlan;
import com.Tour.service.HolidayPlaDTO;
import com.Tour.service.HolidayPlanResponseDTO;
import com.Tour.service.HolidayPlanService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin( origins = "*",originPatterns = "http://localhost:3000/**")
@RequestMapping("/holiday-plan/api/")
public class HolidayPlanController {
    @Autowired
    HolidayPlanService holidayPlanService;
    @PostMapping(value = "holiday/save/", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Boolean> saveHolidayPlan(@RequestPart("holiday") MultipartFile holiday,
                                                   @RequestParam MultipartFile[] images) throws IOException {
         var saved =false;
         if(holiday==null) throw  new NullException("Holiday is invalid");
         HolidayPlaDTO holidayDTO  =new  ObjectMapper().readValue(holiday.getBytes(), HolidayPlaDTO.class);;
         System.out.println("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLl" + holidayDTO);
        saved= holidayPlanService.saveHolidayPlan(holidayDTO,images);
        return saved?new ResponseEntity<>(true,HttpStatus.OK)
        :  new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
    @GetMapping(value = "holiday/holidays/")
    public ResponseEntity<Set<HolidayPlanResponseDTO>> getHolidayPlans()  {
        var holidayPlans=  holidayPlanService.getHolidayPlans();
        if(holidayPlans.size()==0) throw  new NotFoundException("No HolidayPlan");

        var response =  holidayPlans.stream().map(hp->{
             var images  = holidayPlanService.holidayLocationImages(hp.getId());
             return  HolidayPlanResponseDTO.builder().event(hp.getEvent()).description(hp.getDescription())
                     .startDate(hp.getStartDate()).endDate(hp.getEndDate()).city(hp.getCity()).images(images).
            priorityLevel(String.valueOf(hp.getPriorityLevel())).id(hp.getId()).location(hp.getLocation()).build();

        }).collect(Collectors.toSet());
        return  response.isEmpty()?new ResponseEntity<>(null,HttpStatus.NOT_FOUND):new ResponseEntity<>(response,HttpStatus.OK);
    }
    @GetMapping("holiday/{location}/{city}")
    public ResponseEntity<Set<HolidayPlan>> getHolidayPlan(
                                      @PathVariable String location, @PathVariable String city) throws NotFoundException {

        var holidayPlans=  holidayPlanService.getHolidayPlan(location,city);
        if(holidayPlans.size()==0) throw  new NotFoundException("No HolidayPlan found at "
        +location +", "+city);
        return  new ResponseEntity<>(holidayPlans,HttpStatus.FOUND);
    }
    @GetMapping("holiday/{location}/{city}/{start_date}")
    public ResponseEntity<Set<HolidayPlan>> getHolidayPlan(@PathVariable String location,
                                      @PathVariable String city, @PathVariable Date start_date) throws NotFoundException {
        var holidayPlans=  holidayPlanService.getHolidayPlan(location,city);
        if(holidayPlans.size()==0) throw  new NotFoundException("No HolidayPlan found at "
                +location +", "+city +" from "+start_date);
        return  new ResponseEntity<>(holidayPlans,HttpStatus.FOUND);
    }
    @GetMapping("holiday/{location}/{city}/{start_date}/{end_date}")
    public ResponseEntity<Set<HolidayPlan>> getHolidayPlan(@PathVariable String location,
                                      @PathVariable  String city,@PathVariable Date start_date,
                                      @RequestBody Date end_date) throws NotFoundException {
        var holidayPlans=  holidayPlanService.getHolidayPlan(location,city);
        if(holidayPlans.size()==0) throw  new NotFoundException("No HolidayPlan found at "
                +location +", "+city +" between "+start_date +" & " +end_date);
        return  new ResponseEntity<>(holidayPlans,HttpStatus.FOUND);
    }
    @DeleteMapping("holiday/delete/holiday-plan/{id}")
    public  ResponseEntity<Boolean> deleteHolidayPlan(@PathVariable("id") long id){
        boolean deleteHolidayPlan= holidayPlanService.deleteHolidayPlan(id);
       if(deleteHolidayPlan) return  new ResponseEntity<>(true,HttpStatus.OK);
       return  new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }

    @PatchMapping("holiday/update/holiday-plan/")
    public  ResponseEntity<Boolean>  updateHolidayPlan(@RequestParam long holidayPlanId,@RequestParam int level){
        boolean updatedHolidayPlan= holidayPlanService.updateHolidayPlan( holidayPlanId,level);
        if(updatedHolidayPlan) return  new ResponseEntity<>(true,HttpStatus.OK);
        return  new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
}
