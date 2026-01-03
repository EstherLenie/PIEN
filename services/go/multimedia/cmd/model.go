package main

import "time"

type MultimediaFile struct {
	ID       int       `gorm:"primaryKey" json:"id"`
	Url      string    `json:"url"`
	Path     string    `json:"-"`
	Filename string    `json:"filename"`
	Type     string    `json:"type"`
	CreeLe   time.Time `json:"creeLe"`
	CreePar  int       `json:"-"`
}

func (MultimediaFile) TableName() string {
	return "multimedia_file"
}
