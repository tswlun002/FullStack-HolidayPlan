package com.Tour;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



@SpringBootApplication
public class TourApplication {
	public static void main(String[] args) {
		SpringApplication.run(TourApplication.class, args);

		//System.out.println(new BCryptPasswordEncoder().encode("12345"));
	}

}
