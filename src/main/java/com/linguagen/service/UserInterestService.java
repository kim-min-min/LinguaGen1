package com.linguagen.service;

import com.linguagen.entity.UserInterest;
import com.linguagen.repository.UserInterestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserInterestService {

    private final UserInterestRepository userInterestRepository;

    // Repository를 생성자 주입 방식으로 주입합니다.
    public UserInterestService(UserInterestRepository userInterestRepository) {
        this.userInterestRepository = userInterestRepository;
    }

    @Transactional
    public void saveUserInterests(String userId, List<String> interests) {
        for (String interestIdx : interests) {
            UserInterest userInterest = new UserInterest();
            userInterest.setUserId(userId);
            userInterest.setInterestIdx(interestIdx);
            userInterestRepository.save(userInterest);
        }
    }
}
