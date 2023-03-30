package com.Tour.controller;


import com.Tour.exception.NotFoundException;
import com.Tour.model.HolidayPlan;
import com.Tour.service.HolidayPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Date;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin( origins = "*",originPatterns = "http://localhost:3000/**")
@RequestMapping("/holiday-plan/api/")
public class HolidayPlanController {
    @Autowired
    HolidayPlanService holidayPlanService;
    @PostMapping(value = "holiday/save/", consumes = {"application/json"})
    public ResponseEntity<Boolean> saveHolidayPlan(@RequestBody HolidayPlan holidayPlan){
        boolean saved = holidayPlanService.saveHolidayPlan(holidayPlan);
        if(saved) return  new ResponseEntity<>(true,HttpStatus.OK);
        return  new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
    @GetMapping(value = "holiday/holidays/")
    public ResponseEntity<Set<HolidayPlan>> getHolidayPlans() throws NotFoundException {
        var holidayPlans=  holidayPlanService.getHolidayPlans();
        if(holidayPlans.size()==0) throw  new NotFoundException("No HolidayPlan found");
        HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("desc","HolidayPlans");

        return  new ResponseEntity<>(holidayPlans,headers,HttpStatus.OK);
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

    @PatchMapping("holiday/update/holiday-plan/{id}/{level}")
    public  ResponseEntity<Boolean>  updateHolidayPlan(@PathVariable("id") long id,@PathVariable("level") int level){
        boolean updatedHolidayPlan= holidayPlanService.updateHolidayPlan( id,level);
        if(updatedHolidayPlan) return  new ResponseEntity<>(true,HttpStatus.OK);
        return  new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);
    }
}
