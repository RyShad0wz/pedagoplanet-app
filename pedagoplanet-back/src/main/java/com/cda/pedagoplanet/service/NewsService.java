package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Course;
import com.cda.pedagoplanet.entity.News;
import com.cda.pedagoplanet.entity.Notification;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.entity.dto.NewsDTO;
import com.cda.pedagoplanet.repository.CourseRepository;
import com.cda.pedagoplanet.repository.NewsRepository;
import com.cda.pedagoplanet.repository.NotificationRepository;
import com.cda.pedagoplanet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<NewsDTO> getNewsByTeacherId(Long teacherId) {
        List<News> news = newsRepository.findAllByTeacherId(teacherId);
        return news.stream().map(NewsDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NewsDTO> getNewsForStudent(Long studentId) {
        User student = userRepository.findWithCoursesById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return student.getCourses().stream()
                .flatMap(course -> {
                    List<News> newsList = newsRepository.findAllByCourse_Id(course.getId());
                    return newsList.stream();
                })
                .map(NewsDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public NewsDTO createNews(NewsDTO newsDTO, Long teacherId) {
        User teacher = userRepository.findById(teacherId).orElseThrow(() -> new RuntimeException("Teacher not found"));
        Course course = courseRepository.findById(newsDTO.getCourseId()).orElseThrow(() -> new RuntimeException("Course not found"));

        News news = new News();
        news.setTitle(newsDTO.getTitle());
        news.setContent(newsDTO.getContent());
        news.setTeacher(teacher);
        news.setCourse(course);
        news = newsRepository.save(news);

        List<User> students = userRepository.findByCourses_Id(newsDTO.getCourseId());
        for (User student : students) {
            Notification notification = new Notification(student, "Nouvelle actualité: " + newsDTO.getTitle(), teacher.getId(), "NEWS");
            notificationRepository.save(notification);
        }

        return new NewsDTO(news);
    }
}
