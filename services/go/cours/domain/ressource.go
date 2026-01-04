package domain

import "time"

type Materiel struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	CreatedAt   time.Time `gorm:"column:date_creation" json:"dateCreation"`
	Type        string    `gorm:"column:type;not null" json:"type"`
	Titre       string    `gorm:"column:titre;size:255" json:"titre"`
	Filename    string    `gorm:"column:filename;size:255" json:"filename"`
	Description string    `gorm:"column:description" json:"description"`
	URL         string    `gorm:"column:url" json:"url"`

	SourceId *uint64 `gorm:"column:source_id" json:"sourceId"`
	ClassId  uint64  `gorm:"column:classe_id" json:"classId"`
}
