package com.tour.service;

import com.tour.model.App;
import com.tour.model.SocialNetwork;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public interface IApp {
    Optional<App> findByName(String name);
     Set<SocialNetwork> getSocial(String name);
}
