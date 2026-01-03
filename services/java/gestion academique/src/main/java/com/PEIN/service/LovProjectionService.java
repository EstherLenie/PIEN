package com.PEIN.service;

import com.PEIN.projection.LovProjection;
import com.PEIN.repository.EchelonRepository;
import com.PEIN.repository.MatiereRepository;
import com.PEIN.repository.ProgrammeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LovProjectionService {

    private final ProgrammeRepository programmeRepository;
    private final EchelonRepository echelonRepository;
    private final MatiereRepository matiereRepository;

    public List<LovProjection> getProgrammeLov() {
        return programmeRepository.findLov();
    }

    public List<LovProjection> getEchelonLov(Long programmeId) {
        return echelonRepository.findLovByProgramme(programmeId);
    }

    public List<LovProjection> getMatiereLov() {
        return matiereRepository.findLov();
    }

    public List<LovProjection> getEnseignantsLovByMatiere(Long matiereId) {
        return matiereRepository.findEnseignantsLovByMatiere(matiereId);
    }
    public List<LovProjection> getMatiereLovByEnseignants(Long enseignantId) {
        return matiereRepository.findMatiereLovByEnseignant(enseignantId);
    }

}
