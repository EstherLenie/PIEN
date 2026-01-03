package repository

import (
	"PIEN/cours/domain"

	"gorm.io/gorm"
)

// ------------------------
// Ressource Repository
// ------------------------
type appRessourceRepository struct {
	db *gorm.DB
}

// interface publique pour le repository
type RessourceRepository interface {
	ListClassRessources(classId uint64) ([]domain.Materiel, error)
	DeleteRessources(Id uint) error
}

// constructeur
func NewRessourceRepository(db *gorm.DB) RessourceRepository {
	return &appRessourceRepository{db: db}
}

// liste toutes les ressources pour une classe donnée
func (r *appRessourceRepository) ListClassRessources(classId uint64) ([]domain.Materiel, error) {
	var ressources []domain.Materiel

	result := r.db.
		Where(&domain.Materiel{ClassId: classId}).
		Find(&ressources)

	return ressources, result.Error
}
func (r *appRessourceRepository) DeleteRessources(Id uint) error {
	result := r.db.
		Delete(&domain.Materiel{BaseModel: domain.BaseModel{ID: Id}})

	return result.Error
}
