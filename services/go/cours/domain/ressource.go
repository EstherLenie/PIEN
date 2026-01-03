package domain

type Materiel struct {
	BaseModel
	Type        string `gorm:"column:type;not null;size:50" json:"type"`
	Titre       string `gorm:"column:titre;size:255" json:"titre"`
	Description string `gorm:"column:description" json:"description"`
	URL         string `gorm:"column:url" json:"url"`

	SourceId uint64 `gorm:"column:source_id" json:"sourceId"`
	ClassId  uint64 `gorm:"column:classe_id" json:"classId"`
}
