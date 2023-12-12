package com.tour.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.dto.AddressDTO;
import com.tour.dto.AppDTO;
import com.tour.exception.CatchException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.Address;
import com.tour.model.App;
import com.tour.model.Contact;
import com.tour.model.SocialNetwork;
import com.tour.repository.AppRepository;
import com.tour.repository.SocialNetworkRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppService implements IApp {
    private final AppRepository repository;
    private final Environment environment;
    private final SocialNetworkRepository socialNetworkRepository;

    /**
     * Save LT Holiday-Plan
     * @throws  NullException is the given LT Holiday-Plan  is null
     * @throws  RuntimeException if the LT Holiday-Plan already exist
     */
    @PostConstruct
    protected void save(){
        if(repository.count()!=0) return;
        App holidayPlan = getLtHolidayPlan();
        try {
                holidayPlan= repository.save(holidayPlan);

        }catch (Exception e){
            CatchException.catchException(e);
        }
        saveSocials(holidayPlan);

    }

    private  void saveSocials(App app){
        try {
            String socials = environment.getProperty("app.socials");
            if(!(socials==null || socials.trim().length()<=1)){
                var socialsNetworks=getSocials(app,socials);
                if(!socialsNetworks.isEmpty())socialNetworkRepository.saveAll(socialsNetworks);
            }

        }catch (Exception  e){
            CatchException.catchException(e);
        }
    }

    private Set<SocialNetwork> getSocials(App app, String socials){
        return  Arrays.stream(socials.split(",")).map(social->{
            var details = social.split(":");
            if(details.length<2) throw  new RuntimeException("Invalid SocialNetWork");
            return SocialNetwork.builder().app(app).name(details[0]).username(details[1]).build();
        }).collect(Collectors.toSet());
    }
    private Address getAddress(String address){
        if(address==null || address.trim().length()<=1)throw  new NullException("Invalid  address");
        if(address.split(",").length<5)throw new NullException("Invalid  address details, all field are required");
        AddressDTO addressDTO = null;
        try{
            addressDTO= new ObjectMapper().readValue(address,AddressDTO.class);
        }catch (Exception e){
            CatchException.catchException(e);
        }
        if(addressDTO==null) throw new NullException("Invalid  address details");
        return Address.builder().number(addressDTO.number()).streetName(addressDTO.streetName()).suburbs(addressDTO.suburbs())
                .city(addressDTO.city()).postalCode(addressDTO.postalCode()).country(addressDTO.country()).build();
    }
    private App getLtHolidayPlan() {
        String app = environment.getProperty("app.details");
        if(app==null || app.trim().length()<=1)throw  new NullException("Invalid  LT Holiday-Plan");
        if(app.split(",").length<5)throw new RuntimeException("Invalid  LT Holiday-Plan details, all field are required");
        String address = environment.getProperty("app.address");

        AppDTO ltDTO = null;
        try{
            app =app.replace("\n", "");
            ltDTO= new ObjectMapper().readValue(app, AppDTO.class);
        }catch (Exception e){
            CatchException.catchException(e);
        }
        if(ltDTO==null) throw new NullException("Invalid LT Holiday-Plan details");
        var logoDetails  = ltDTO.logo().split(",");
        if(logoDetails.length<2)throw  new RuntimeException("Invalid logo bit64 string image");
        var logo = getLogo(logoDetails[1]);

        return  App.builder().name(ltDTO.name()).logoExtension(logoDetails[0]).logo(logo).about(ltDTO.about()).
        contact(Contact.builder().email(ltDTO.email()).phone(ltDTO.phone()).build()).address(getAddress(address)).build();

    }
    private byte[] getLogo(String bit64){
        var acceptedFormat = List.of('i','/');
        if(! acceptedFormat.contains(bit64.charAt(0))) throw  new RuntimeException("Allowed logo format: png, jpg and jpeg");
        byte [] logo =null;
        try{
            logo=Base64.getMimeDecoder().decode(bit64);
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return logo;
    }
    /**
     * Find  LT Holiday-Plan by name
     * @param name of the LT Holiday-Plan to find
     * @return LT Holiday-Plan if exits
     * @throws  NotFoundException if no LT Holiday-Plan  is found
     */
    @Override
    public Optional<App> findByName(String name){
        var ltHoliday = repository.findByName(name);
        if(ltHoliday.isEmpty()) throw  new NotFoundException("LT Holiday-Plan not found");
        return ltHoliday;
    }
    @Override
    public  Set<SocialNetwork> getSocial(String name){
        return  socialNetworkRepository.findSocial(name);
    }
}
