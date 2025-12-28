package repository

import (
	"PIEN/cours/domain"

	"gorm.io/gorm"
)

type appLessonRepository struct {
	db *gorm.DB
}

func NewLessonRepository(db *gorm.DB) LessonRepository {
	return &appLessonRepository{db: db}
}

func (r *appLessonRepository) ListModuleLessons(moduleId uint64) ([]domain.Lesson, error) {
	var lessons []domain.Lesson

	result := r.db.
		Where(&domain.Lesson{ModuleID: moduleId}).
		Select("id", "titre", "description", "ordre", "date_creation").
		Find(&lessons)
	return lessons, result.Error
}

func (r *appLessonRepository) Save(l *domain.Lesson) error {
	result := r.db.Save(l)
	return result.Error
}

func (r *appLessonRepository) OrderLessons(lessons []domain.Lesson) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		for _, l := range lessons {
			if err := tx.Model(&l).Update("ordre", l.Ordre).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *appLessonRepository) GetById(lessonId int64) (domain.Lesson, error) {
	var lesson domain.Lesson

	result := r.db.Preload("ContenuLecons").Find(&lesson, lessonId)
	return lesson, result.Error
}

func (r *appLessonRepository) GetActiveVersion(lessonId int64) (domain.Lesson, error) {
	var lesson domain.Lesson

	result := r.db.Preload("VersionActive").Find(&lesson, lessonId)
	return lesson, result.Error
}

func (r *appLessonRepository) GetLeconVersion(lessonId, versionId int64) (domain.Lesson, error) {
	var lesson domain.Lesson

	result := r.db.Preload("ContenuLecons", func(db *gorm.DB) *gorm.DB {
		return db.Where("id = ?", versionId)
	}).Find(&lesson, lessonId)
	return lesson, result.Error
}
