package com.linguagen.backend.config;

import com.linguagen.backend.entity.User;
import com.linguagen.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SystemUserInitializer implements CommandLineRunner {
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (!userRepository.existsById("system")) {
            User systemUser = new User();
            systemUser.setId("admin");
            // 필요한 다른 필드 설정
            userRepository.save(systemUser);
        }
    }
}