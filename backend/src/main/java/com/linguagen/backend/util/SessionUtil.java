package com.linguagen.backend.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.linguagen.backend.exception.UnauthorizedException;

@Slf4j
@Component
@RequiredArgsConstructor
public class SessionUtil {
    private final HttpSession session;

    public String getCurrentUserId() {
        String userId = (String) session.getAttribute("id");
        // 세션 디버깅을 위한 로그 추가
        log.debug("Current Session ID: {}", session.getId());
        log.debug("Session attributes: {}", session.getAttributeNames());
        log.debug("User ID from session: {}", userId);

        if (userId == null) {
            log.debug("No user ID found in session");
            throw new UnauthorizedException("로그인이 필요한 서비스입니다.");
        }
        return userId;
    }

    public boolean isLoggedIn() {
        String userId = (String) session.getAttribute("id");
        log.debug("Checking login status - User ID: {}", userId);
        return userId != null;
    }
}
