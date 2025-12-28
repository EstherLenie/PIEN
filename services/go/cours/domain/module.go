package domain

import "github.com/lib/pq"

type Module struct {
	BaseModel
	Titre              string              `gorm:"column:titre;not null;size:255" json:"titre"`
	Description        string              `gorm:"column:description" json:"description"`
	Objectifs          pq.StringArray      `gorm:"column:objectifs;type:varchar[]" json:"objectifs"`
	CompetencesCiblees pq.StringArray      `gorm:"column:competences_ciblees;type:varchar[]" json:"competences_ciblees"`
	Prerequis          pq.StringArray      `gorm:"column:prerequis;type:varchar[]" json:"prerequis"`
	Ordre              uint                `gorm:"column:ordre;not null" json:"ordre"`
	Lecons             []Lesson            `gorm:"foreignKey:ModuleID" json:"lecons,omitempty"`
	Commentaires       []CommentaireModule `gorm:"foreignKey:ModuleID" json:"commentaires,omitempty"`
	ClassId            uint64              `gorm:"column:classe_id;not null" json:"classId"`
}
