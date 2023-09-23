package com.hoaxify.ws.service.implementation;

import com.hoaxify.ws.dto.user.UserUpdateVMDto;
import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.model.User;
import com.hoaxify.ws.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
@Slf4j
public class UserServiceImpl {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    FileServiceImpl fileService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, FileServiceImpl fileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
    }

    public User save(User user) {
        log.info("Saving new user: {}", user.getUsername());

        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        return this.userRepository.save(user);
    }

    public User findByUsername(String username) {
        log.info("get user: {}", username);
        User inDB = this.userRepository.findByUsername(username);
        if (inDB == null) {
            return null;
        }
        return inDB;
    }

    public Page<User> getAllUsers(Pageable page, User user) {
        if (user != null) {
            return this.userRepository.findByUsernameNot(user.getUsername(), page);
        }
        return this.userRepository.findAll(page);
    }

    public User getByUsername(String username) {
        User inDB = userRepository.findByUsername(username);
        if (inDB == null) {
            throw new NotFoundException();
        }
        return inDB;
    }

    public User updateUser(String username, UserUpdateVMDto updatedUser) {
        User inDB = getByUsername(username);
        inDB.setDisplayName(updatedUser.getDisplayName());
        if (updatedUser.getImage() != null) {
            String oldImageName = inDB.getImage();
            try {
                String storedFileName = fileService.writeBase64EncodedStringToFile(updatedUser.getImage());
                inDB.setImage(storedFileName);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            fileService.deleteProfileImage(oldImageName);
        }
        return userRepository.save(inDB);
    }

    public void deleteUser(String username) {
        User inDB = userRepository.findByUsername(username);
        fileService.deleteAllStoredFilesForUser(inDB);
        userRepository.delete(inDB);
    }

}
