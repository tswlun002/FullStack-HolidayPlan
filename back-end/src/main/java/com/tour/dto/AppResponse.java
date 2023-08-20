package com.tour.dto;

import com.tour.model.Address;
import com.tour.model.SocialNetwork;

import java.util.Set;

public record AppResponse(
         Long id,
         String name,
         byte [] logo,
         String logoFormat,
         String about,
         String email,
         String phone,
         Address address ,
         Set<SocialNetwork> socials
){
}
