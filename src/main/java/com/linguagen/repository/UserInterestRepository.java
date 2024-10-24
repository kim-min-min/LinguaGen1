package com.linguagen.repository;

import com.linguagen.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInterestRepository extends JpaRepository<UserInterest, Long> {
}
