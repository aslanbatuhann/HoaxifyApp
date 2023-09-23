package com.hoaxify.ws.repository;

import com.hoaxify.ws.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, String> {
}
