package com.hoaxify.ws.service.implementation;

import com.hoaxify.ws.dto.hoax.HoaxSubmitVMDto;
import com.hoaxify.ws.model.FileAttachment;
import com.hoaxify.ws.model.Hoax;
import com.hoaxify.ws.model.User;
import com.hoaxify.ws.repository.FileAttachmentRepository;
import com.hoaxify.ws.repository.HoaxRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class HoaxServiceImpl {
    HoaxRepository hoaxRepository;

    FileAttachmentRepository fileAttachmentRepository;

    FileServiceImpl fileService;

    UserServiceImpl userService;

    public HoaxServiceImpl(HoaxRepository hoaxRepository, FileAttachmentRepository fileAttachmentRepository, FileServiceImpl fileService, UserServiceImpl userService) {
        this.hoaxRepository = hoaxRepository;
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.fileService = fileService;
        this.userService = userService;
    }


    public void save(HoaxSubmitVMDto hoaxSubmitVMDto, User user) {
        Hoax hoax = new Hoax();
        hoax.setContent(hoaxSubmitVMDto.getContent());
        hoax.setTimestamp(new Date());
        hoax.setUser(user);

        this.hoaxRepository.save(hoax);
        log.info("Saving hoax: {}", hoax.toString());

        Optional<FileAttachment> optionalFileAttachment = fileAttachmentRepository.findById(hoaxSubmitVMDto.getAttachmentId());
        if (optionalFileAttachment.isPresent()) {
            FileAttachment fileAttachment = optionalFileAttachment.get();
            fileAttachment.setHoax(hoax);
            fileAttachmentRepository.save(fileAttachment);
        }
    }


    public Page<Hoax> getAllHoaxes(Pageable page) {
        return this.hoaxRepository.findAll(page);
    }

    public Page<Hoax> getHoaxesByUsername(String username, Pageable page) {
        User inDB = userService.getByUsername(username);
        return this.hoaxRepository.findByUser(inDB, page);
    }

    public Page<Hoax> getOldHoaxes(Long id, String username, Pageable page) {
        Specification<Hoax> specification = idLessThan(id);
        if (username != null) {
            User inDB = userService.getByUsername(username);
            specification = specification.and(userIs(inDB));
        }
        return hoaxRepository.findAll(specification, page);
    }


    public Long getNewHoaxesCount(Long id, String username) {
        Specification<Hoax> specification = idGreaterThan(id);
        if (username != null) {
            User inDB = userService.getByUsername(username);
            specification = specification.and(userIs(inDB));
        }
        return hoaxRepository.count(specification);
    }


    public List<Hoax> getNewHoaxes(Long id, String username, Sort sort) {
        Specification<Hoax> specification = idGreaterThan(id);
        if (username != null) {
            User inDB = userService.getByUsername(username);
            specification = specification.and(userIs(inDB));
        }
        return hoaxRepository.findAll(specification, sort);
    }


    public void delete(Long id) {
        Hoax inDB = hoaxRepository.getOne(id);
        if (inDB.getFileAttachment() != null) {
            String fileName = inDB.getFileAttachment().getName();
            fileService.deleteAttachmentFile(fileName);
        }
        hoaxRepository.deleteById(id);
    }

    Specification<Hoax> idLessThan(Long id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("id"), id);
    }

    Specification<Hoax> userIs(User user) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user"), user);
    }

    Specification<Hoax> idGreaterThan(Long id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("id"), id);
    }
}
