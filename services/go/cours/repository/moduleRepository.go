package repository

import (
	"PIEN/cours/domain"

	"gorm.io/gorm"
)

type appModuleRepository struct {
	db *gorm.DB
}

func NewModuleRepository(db *gorm.DB) ModuleRepository {
	return &appModuleRepository{db: db}
}

func (r *appModuleRepository) ListClassModules(classId uint64) ([]domain.Module, error) {
	var modules []domain.Module

	result := r.db.Preload("Lecons", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "module_id")
	}).Where(&domain.Module{ClassId: classId}).Find(&modules)
	return modules, result.Error
}

func (r *appModuleRepository) ListModuleLessons(moduleId uint64) (domain.Module, error) {
	var module domain.Module
	result := r.db.Preload("Lecons", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "module_id", "titre", "date_creation", "date_mise_a_jour", "ordre")
	}).First(&module, moduleId)

	return module, result.Error
}

func (r *appModuleRepository) Save(m *domain.Module) error {
	result := r.db.Save(m)
	return result.Error
}

func (r *appModuleRepository) GetById(moduleId int64) (domain.Module, error) {
	var m domain.Module

	result := r.db.Find(&m, moduleId)
	return m, result.Error
}

func (r *appModuleRepository) SortModules(modules []domain.Module) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		for _, m := range modules {
			if err := tx.Model(&m).Update("ordre", m.Ordre).Error; err != nil {
				return err
			}
		}
		return nil
	})
}
