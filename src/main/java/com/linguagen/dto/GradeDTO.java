package com.linguagen.controller;

import com.linguagen.dto.GradeDTO;
import com.linguagen.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grade")
@CrossOrigin(origins = "http://localhost:5173" , allowCredentials = "true")
public class GradeController {

    private final GradeService gradeService;

    @Autowired
    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<GradeDTO> getGrade(@PathVariable String userId) {
        GradeDTO gradeDTO = gradeService.getGradeByUserId(userId);
        if (gradeDTO != null) {
            return ResponseEntity.ok(gradeDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<GradeDTO> updateGrade(@RequestBody GradeDTO gradeDTO) {
        GradeDTO updatedGrade = gradeService.updateGrade(gradeDTO);
        return ResponseEntity.ok(updatedGrade);
    }
}