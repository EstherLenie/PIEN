package repository

import "PIEN/cours/domain"

type ModuleRepository interface {
	ListClassModules(uint64) ([]domain.Module, error)
	ListModuleLessons(uint64) (domain.Module, error)
	Save(*domain.Module) error
	GetById(int64) (domain.Module, error)
	SortModules([]domain.Module) error
}

type LessonRepository interface {
	ListModuleLessons(uint64) ([]domain.Lesson, error)
	Save(*domain.Lesson) error
	GetById(int64) (domain.Lesson, error)
	GetActiveVersion(int64) (domain.Lesson, error)
	GetLeconVersion(leconId, versionId int64) (domain.Lesson, error)
	OrderLessons([]domain.Lesson) error
}
