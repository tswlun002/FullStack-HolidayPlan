package com.tour.utils;

import java.util.HashMap;
import java.util.Map;

public record MapResponse(String key, String message) {

    public  Map<String, String>  response(){
        Map<String,String> response = new HashMap<>();
        response.put(key,message);
        return  response;
    }

}
