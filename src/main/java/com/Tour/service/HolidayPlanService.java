package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.model.HolidayLocationImages;
import com.Tour.model.HolidayPlan;
import com.Tour.model.User;
import com.Tour.repository.HolidayImagesRepository;
import com.Tour.repository.HolidayPlanRepository;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.IntStream;

@Service
public class HolidayPlanService  implements  OnHolidayPlan{
     @Autowired
     private OnUser onUser;
    @Autowired
    private HolidayPlanRepository holidayPlanRepository;
    @Autowired
    private HolidayImagesRepository imagesRepository;


    @Override
    public boolean saveHolidayPlan(HolidayPlaDTO dto, MultipartFile [] images) {
        var saved =false;
        var user  = onUser.getLoginedUser();
       var holidayPlan = HolidayPlan.builder().event(dto.event()).description(dto.description())
                .endDate(dto.endDate()).startDate(dto.startDate()).priorityLevel(Integer.parseInt(dto.priorityLevel().trim())).city(dto.city())
                .location(dto.location()).user(user).build();
        System.out.println(holidayPlan);
        System.out.println(holidayPlan);
        if(holidayPlan==null) throw  new NullPointerException("Can not save null HolidayPlan");
      try {

           holidayPlan=holidayPlanRepository.save(holidayPlan);

      }

      catch (Exception e) {
          CatchException.catchException(e);
      }


        return saveImages(images,holidayPlan);
    }

    private  boolean saveImages(MultipartFile[] images, HolidayPlan holidayPlan){
        var saved =false;
        try {
             for(var file:images){


                imagesRepository.save(
                        HolidayLocationImages.builder().image(file.getBytes()).holidayPlan(holidayPlan)
                                .name(file.getOriginalFilename()).imageType(file.getContentType()).build());

                saved=true;
            }
        } catch (IOException e) {
            System.out.println(e.getMessage());
            CatchException.catchException(e);
        }
        return  saved;
    }

    public  Set<HolidayLocationImages>  holidayLocationImages(long holidayId){
        return  imagesRepository.findByHolidayId(holidayId);
    }
    @Override
    public Set<HolidayPlan> getHolidayPlans() {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser());
    }

    @Override
    public Set<HolidayPlan> getHolidayPlan(String location, String city) {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser(),location,city);
    }

    @Override
    public Set<HolidayPlan> getHolidayPlan(String location, String city, Date start_date) {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser(),location,city,start_date);
    }

    @Override
    public Set<HolidayPlan> getHolidayPlan(String location, String city, Date start_date, Date end_date) {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser(),location,city,start_date,end_date);

    }
   @Override
   public  HolidayPlan getHolidayPlan(User user, long id){
        return  holidayPlanRepository.getHolidayPlan(user,id);
   }
    @Override
    public boolean deleteHolidayPlan(long holidayPlanId) {
        HolidayPlan holidayPlan =getHolidayPlan(onUser.getLoginedUser(),holidayPlanId);
        if(holidayPlan==null)throw  new NullPointerException("Can not delete null HolidayPlan");
        try {
            var deletedRows = imagesRepository.deleteImageForHolidayPlan(holidayPlanId);
            if(deletedRows>0 && deletedRows<=4) {
                holidayPlanRepository.delete(holidayPlan);
            }
            else{
                return false;
            }
        }catch (Exception e){
             CatchException.catchException(e);
        }
         return true;
    }
  @Override
  public boolean deleteAllHolidayPlan(User user) {
         if(user ==null) throw  new NullPointerException("Can not delete HolidayPlan of null User");
         try {
             holidayPlanRepository.deleteAll(getHolidayPlans());
         }catch (Exception e){
            CatchException.catchException(e);
             return false;
         }
         return true;
    }

    @Override
    public boolean updateHolidayPlan(long holidayPlaId,int level) {
        HolidayPlan holidayPlan = getHolidayPlan(onUser.getLoginedUser(),holidayPlaId);
        if(holidayPlan==null) throw new NullPointerException("Can not update null HolidayPlan");
        try{
            holidayPlan.setPriorityLevel(level);
            holidayPlanRepository.save(holidayPlan);
        }catch (Exception e){CatchException.catchException(e);return false;}
        return true;
    }


}
