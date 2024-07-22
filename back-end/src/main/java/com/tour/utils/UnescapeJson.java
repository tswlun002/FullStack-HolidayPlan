package com.tour.utils;

import org.apache.commons.lang3.StringEscapeUtils;

public class UnescapeJson {

    public  static String unescapeJson(String input){
       return StringEscapeUtils.unescapeJson(input);
    }
}
