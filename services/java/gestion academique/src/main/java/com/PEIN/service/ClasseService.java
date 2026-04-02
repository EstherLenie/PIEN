package com.PEIN.service;
import com.PEIN.DTO.ClassDetailsDTO;
import com.PEIN.DTO.ClassRequestDTO;
import com.PEIN.DTO.EtudiantDTO;
import com.PEIN.entity.*;
import com.PEIN.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClasseService {

    private final ClasseRepository classeRepository;
    private final EchelonRepository echelonRepository;
    private final MatiereRepository matiereRepository;
    private final ProgrammeRepository programmeRepository;
    private final ClasseElevesRepository classeElevesRepository;
    private final EtudiantRepository etudiantRepository;
    // Créer une classe
    public Classe createClasse(ClassRequestDTO request) {

        // Vérification que les FK existent
        Echelon echelon = echelonRepository.findById(request.getEchelonId())
                .orElseThrow(() -> new RuntimeException("Echelon introuvable"));

        Matiere matiere = matiereRepository.findById(request.getMatiereId())
                .orElseThrow(() -> new RuntimeException("Matiere introuvable"));



        Classe classe = new Classe();
        classe.setEchelon(echelon);
        classe.setMatiere(matiere);
        classe.setNom(request.getNom());
        classe.setEnseignant(request.getEnseignantId());
        classe.setCode(request.getCode());
        classe.setDescription(request.getDescription());
        classe.setAnneeAcademique(request.getAnneeAcademique());
        classe.setActif(true);
        classe.setCreeLe(LocalDateTime.now());

        return classeRepository.save(classe);
    }

    // Lister toutes les classes d’un enseignant
    public List<Classe> getClassesByTeacher(Long enseignantId) {
        return classeRepository.findByEnseignantAndSupprimeLeIsNull(enseignantId);
    }
    public List<ClassDetailsDTO> getAllClasses() {
        return classeRepository.findAllClasseCreated();
    }
    public Optional<Classe> getClasses(Long classeId) {
        return classeRepository.findById(classeId);
    }

    // Assigner un élève à une classe
    public ClasseEleves assignStudentToClasse(Long classeId, Long eleveId) {
        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe introuvable"));
        Etudiant etudiant= etudiantRepository.findById(eleveId).orElseThrow(()->new RuntimeException("Etudiant introuvable"));

        ClasseEleves ce = new ClasseEleves();
        ce.setClasse_id(classe);
        ce.setEleve_id(etudiant);
        ce.setCreeLe(LocalDateTime.now());
        ce.setModifieLe(LocalDateTime.now());

        return classeElevesRepository.save(ce);
    }
     //Trouver les eleves assigner a une classe
    public List<EtudiantDTO> findStudentOfAClasse( Long classeId ){
       List<EtudiantDTO>  etudiants = classeElevesRepository.findStudentOfAClasse(classeId);
       return etudiants;
    }

    public List<EtudiantDTO> findAllStudent( Long classeId ){
        List<EtudiantDTO>  etudiants = classeElevesRepository.findAllStudent( classeId);
        return etudiants;
    }
    @Transactional
    public void  deleteFromClasse(Long classeId, Long eleveId){
        ClasseEleves classeEleves=classeElevesRepository.findClasseElevesByClasseIdAndEleveId(classeId,eleveId)
                .orElseThrow(()->new RuntimeException("Donnees Introuvables"));
       classeElevesRepository.deleteClasseElevesByClasseIdAndEleveId(classeId,eleveId);

    }
    @Transactional
    public void deleteClass(Long id){
        Classe classe= classeRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Classe Introuvable"));
        classeRepository.deleteClasseById(id);
    }


}
