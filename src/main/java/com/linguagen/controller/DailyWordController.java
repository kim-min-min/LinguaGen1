package com.linguagen.controller;

import com.linguagen.entity.DailyWord;
import com.linguagen.service.DailyWordService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173" , allowCredentials = "true")
@RestController
@RequestMapping("/api/words")
public class DailyWordController {

    private final DailyWordService wordService;

    public DailyWordController(DailyWordService wordService) {
        this.wordService = wordService;
    }

    @GetMapping
    public List<DailyWord> getWords() {
        return wordService.getAllWords();
    }
}
