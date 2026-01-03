package com.PEIN.controller;

import com.PEIN.DTO.ClassDetailsDTO;
import com.PEIN.DTO.ClassRequestDTO;
import com.PEIN.DTO.EtudiantDTO;
import com.PEIN.entity.Classe;
import com.PEIN.entity.ClasseEleves;
import com.PEIN.service.ClasseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService classeService;

    // 1️⃣ Créer une classe
    @PostMapping("/create")
    public ResponseEntity<Classe> createClasse(@RequestBody ClassRequestDTO request) {
        Classe createdClasse = classeService.createClasse(request);
        return ResponseEntity.ok(createdClasse);
    }

    // 2️⃣ Assigner un étudiant à une classe
    @PostMapping("/assign-student")
    public ResponseEntity<ClasseEleves> assignStudent(
            @RequestParam Long classeId,
            @RequestParam Long eleveId) {
        ClasseEleves ce = classeService.assignStudentToClasse(classeId,eleveId);
        return ResponseEntity.ok(ce);
    }

    // 3️⃣ Lister toutes les classes d’un enseignant
    @GetMapping("/teacher/{enseignantId}")
    public List<Classe> getClassesByTeacher(@PathVariable Long enseignantId) {
        List<Classe> classes = classeService.getClassesByTeacher(enseignantId);
        return classes;
    }
    @GetMapping("/")
    public List<ClassDetailsDTO> getAllClasses() {
        List<ClassDetailsDTO> classes = classeService.getAllClasses();
        return classes;
    }
    @GetMapping("/assignable_student/{classeId}")
    public List<EtudiantDTO> getStudentThatCanBeAssigned(
            @PathVariable Long classeId
    ) {

        List<EtudiantDTO> etudiants = classeService.findAllStudent(classeId);
        return etudiants;
    }
    @GetMapping("/student/{classeId}")
    public List<EtudiantDTO> getStudentsofClasse(
            @PathVariable Long classeId ) {
        List<EtudiantDTO> etudiants = classeService.findStudentOfAClasse(classeId);
        return etudiants;
    }
    @DeleteMapping("/delete_student/{classeId}/{eleveId}")
    public void removeStudentFromClasse(
            @PathVariable Long classeId,
            @PathVariable Long eleveId
    ){
        classeService.deleteFromClasse(classeId,eleveId);
    }
    @DeleteMapping("/delete/{classeId}")
    public void deleteClasse
            (
            @PathVariable Long classeId)
    {
        classeService.deleteClass(classeId);
    }
}

