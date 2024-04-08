package com.tour.dto;

import com.tour.model.User;

public record SecurityChangeDataEvent(
        User user, String email, String titleChanged)
{

}


