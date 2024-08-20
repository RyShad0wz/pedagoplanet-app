package com.cda.pedagoplanet.controller;

import com.cda.pedagoplanet.entity.Course;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.entity.dto.*;
import com.cda.pedagoplanet.exception.ResourceNotFoundException;
import com.cda.pedagoplanet.service.CourseService;
import com.cda.pedagoplanet.service.GradeService;
import com.cda.pedagoplanet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @Autowired
    private GradeService gradeService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getCourses(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            List<CourseDTO> courses = courseService.getCoursesByTeacherId(user.getId());
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long courseId) {
        try {
            CourseDTO course = courseService.getCourseById(courseId);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody CourseDTO courseDTO, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            Course course = new Course();
            course.setCourseName(courseDTO.getCourseName());
            course.setDescription(courseDTO.getDescription());
            course.setTeacher(user);
            Course savedCourse = courseService.saveCourse(course);
            return ResponseEntity.ok(new CourseDTO(savedCourse));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long courseId, @RequestBody CourseDTO courseDTO) {
        try {
            Course updatedCourse = courseService.updateCourse(courseId, courseDTO);
            return ResponseEntity.ok(new CourseDTO(updatedCourse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PatchMapping("/{courseId}")
    public ResponseEntity<CourseDTO> partialUpdateCourse(@PathVariable Long courseId, @RequestBody Map<String, Object> updates) {
        try {
            Course updatedCourse = courseService.partialUpdateCourse(courseId, updates);
            return ResponseEntity.ok(new CourseDTO(updatedCourse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{courseId}/participants")
    public ResponseEntity<List<UserDTO>> getParticipants(@PathVariable Long courseId) {
        try {
            List<UserDTO> participants = courseService.getParticipants(courseId);
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        try {
            List<CourseDTO> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<CourseDTO>> getAvailableCourses(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            List<CourseDTO> availableCourses = courseService.getAvailableCourses(user.getId());
            return ResponseEntity.ok(availableCourses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<String> enrollCourse(@PathVariable Long courseId, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            courseService.enrollStudent(courseId, user.getId());
            return ResponseEntity.ok("Enrolled successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to enroll in the course");
        }
    }

    @GetMapping("/enrolled")
    public ResponseEntity<List<CourseDTO>> getEnrolledCourses(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            List<CourseDTO> enrolledCourses = courseService.getEnrolledCourses(user.getId());
            return ResponseEntity.ok(enrolledCourses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{courseId}/grades")
    public ResponseEntity<List<StudentGradeDTO>> getStudentGrades(@PathVariable Long courseId) {
        try {
            List<StudentGradeDTO> studentGrades = courseService.getStudentGrades(courseId);
            return ResponseEntity.ok(studentGrades);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{courseId}/materials")
    public ResponseEntity<List<MaterialDTO>> getCourseMaterials(@PathVariable Long courseId, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            if (courseService.isStudentEnrolled(courseId, user.getId())) {
                List<MaterialDTO> materials = courseService.getCourseMaterials(courseId);
                return ResponseEntity.ok(materials);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{courseId}/average")
    public ResponseEntity<AverageDTO> getCourseAverage(@PathVariable Long courseId) {
        try {
            double average = gradeService.calculateAverageForCourse(courseId);
            return ResponseEntity.ok(new AverageDTO(average));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByTeacherId(@PathVariable Long teacherId) {
        try {
            List<CourseDTO> courses = courseService.getCoursesByTeacherId(teacherId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{courseId}/conference-url")
    public ResponseEntity<Map<String, String>> getConferenceUrl(@PathVariable Long courseId) {
        try {
            String conferenceUrl = courseService.getConferenceUrl(courseId);
            return ResponseEntity.ok(Collections.singletonMap("conferenceUrl", conferenceUrl));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{courseId}/conference-url")
    public ResponseEntity<Void> updateConferenceUrl(@PathVariable Long courseId, @RequestBody Map<String, String> payload) {
        try {
            courseService.updateConferenceUrl(courseId, payload.get("conferenceUrl"));
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{courseId}/unenroll")
    public ResponseEntity<String> unenrollCourse(@PathVariable Long courseId, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            courseService.unenrollStudent(courseId, user.getId());
            return ResponseEntity.ok("Désinscrit avec succès");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cours non trouvé");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Échec de la désinscription");
        }
    }


}
