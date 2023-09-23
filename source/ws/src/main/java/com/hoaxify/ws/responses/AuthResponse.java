package com.hoaxify.ws.responses;

import com.hoaxify.ws.dto.user.UserVMDto;
import lombok.Data;

@Data
public class AuthResponse {

    private String token;

    private UserVMDto user;
}
