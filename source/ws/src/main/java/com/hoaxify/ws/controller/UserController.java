package com.hoaxify.ws.controller;

import com.hoaxify.ws.dto.user.UserUpdateVMDto;
import com.hoaxify.ws.dto.user.UserVMDto;
import com.hoaxify.ws.model.User;
import com.hoaxify.ws.responses.CurrentUser;
import com.hoaxify.ws.responses.GenericResponse;
import com.hoaxify.ws.service.implementation.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping(value = "/api/1.0")
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/users")
    public GenericResponse createUser(@Valid @RequestBody User user) {
        log.info(user.toString());
        userService.save(user);
        return new GenericResponse("User created");
    }

    @GetMapping("/users")
    public Page<UserVMDto> getAllUsers(Pageable page, @CurrentUser User user) {
        return userService.getAllUsers(page, user).map(UserVMDto::new);
    }

    @GetMapping("/users/{username}")
    public UserVMDto getUser(@PathVariable String username) {
        User user = userService.getByUsername(username);
        return new UserVMDto(user);
    }

    @PutMapping("/users/{username}")
    @PreAuthorize("#username == principal.username")
    public UserVMDto updateUser(@Valid @RequestBody UserUpdateVMDto updatedUser, @PathVariable String username) {
        User user = userService.updateUser(username, updatedUser);
        return new UserVMDto(user);
    }

    @DeleteMapping("/users/{username}")
    @PreAuthorize("#username == principal.username")
    public GenericResponse deleteUser (@PathVariable String username) {
        userService.deleteUser(username);
        return new GenericResponse("User Removed");
    }
}
