package main

import (
	"encoding/json"

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

type ContentBlock struct {
	Component string `json:"component"`
	Data      struct {
		FilePath string `json:"filePath"`
	} `json:"data"`
}

func extractFileRefsFromJSON(raw datatypes.JSON) (map[string]struct{}, error) {
	var blocks []ContentBlock

	if err := json.Unmarshal(raw, &blocks); err != nil {
		return nil, err
	}

	files := make(map[string]struct{})

	for _, block := range blocks {
		switch block.Component {
		case "image", "audio", "video", "document":
			if block.Data.FilePath != "" {
				files[block.Data.FilePath] = struct{}{}
			}
		}
	}

	return files, nil
}

func diffDeleted(old, new map[string]struct{}) []string {
	var deleted []string
	for f := range old {
		if _, exists := new[f]; !exists {
			deleted = append(deleted, f)
		}
	}
	return deleted
}
