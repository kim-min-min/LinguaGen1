package com.linguagen.backend.service;

import com.linguagen.backend.entity.DailyWord;
import com.linguagen.backend.repository.DailyWordRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DailyWordService {

    private final DailyWordRepository repository;

    public DailyWordService(DailyWordRepository repository) {
        this.repository = repository;
    }

    public List<DailyWord> getAllWords() {
        return repository.findAll();
    }
}
