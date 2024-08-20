package com.cda.pedagoplanet.controller;


import com.cda.pedagoplanet.entity.Material;
import com.cda.pedagoplanet.entity.dto.MaterialDTO;
import com.cda.pedagoplanet.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @PostMapping
    public ResponseEntity<MaterialDTO> addMaterial(@RequestBody MaterialDTO materialDTO) {
        MaterialDTO savedMaterial = materialService.saveMaterial(materialDTO);
        return ResponseEntity.ok(savedMaterial);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<MaterialDTO>> getMaterialsByCourse(@PathVariable Long courseId) {
        List<MaterialDTO> materials = materialService.getMaterialsByCourseId(courseId);
        return ResponseEntity.ok(materials);
    }

    @DeleteMapping("/{materialId}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long materialId) {
        materialService.deleteMaterial(materialId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{materialId}")
    public ResponseEntity<MaterialDTO> updateMaterial(@PathVariable Long materialId, @RequestBody MaterialDTO materialDTO) {
        MaterialDTO updatedMaterial = materialService.updateMaterial(materialId, materialDTO);
        return ResponseEntity.ok(updatedMaterial);
    }
}
