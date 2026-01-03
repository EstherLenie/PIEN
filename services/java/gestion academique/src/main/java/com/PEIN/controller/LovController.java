package com.PEIN.controller;

import com.PEIN.projection.LovProjection;
import com.PEIN.service.LovProjectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lov")
@RequiredArgsConstructor
public class LovController {

    private final LovProjectionService lovService;

    @GetMapping("/programmes")
    public List<LovProjection> programmes() {
        return lovService.getProgrammeLov();
    }

    @GetMapping("/echelons/{programmeId}")
    public List<LovProjection> echelons(@PathVariable Long programmeId) {
        return lovService.getEchelonLov(programmeId);
    }

    @GetMapping("/matieres")
    public List<LovProjection> matieres() {
        return lovService.getMatiereLov();
    }
    @GetMapping("/enseignants/matiere/{matiereId}")
    public List<LovProjection> enseignantsByMatiere(@PathVariable Long matiereId) {
        return lovService.getEnseignantsLovByMatiere(matiereId);
    }
    @GetMapping("/matiere/enseignants/{enseignantId}")
    public List<LovProjection> matiereByenseignants(@PathVariable Long enseignantId){
        return lovService.getMatiereLovByEnseignants(enseignantId);
    }
}

