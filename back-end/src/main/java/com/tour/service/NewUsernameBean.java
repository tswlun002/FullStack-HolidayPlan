package com.tour.service;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Objects;

@Component
@Setter
@Getter
public class NewUsernameBean implements Serializable {
    private @Email String username;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NewUsernameBean that)) return false;
        return Objects.equals(username, that.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }

    @Override
    public String toString() {
        return "NewUsernameBean{" +
                "username='" + username + '\'' +
                '}';
    }
}
