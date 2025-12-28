package domain

import "github.com/lib/pq"

type Lesson struct {
	BaseModel
	ModuleID           uint64         `gorm:"column:module_id;not null" json:"module_id"`
	Titre              string         `gorm:"column:titre;not null;size:255" json:"titre"`
	Description        string         `gorm:"column:description" json:"description"`
	Objectifs          pq.StringArray `gorm:"column:objectifs;type:varchar[]" json:"objectifs"`
	CompetencesCiblees pq.StringArray `gorm:"column:competences_ciblees;type:varchar[]" json:"competencesCiblees"`
	Prerequis          pq.StringArray `gorm:"column:prerequis;type:varchar[]" json:"prerequis"`
	Ordre              uint           `gorm:"column:ordre;not null" json:"ordre"`
	VersionActiveID    *uint          `gorm:"column:version_active_id" json:"versionActiveId"`

	ContenuLecons []ContenuLecon     `gorm:"foreignKey:LeconID" json:"versions,omitempty"`
	Commentaires  []CommentaireLecon `gorm:"foreignKey:LeconID" json:"commentaires,omitempty"`
	VersionActive *ContenuLecon      `gorm:"foreignKey:VersionActiveID" json:"versionActive,omitempty"`
}

func (l Lesson) TableName() string {
	return "lecons"
}
