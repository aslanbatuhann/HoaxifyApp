package com.hoaxify.ws.service.implementation;

import com.hoaxify.ws.model.Hoax;
import com.hoaxify.ws.model.User;
import com.hoaxify.ws.repository.HoaxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HoaxSecurityServiceImpl {
    @Autowired
    HoaxRepository hoaxRepository;

    public boolean isAllowedToDelete(Long id, User loggedInUser) {
        Optional<Hoax> optionalHoax = hoaxRepository.findById(id);
        if (!optionalHoax.isPresent()) {
            return false;
        }

        Hoax hoax = optionalHoax.get();
        if (hoax.getUser().getId() != loggedInUser.getId()) {
            return false;
        }
        return true;
    }
}
