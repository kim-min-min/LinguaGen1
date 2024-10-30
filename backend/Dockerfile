# OpenJDK 이미지 사용
FROM openjdk:17-jdk-alpine

# JAR 파일 복사
COPY build/libs/*.jar app.jar


# 포트 8085 노출
EXPOSE 8085

# Spring Boot 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]
