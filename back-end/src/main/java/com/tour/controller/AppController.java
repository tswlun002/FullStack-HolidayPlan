package com.tour.controller;

import com.tour.dto.AppResponse;
import com.tour.model.SocialNetwork;
import com.tour.service.AppService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/holiday-plan/api/app-details")
public class AppController {
    private  final AppService service;
    @GetMapping(value = "/")
    public  ResponseEntity<?> get(@RequestParam String name){
        var appData  =service.findByName(name);
        Set<SocialNetwork> socials = appData.isPresent()?service.getSocial(name): Collections.emptySet();
        var data  = appData.orElseThrow();
        return new ResponseEntity<>(
                new AppResponse(
                        data.getId(), data.getName(),data.getLogo(), data.getLogoExtension(), data.getAbout(),
                        data.getContact().getEmail(), data.getContact().getPhone(), data.getAddress(),
                        socials
                ),
                HttpStatus.OK);
    }
}
