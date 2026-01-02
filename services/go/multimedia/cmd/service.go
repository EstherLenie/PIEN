package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

type fileStorage interface {
	save(string, []byte) (string, error)
	open(string) ([]byte, error)
	delete(string) error
}

type localFileStorage struct {
	resourcesPath string
}

func (lfs *localFileStorage) save(filename string, content []byte) (string, error) {
	if err := os.MkdirAll(lfs.resourcesPath, os.ModePerm); err != nil {
		return "", fmt.Errorf("cannot create storage folder: %w", err)
	}

	fullPath := filepath.Join(lfs.resourcesPath, filename)

	if err := os.WriteFile(fullPath, content, 0644); err != nil {
		return "", fmt.Errorf("cannot write file: %w", err)
	}
	return fullPath, nil
}

func (lfs *localFileStorage) open(path string) ([]byte, error) {
	resourcePath := filepath.FromSlash(filepath.Join(lfs.resourcesPath, path))

	return os.ReadFile(resourcePath)
}

func (lfs *localFileStorage) delete(path string) error {
	fullPath := filepath.Join(lfs.resourcesPath, path)

	return os.Remove(fullPath)
}

func newFileStorage() fileStorage {
	return &localFileStorage{
		resourcesPath: viper.GetString("resources.path"),
	}
}
