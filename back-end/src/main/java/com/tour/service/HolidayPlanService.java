package com.tour.service;

import com.tour.dto.HolidayPlaDTO;
import com.tour.exception.CatchException;
import com.tour.model.HolidayLocationImages;
import com.tour.model.HolidayPlan;
import com.tour.model.User;
import com.tour.repository.HolidayImagesRepository;
import com.tour.repository.HolidayPlanRepository;
import jakarta.servlet.http.Part;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
@AllArgsConstructor
@Service
public class HolidayPlanService  implements  OnHolidayPlan{
    private final OnUser onUser;
    private final HolidayPlanRepository holidayPlanRepository;
    private final HolidayImagesRepository imagesRepository;

    @Override
    public boolean saveHolidayPlan(HolidayPlaDTO dto, List<Part> images) {

        var user  = onUser.getLoginedUser();
       var holidayPlan = HolidayPlan.builder().event(dto.event()).description(dto.description())
                .endDate(dto.endDate()).startDate(dto.startDate()).priorityLevel
                       (Integer.parseInt(dto.priorityLevel().trim())).city(dto.city())
                .location(dto.location()).user(user).build();
        if(holidayPlan==null) throw  new NullPointerException("Can not save null HolidayPlan");
        try {
               holidayPlan=holidayPlanRepository.save(holidayPlan);
        }
        catch (Exception e) {
              CatchException.catchException(e);
        }
        return saveImages(images,holidayPlan);
    }

    private  boolean saveImages(List<Part> images, HolidayPlan holidayPlan){
        var saved =false;
        try {
             for(var file:images){
                imagesRepository.save(
                        HolidayLocationImages.builder().image(file.getInputStream().readAllBytes()).holidayPlan(holidayPlan)
                                .name(file.getName()).imageType(file.getContentType()).build());
            }
            saved=true;
        } catch (IOException e) {
            CatchException.catchException(e);
        }
        return  saved;
    }

    public  Set<HolidayLocationImages> getHolidayPlanImages(long holidayId){
        return  imagesRepository.findByHolidayId(holidayId);
    }
    @Override
    public Set<HolidayPlan> getHolidayPlans() {
        return holidayPlanRepository.getHolidayPlan(onUser.getLoginedUser().getId());
    }

   @Override
   public  HolidayPlan getHolidayPlan(User user, long id){
        return  holidayPlanRepository.getHolidayPlan(user,id);
   }
    @Override
    public boolean deleteHolidayPlan(long holidayPlanId) {
        HolidayPlan holidayPlan =getHolidayPlan(onUser.getLoginedUser(),holidayPlanId);
        if(holidayPlan==null)throw  new NullPointerException("Can not delete null HolidayPlan");
        var deleted =false;
        try {

            if( deleteImage(holidayPlanId)) {
                holidayPlanRepository.delete(holidayPlan);
                deleted=true;
            }

        }catch (Exception e){
             CatchException.catchException(e);
        }
         return deleted;
    }
  @Override
  public boolean deleteAllHolidayPlan(User user) {
         if(user ==null) throw  new NullPointerException("Can not delete HolidayPlan of null User");
         AtomicBoolean deleted = new AtomicBoolean(false);
         try {
             var holidays  = getHolidayPlans(user.getId());
             System.out.println(holidays.size());
             holidays.forEach(holidayPlan -> {

                    if(deleteImage(holidayPlan.getId())) {
                        holidayPlanRepository.delete(holidayPlan);
                        deleted.set(true);
                    }
                    else throw  new RuntimeException("Failed to deleted all images");
             });

         }catch (Exception e){
            CatchException.catchException(e);

         }
         return deleted.get();
    }

    private Set<HolidayPlan> getHolidayPlans(Long id) {
       return holidayPlanRepository.getHolidayPlan(id);
    }

    /**
     * Delete the holidayPlan images using holidayPlan id
     * @param holidayPlanId is long type id of the HolidayPlan
     * @Return true if all images are deleted of the holiday
     * @Return  false if failed to  delete all images
     */
    private boolean deleteImage(long holidayPlanId){
        var deleted =false;
        try{
             var deletedRow =imagesRepository.deleteImageForHolidayPlan(holidayPlanId);
            deleted  = deletedRow>0 && deletedRow<=4;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return  deleted;
    }

    @Override
    public boolean updateHolidayPlan(long holidayPlaId,int level) {
        HolidayPlan holidayPlan = getHolidayPlan(onUser.getLoginedUser(),holidayPlaId);
        if(holidayPlan==null) throw new NullPointerException("Can not update null HolidayPlan");
        var updated=false;
        try{
            holidayPlan.setPriorityLevel(level);
            holidayPlanRepository.save(holidayPlan);
            updated=true;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return updated;
    }


}
