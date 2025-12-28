package domain

import "time"

type BaseModel struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	CreatedAt time.Time `gorm:"column:date_creation" json:"dateCreation"`
	UpdatedAt time.Time `gorm:"column:date_mise_a_jour" json:"datemiseAJour"`
}
