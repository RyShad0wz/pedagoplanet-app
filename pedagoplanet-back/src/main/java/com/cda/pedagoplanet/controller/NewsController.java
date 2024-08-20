package com.cda.pedagoplanet.controller;

import com.cda.pedagoplanet.entity.News;
import com.cda.pedagoplanet.entity.dto.NewsDTO;
import com.cda.pedagoplanet.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<NewsDTO>> getNewsByTeacher(@PathVariable Long teacherId) {
        List<NewsDTO> news = newsService.getNewsByTeacherId(teacherId);
        return ResponseEntity.ok(news);
    }


    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<NewsDTO>> getNewsForStudent(@PathVariable Long studentId) {
        List<NewsDTO> newsList = newsService.getNewsForStudent(studentId);
        return ResponseEntity.ok(newsList);
    }

    @PostMapping("/{teacherId}")
    public ResponseEntity<NewsDTO> createNews(@RequestBody NewsDTO newsDTO, @PathVariable Long teacherId) {
        try {
            NewsDTO createdNews = newsService.createNews(newsDTO, teacherId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNews);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
