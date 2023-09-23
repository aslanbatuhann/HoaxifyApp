package com.hoaxify.ws.repository;

import com.hoaxify.ws.model.Hoax;
import com.hoaxify.ws.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface HoaxRepository extends JpaRepository<Hoax, Long>, JpaSpecificationExecutor<Hoax> {
    Page<Hoax> findByUser(User user, Pageable page);

   // Page<Hoax> findByIdLessThan(Long id, Pageable page);

   // Page<Hoax> findByIdLessThanAndUser(Long id, User user, Pageable page);

   // Long countByIdGreaterThan(Long id);

    // Long countByIdGreaterThanAndUser(Long id, User user);

   // List<Hoax> findByIdGreaterThan(Long id, Sort sort);

   // List<Hoax> findByIdGreaterThanAndUser(Long id, User user, Sort sort);
}
