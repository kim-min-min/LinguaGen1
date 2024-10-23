package com.linguagen.service;

import com.linguagen.entity.DailyWord;
import com.linguagen.repository.DailyWordRepository;
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
