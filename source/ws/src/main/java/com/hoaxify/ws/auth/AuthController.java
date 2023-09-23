package com.hoaxify.ws.auth;

import com.hoaxify.ws.request.Credentials;
import com.hoaxify.ws.responses.AuthResponse;
import com.hoaxify.ws.responses.GenericResponse;
import com.hoaxify.ws.service.implementation.AuthServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class AuthController {

    AuthServiceImpl authService;

    public AuthController(AuthServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping("/api/1.0/auth")
    AuthResponse handleAuthentication(@RequestBody Credentials credentials) {
        return authService.authenticate(credentials);
    }

    @PostMapping("/api/1.0/logout")
    GenericResponse handleLogout(@RequestHeader(name = "Authorization") String authorization) {
        String token = authorization.substring(7);

        authService.clearToken(token);
        return new GenericResponse("Logout success");
    }
}
