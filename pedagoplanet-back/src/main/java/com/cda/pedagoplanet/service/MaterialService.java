package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Course;
import com.cda.pedagoplanet.entity.Material;
import com.cda.pedagoplanet.entity.dto.MaterialDTO;
import com.cda.pedagoplanet.repository.CourseRepository;
import com.cda.pedagoplanet.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    CourseRepository courseRepository;

    public MaterialDTO saveMaterial(MaterialDTO materialDTO) {
        Material material = new Material();
        material.setName(materialDTO.getName());
        material.setUrl(materialDTO.getUrl());
        Course course = courseRepository.findById(materialDTO.getCourseId()).orElseThrow(() -> new RuntimeException("Course not found"));
        material.setCourse(course);
        Material savedMaterial = materialRepository.save(material);
        return new MaterialDTO(savedMaterial);
    }

    public List<MaterialDTO> getMaterialsByCourseId(Long courseId) {
        List<Material> materials = materialRepository.findByCourseId(courseId);
        return materials.stream().map(MaterialDTO::new).collect(Collectors.toList());
    }

    public void deleteMaterial(Long materialId) {
        materialRepository.deleteById(materialId);
    }

    public MaterialDTO updateMaterial(Long materialId, MaterialDTO materialDTO) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        material.setName(materialDTO.getName());
        materialRepository.save(material);
        return convertToDto(material);
    }

    public MaterialDTO convertToDto(Material material) {
        return new MaterialDTO(material);
    }
}
