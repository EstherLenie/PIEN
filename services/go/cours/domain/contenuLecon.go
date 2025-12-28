package domain

import (
	"time"

	"gorm.io/datatypes"
)

type ContenuLecon struct {
	ID           uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	LeconID      uint           `gorm:"column:lecon_id;not null" json:"lecon_id"`
	Contenu      datatypes.JSON `gorm:"type:jsonb" json:"contenu"`
	DateCreation time.Time      `gorm:"column:date_creation" json:"date_creation"`
	NomVersion   string
	Lecon        Lesson `gorm:"foreignKey:LeconID" json:"lecon,omitempty"`
}

func (ContenuLecon) TableName() string {
	return "contenu_lecon"
}
