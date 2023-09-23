package com.hoaxify.ws;

import com.hoaxify.ws.dto.hoax.HoaxSubmitVMDto;
import com.hoaxify.ws.model.User;
import com.hoaxify.ws.service.implementation.HoaxServiceImpl;
import com.hoaxify.ws.service.implementation.UserServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
public class WsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WsApplication.class, args);
    }

    @Bean
    @Profile("dev")
    CommandLineRunner createInitialUsers(UserServiceImpl userService, HoaxServiceImpl hoaxService) {
        return (args) -> {
            try {
                userService.getByUsername("user1");
            } catch (Exception e) {
                for (int i = 1; i <= 15; i++) {
                    User user = new User();

                    user.setUsername("user" + i);
                    user.setDisplayName("display" + i);
                    user.setPassword("P4ssword");

                    userService.save(user);

                    for (int j = 1; j <= 12; j++) {
                        HoaxSubmitVMDto hoax = new HoaxSubmitVMDto();

                        hoax.setContent("Hoax - " + j + " from user" + i);
                        hoaxService.save(hoax, user);
                    }
                }
            }
        };
    }
}
