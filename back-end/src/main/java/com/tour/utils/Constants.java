package com.tour.utils;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.TimeZone;

public class Constants {
    public  static Instant getCurrentTime(){
        return Instant.from(Instant.now().atOffset(ZoneOffset.ofTotalSeconds(TimeZone.getDefault().getRawOffset()/1000)));
    }
}
