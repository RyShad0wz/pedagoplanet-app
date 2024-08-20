package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Course;
import com.cda.pedagoplanet.entity.Material;
import com.cda.pedagoplanet.entity.Submission;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.entity.dto.CourseDTO;
import com.cda.pedagoplanet.entity.dto.MaterialDTO;
import com.cda.pedagoplanet.entity.dto.StudentGradeDTO;
import com.cda.pedagoplanet.entity.dto.UserDTO;
import com.cda.pedagoplanet.exception.ResourceNotFoundException;
import com.cda.pedagoplanet.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ReflectionUtils;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    SubmissionRepository submissionRepository;

    @Autowired
    private UserService userService;

    public Course updateCourse(Long courseId, CourseDTO courseDTO) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setCourseName(courseDTO.getCourseName());
        course.setDescription(courseDTO.getDescription());
        return courseRepository.save(course);
    }

    public Course partialUpdateCourse(Long courseId, Map<String, Object> updates) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        updates.forEach((key, value) -> {
            Field field = ReflectionUtils.findField(Course.class, key);
            if (field != null) {
                field.setAccessible(true);
                ReflectionUtils.setField(field, course, value);
                System.out.println("Field " + key + " updated to " + value);
            } else {
                System.out.println("Field " + key + " not found on Course class");
            }
        });


        if (!updates.containsKey("courseName")) {
            course.setCourseName(course.getCourseName());
        }
        if (!updates.containsKey("description")) {
            course.setDescription(course.getDescription());
        }

        return courseRepository.save(course);
    }

    public List<CourseDTO> getCoursesByTeacherId(Long teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        return courses.stream().map(course -> {
            CourseDTO dto = new CourseDTO(course);
            if (course.getTeacher() != null) {
                dto.setTeacherName(course.getTeacher().getLastName());
                dto.setTeacherGenre(String.valueOf(course.getTeacher().getGenre()));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public CourseDTO getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        return new CourseDTO(course);
    }

    @Transactional
    public List<UserDTO> getParticipants(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        return course.getStudents().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream().map(CourseDTO::new).collect(Collectors.toList());
    }

    public void enrollInCourse(Long courseId, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        course.getStudents().add(user);
        courseRepository.save(course);
    }

    @Transactional
    public void enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        User student = userService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Eleve non trouvé"));

        if (course.getStudents().contains(student)) {
            throw new RuntimeException("L'élève est déjà inscrit à ce cours");
        }

        course.getStudents().add(student);
        courseRepository.save(course);
    }

    @Transactional
    public void unenrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Élève non trouvé"));

        if (!course.getStudents().contains(student)) {
            throw new RuntimeException("L'élève n'est pas inscrit à ce cours");
        }

        course.getStudents().remove(student);
        courseRepository.save(course);
    }


    public boolean isStudentEnrolled(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        return course.getStudents().stream().anyMatch(student -> student.getId().equals(studentId));
    }

    public List<MaterialDTO> getCourseMaterials(Long courseId) {
        List<Material> materials = materialRepository.findByCourseId(courseId);
        return materials.stream().map(MaterialDTO::new).collect(Collectors.toList());
    }

    public List<Long> getEnrolledCourseIds(Long studentId) {
        User student = new User(studentId);
        return courseRepository.findByStudentsContaining(student)
                .stream()
                .map(Course::getId)
                .collect(Collectors.toList());
    }

    public List<StudentGradeDTO> getStudentGrades(Long courseId) {
        List<Submission> submissions = submissionRepository.findByCourseId(courseId);
        List<StudentGradeDTO> studentGrades = new ArrayList<>();

        for (Submission submission : submissions) {
            StudentGradeDTO dto = new StudentGradeDTO();
            dto.setStudentId(submission.getStudent().getId());
            dto.setStudentName(submission.getStudent().getFirstName() + " " + submission.getStudent().getLastName());
            dto.setGrade(submission.getGrade());
            studentGrades.add(dto);
        }

        return studentGrades;
    }

    public List<CourseDTO> getAvailableCourses(Long userId) {
        List<Course> availableCourses = courseRepository.findCoursesNotEnrolledByUserId(userId);
        return availableCourses.stream().map(course -> {
            CourseDTO dto = new CourseDTO(course);
            if (course.getTeacher() != null) {
                dto.setTeacherName(course.getTeacher().getLastName());
                dto.setTeacherGenre(String.valueOf(course.getTeacher().getGenre()));
                dto.setTeacherId(course.getTeacher().getId());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public List<CourseDTO> getEnrolledCourses(Long userId) {
        List<Course> enrolledCourses = courseRepository.findCoursesEnrolledByUserId(userId);
        return enrolledCourses.stream().map(course -> {
            CourseDTO dto = new CourseDTO(course);
            if (course.getTeacher() != null) {
                dto.setTeacherName(course.getTeacher().getLastName());
                dto.setTeacherGenre(String.valueOf(course.getTeacher().getGenre()));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public double calculateCourseAverage(Long courseId) {
        List<Submission> submissions = submissionRepository.findByAssignmentCourseId(courseId);
        if (submissions.isEmpty()) {
            return 0.0;
        }
        double total = 0.0;
        int count = 0;
        for (Submission submission : submissions) {
            if (submission.getGrade() != null) {
                total += submission.getGrade();
                count++;
            }
        }
        return count == 0 ? 0.0 : total / count;
    }

    public String getConferenceUrl(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return course.getConferenceUrl();
    }

    public void updateConferenceUrl(Long courseId, String conferenceUrl) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setConferenceUrl(conferenceUrl);
        courseRepository.save(course);
    }

}



