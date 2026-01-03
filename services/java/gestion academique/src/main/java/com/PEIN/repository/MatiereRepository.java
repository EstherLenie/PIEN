package com.PEIN.repository;

import com.PEIN.entity.Matiere;
import com.PEIN.projection.LovProjection;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatiereRepository extends JpaRepository<Matiere,Long> {

    @Query("""
        SELECT m.code AS code, m.nom AS nom
        FROM Matiere m
        WHERE m.supprimeLe IS NULL
    """)
    List<LovProjection> findLov();

    @Query(value = """
        SELECT
            e.id as code,
            CONCAT(e.matricule,' - ',e.nom, ' ', e.prenom) AS nom
        FROM sga.matiere m
        JOIN UNNEST(m.enseignants) AS ens_id ON TRUE
        JOIN sga.enseignant e ON e.id = ens_id
        WHERE m.code = :matiereId
          AND m.supprime_le IS NULL
          AND e.supprime_le IS NULL;
        """, nativeQuery = true)
        List<LovProjection> findEnseignantsLovByMatiere(@Param("matiereId") Long matiereId);

@Query (value = """
    SELECT m.code as code ,m.nom as description
    FROM sga.matiere m, UNNEST(enseignants) AS id1
    WHERE id1 = :enseignantId
""", nativeQuery = true)
List<LovProjection> findMatiereLovByEnseignant(@Param("enseignantId") Long enseignantId);

}
