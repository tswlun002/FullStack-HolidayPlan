package com.tour.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.util.Date;


public record EditUserNoneSecurityData(

    @Size(min = 2, max = 50, message = "Firstname must contain 3 to 50 characters.")
    String firstname,
    @Size(min = 2, max = 50, message = "Lastname must contain 3 to 50 characters.")
    String lastname,
    @Past(message = "Date of birth cannot be future date")
    @JsonFormat(pattern = "yy-mm-dd") Date age,
    @Email(message = "username must in email format. example:tswlun@gmail.com")
    String currentUsername
 ){

}


