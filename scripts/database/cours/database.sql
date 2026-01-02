CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    classe_id bigint,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    objectifs TEXT,
    competences_ciblees TEXT,
    prerequis TEXT,
    ordre INT NOT NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

);

CREATE TABLE lecons (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    objectifs TEXT,
    competences_ciblees TEXT,
    prerequis TEXT,
    ordre INT,
    version_active_id BIGINT,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE TABLE commentaires_modules (
    id BIGINT PRIMARY KEY,
    module_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT,
    contenu TEXT,
    horodatage TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES commentaires_modules(id) ON DELETE CASCADE
);

CREATE TABLE contenu_lecon (
    id BIGSERIAL PRIMARY KEY,
    lecon_id BIGINT NOT NULL,
    contenu JSONB, 
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecon_id) REFERENCES lecons(id) ON DELETE CASCADE
);

ALTER TABLE lecons
ADD CONSTRAINT fk_version_active_id
FOREIGN KEY (version_active_id) REFERENCES contenu_lecon(id) ON DELETE SET NULL;




CREATE TABLE commentaires_lecons (
    id BIGINT PRIMARY KEY,
    lecon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT,
    contenu TEXT,
    horodatage TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecon_id) REFERENCES lecons(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES commentaires_lecons(id) ON DELETE CASCADE
);

CREATE TABLE materiels (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(255),
    description TEXT,
    url TEXT,
    source_id BIGINT,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES lecons(id)
);

CREATE TABLE groupes (
    id BIGSERIAL PRIMARY KEY,
    classe_id BIGINT NOT NULL,
    nom VARCHAR NOT NULL,
    description VARCHAR,
    horodatage TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    est_supprime BOOLEAN,
    cree_par BIGINT NOT NULL
);

CREATE TABLE groupe_membres (
    id BIGSERIAL PRIMARY KEY,
    groupe_id BIGINT NOT NULL,
    membre BIGINT NOT NULL,
    horodatage TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (groupe_id) REFERENCES groupes(id) ON DELETE CASCADE
);