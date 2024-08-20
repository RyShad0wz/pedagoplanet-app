package com.cda.pedagoplanet.repository;

import com.cda.pedagoplanet.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findAllByTeacherId(Long teacherId);
    List<News> findAllByCourse_Id(Long courseId);
}
