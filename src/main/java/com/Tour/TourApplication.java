package com.Tour;

import lombok.Getter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Scanner;
@Getter
@SpringBootApplication
public class TourApplication {
    private static  String userName;
	public static String getUserName() {
		return userName;
	}

	public static void main(String[] args) {
		SpringApplication.run(TourApplication.class, args);
		Scanner scanner  = new Scanner(System.in);
		System.out.print("Login username:");
		userName= scanner.nextLine();


	}

}
