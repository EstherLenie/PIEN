package repository

import (
	"PIEN/cours/domain"

	"gorm.io/gorm"
)

type appLessonContentRepository struct {
	db *gorm.DB
}

func NewLessonContentRepository(db *gorm.DB) LessonContentRepository {
	return &appLessonContentRepository{
		db: db,
	}
}

func (r *appLessonContentRepository) FindById(contentId int64) (domain.ContenuLecon, error) {
	var c domain.ContenuLecon

	result := r.db.Find(&c, contentId)
	return c, result.Error
}

func (r *appLessonContentRepository) ListLessonContent(lessonId int64) ([]domain.ContenuLecon, error) {
	var c []domain.ContenuLecon

	result := r.db.Where("lecon_id=?", lessonId).Find(&c)
	return c, result.Error
}

func (r *appLessonContentRepository) Save(c *domain.ContenuLecon) error {
	return r.db.Save(c).Error
}

func (r *appLessonContentRepository) Delete(versionId int64) error {
	c := domain.ContenuLecon{ID: uint(versionId)}
	return r.db.Delete(&c).Error
}
