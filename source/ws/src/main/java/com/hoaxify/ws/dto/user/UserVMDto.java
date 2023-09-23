package com.hoaxify.ws.dto.user;

import com.hoaxify.ws.model.User;
import lombok.Data;

@Data
public class UserVMDto {

    private String username;
    private String displayName;
    private String image;

    public UserVMDto(User user) {
        this.setUsername(user.getUsername());
        this.setDisplayName(user.getDisplayName());
        this.setImage(user.getImage());
    }
}
