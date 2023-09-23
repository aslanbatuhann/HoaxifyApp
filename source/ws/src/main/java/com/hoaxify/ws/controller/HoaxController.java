package com.hoaxify.ws.controller;

import com.hoaxify.ws.dto.hoax.HoaxSubmitVMDto;
import com.hoaxify.ws.dto.hoax.HoaxVMDto;
import com.hoaxify.ws.model.User;
import com.hoaxify.ws.responses.CurrentUser;
import com.hoaxify.ws.responses.GenericResponse;
import com.hoaxify.ws.service.implementation.HoaxServiceImpl;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping(value = "/api/1.0/")
public class HoaxController {
    @Autowired
    HoaxServiceImpl hoaxService;

    @PostMapping("hoaxes")
    GenericResponse saveHoax(@Valid @RequestBody HoaxSubmitVMDto hoax, @CurrentUser User user) {
        log.info(hoax.toString());
        hoaxService.save(hoax, user);
        return new GenericResponse("hoax is saved");
    }

    @GetMapping("hoaxes")
    public Page<HoaxVMDto> getHoaxes(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page) {
        return hoaxService.getAllHoaxes(page).map(HoaxVMDto::new);
    }

    @GetMapping({"hoaxes/{id:[0-9]+}", "users/{username}/hoaxes/{id:[0-9]+}"})
    public ResponseEntity<?> getHoaxesRelative(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page,
                                               @PathVariable Long id, @PathVariable(required = false) String username,
                                               @RequestParam(name = "count", required = false, defaultValue = "false") boolean count,
                                               @RequestParam(name = "direction", defaultValue = "before") String direction) {
        if (count) {
            long newHoaxCount = hoaxService.getNewHoaxesCount(id, username);
            Map<String, Long> response = new HashMap<>();
            response.put("count", newHoaxCount);
            return ResponseEntity.ok(response);
        }
        if (direction.equals("after")) {
            List<HoaxVMDto> newHoaxes = hoaxService.getNewHoaxes(id, username, page.getSort())
                    .stream().map(HoaxVMDto::new).toList();
            return ResponseEntity.ok(newHoaxes);
        }
        return ResponseEntity.ok(hoaxService.getOldHoaxes(id, username, page).map(HoaxVMDto::new));
    }

    @GetMapping("users/{username}/hoaxes")
    public Page<HoaxVMDto> getHoaxesByUsername(@PathVariable String username, @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page) {
        return hoaxService.getHoaxesByUsername(username, page).map(HoaxVMDto::new);
    }

    @DeleteMapping("hoaxes/{id:[0-9]+}")
    @PreAuthorize("@hoaxSecurityServiceImpl.isAllowedToDelete(#id, principal)")
    public GenericResponse deleteHoax(@PathVariable Long id) {
        hoaxService.delete(id);
        return new GenericResponse("Hoax removed");
    }

//    @GetMapping("users/{username}/hoaxes/{id:[0-9]+}")
//    public ResponseEntity<?> getUserHoaxesRelative(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page,
//                                                   @PathVariable String username, @RequestParam(name = "count", required = false, defaultValue = "false") boolean count,
//                                                   @PathVariable Long id, @RequestParam(name = "direction", defaultValue = "before") String direction) {
//        if (count) {
//            long newHoaxCount = hoaxService.getNewHoaxesCountOfUser(id, username);
//            Map<String, Long> response = new HashMap<>();
//            response.put("count", newHoaxCount);
//            return ResponseEntity.ok(response);
//        }
//        if (direction.equals("after")) {
//            List<HoaxVMDto> newHoaxes = hoaxService.getNewHoaxesOfUser(id, username, page.getSort())
//                    .stream().map(HoaxVMDto::new).toList();
//            return ResponseEntity.ok(newHoaxes);
//        }
//        return ResponseEntity.ok(hoaxService.getOldHoaxesOfUser(id, username, page).map(HoaxVMDto::new));
//    }
}
