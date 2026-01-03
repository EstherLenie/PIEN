INSERT INTO modules (
    id,
    titre,
    description,
    ordre,
    date_creation,
    date_mise_a_jour,
    classe_id,
    objectifs,
    prerequis,
    competences_ciblees
)
VALUES
(
    1,
    'Introduction au cours',
    'Présentation générale du cours et de son contenu',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    ARRAY['Comprendre les objectifs du cours', 'Identifier les attentes'],
    ARRAY['Aucun'],
    ARRAY['Compréhension globale', 'Orientation pédagogique']
),
(
    2,
    'Bases théoriques',
    'Fondements théoriques nécessaires pour la suite',
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    ARRAY['Maîtriser les concepts clés'],
    ARRAY['Introduction au cours'],
    ARRAY['Analyse', 'Raisonnement logique']
),
(
    3,
    'Exercices pratiques',
    'Applications pratiques des notions étudiées',
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    ARRAY['Appliquer la théorie', 'Résoudre des problèmes'],
    ARRAY['Bases théoriques'],
    ARRAY['Résolution de problèmes', 'Autonomie']
),
(
    4,
    'Évaluation finale',
    'Évaluation des connaissances acquises',
    4,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    ARRAY['Valider les acquis'],
    ARRAY['Tous les modules précédents'],
    ARRAY['Auto-évaluation', 'Synthèse']
);

INSERT INTO modules (
    id,
    titre,
    description,
    ordre,
    date_creation,
    date_mise_a_jour,
    classe_id,
    objectifs,
    prerequis,
    competences_ciblees
)
VALUES
(
    5,
    'Présentation du programme',
    'Vue d’ensemble du programme et des méthodes',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    2,
    ARRAY['Comprendre le programme', 'Connaître les règles'],
    ARRAY['Notions de base'],
    ARRAY['Organisation', 'Planification']
),
(
    6,
    'Concepts avancés',
    'Approfondissement des notions principales',
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    2,
    ARRAY['Approfondir les connaissances'],
    ARRAY['Présentation du programme'],
    ARRAY['Analyse avancée', 'Esprit critique']
),
(
    7,
    'Projet pratique',
    'Réalisation d’un projet concret',
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    2,
    ARRAY['Mettre en œuvre les concepts', 'Travailler en autonomie'],
    ARRAY['Concepts avancés'],
    ARRAY['Gestion de projet', 'Créativité']
);

INSERT INTO modules (
    id,
    titre,
    description,
    ordre,
    date_creation,
    date_mise_a_jour,
    classe_id,
    objectifs,
    prerequis,
    competences_ciblees
)
VALUES
(
    8,
    'Introduction au module',
    'Découverte des thèmes abordés',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    3,
    ARRAY['Découvrir le module'],
    ARRAY['Aucun'],
    ARRAY['Curiosité', 'Compréhension initiale']
),
(
    9,
    'Travaux dirigés',
    'Exercices encadrés et études de cas',
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    3,
    ARRAY['Mettre en pratique', 'Renforcer la compréhension'],
    ARRAY['Introduction au module'],
    ARRAY['Application pratique', 'Analyse de cas']
);

INSERT INTO lecons (
    module_id, titre, description, objectifs,
    competences_ciblees, prerequis, ordre,
    version_active_id, date_creation, date_mise_a_jour
)
VALUES
(1, 'Introduction au module', 'Présentation générale du module',
 'Comprendre le déroulement', 'Vision globale', 'Aucun', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(1, 'Objectifs pédagogiques', 'Objectifs à atteindre',
 'Identifier les compétences clés', 'Analyse des attentes', 'Introduction au module', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(1, 'Organisation du cours', 'Structure et planning',
 'Savoir s’organiser', 'Gestion du temps', 'Objectifs pédagogiques', 3, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO lecons VALUES
(DEFAULT, 2, 'Concepts fondamentaux', 'Bases théoriques',
 'Comprendre les concepts', 'Raisonnement logique', 'Module 1', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 2, 'Définitions clés', 'Vocabulaire essentiel',
 'Maîtriser les termes', 'Compréhension conceptuelle', 'Concepts fondamentaux', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 2, 'Exemples illustrés', 'Illustration des concepts',
 'Appliquer la théorie', 'Analyse pratique', 'Définitions clés', 3, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 2, 'Quiz intermédiaire', 'Auto-évaluation',
 'Valider les acquis', 'Auto-évaluation', 'Exemples illustrés', 4, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO lecons (
    module_id, titre, description, objectifs,
    competences_ciblees, prerequis, ordre,
    version_active_id, date_creation, date_mise_a_jour
)
VALUES
(3, 'Atelier pratique', 'Travaux dirigés',
 'Mettre en pratique', 'Application concrète', 'Module 2', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Correction guidée', 'Analyse des solutions',
 'Comprendre ses erreurs', 'Esprit critique', 'Atelier pratique', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO lecons VALUES
(DEFAULT, 4, 'Présentation de l’évaluation', 'Modalités d’évaluation',
 'Comprendre le barème', 'Préparation', 'Tous les modules précédents', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 4, 'Examen blanc', 'Simulation d’examen',
 'S’entraîner', 'Gestion du stress', 'Présentation de l’évaluation', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 4, 'Évaluation finale', 'Test final',
 'Valider les acquis', 'Synthèse', 'Examen blanc', 3, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO lecons VALUES
(DEFAULT, 5, 'Introduction au programme', 'Vue d’ensemble',
 'Comprendre le programme', 'Vision globale', 'Aucun', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 5, 'Méthodologie de travail', 'Méthodes et conseils',
 'Adopter une bonne méthode', 'Organisation', 'Introduction au programme', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO lecons VALUES
(DEFAULT, 6, 'Concept avancé 1', 'Approfondissement',
 'Approfondir les connaissances', 'Analyse avancée', 'Module 5', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 6, 'Concept avancé 2', 'Suite des concepts',
 'Renforcer la compréhension', 'Raisonnement', 'Concept avancé 1', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 6, 'Étude de cas', 'Cas réel',
 'Analyser une situation réelle', 'Résolution de problèmes', 'Concept avancé 2', 3, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 6, 'Synthèse du module', 'Résumé',
 'Structurer les acquis', 'Synthèse', 'Étude de cas', 4, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO lecons VALUES
(DEFAULT, 7, 'Lancement du projet', 'Présentation du projet',
 'Comprendre le projet', 'Planification', 'Module 6', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 7, 'Réalisation', 'Développement du projet',
 'Mettre en œuvre', 'Autonomie', 'Lancement du projet', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 7, 'Présentation finale', 'Restitution',
 'Présenter son travail', 'Communication', 'Réalisation', 3, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO lecons VALUES
(DEFAULT, 8, 'Découverte du module', 'Introduction',
 'Découvrir les notions', 'Curiosité', 'Aucun', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 8, 'Premiers exercices', 'Mise en pratique',
 'Appliquer les bases', 'Application', 'Découverte du module', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO lecons VALUES
(DEFAULT, 9, 'Approfondissement', 'Notions intermédiaires',
 'Aller plus loin', 'Analyse', 'Module 8', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 9, 'Cas pratiques', 'Exercices guidés',
 'Résoudre des cas', 'Pratique', 'Approfondissement', 2, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(DEFAULT, 9, 'Bilan final', 'Clôture du module',
 'Synthétiser les acquis', 'Esprit de synthèse', 'Cas pratiques', 3, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
