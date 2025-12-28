package main

import (
	"gorm.io/datatypes"
)

type Lesson struct {
	Id                 uint64         `json:"id"`
	ModuleID           uint64         `json:"module_id"`
	Titre              string         `json:"titre"`
	Description        string         `json:"description"`
	Objectifs          []string       `json:"objectifs"`
	CompetencesCiblees []string       `json:"competencesCiblees"`
	Prerequis          []string       `json:"prerequis"`
	Contenu            datatypes.JSON `json:"contenu"`
	Commentaires       []string       `json:"commentaires"`
}

type ItemOrder struct {
	Content []order `json:"content"`
}

type order struct {
	Id    uint64 `json:"id"`
	Order uint   `json:"order"`
}
