package main

import (
	"io"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetFileHandler(app *App, repo MultimediaRepository, storage fileStorage) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		url, _ := ctx.Params.Get("url")

		if cachedFile, ok := app.cache.Get(url); ok {
			content, ok := (cachedFile.GetContent()).([]byte)
			if ok {
				contentType := http.DetectContentType(content)
				app.file(ctx, http.StatusOK, contentType, content)
				return
			}

		}

		multimedia, err := repo.findByUrl(url)
		if err != nil {
			return
		}
		savedFile, err := storage.open(multimedia.Path)
		if err != nil {
			return
		}
		contentType := http.DetectContentType(savedFile)

		app.cache.Put(url, savedFile)
		app.file(ctx, http.StatusOK, contentType, savedFile)

	}
}

func SaveFileHandler(app *App, repo MultimediaRepository, storage fileStorage) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		file, err := ctx.FormFile("file")
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "file is required",
			})
			return
		}

		src, err := file.Open()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "cannot open file",
			})
			return
		}
		defer src.Close()

		content, err := io.ReadAll(src)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "cannot read file",
			})
			return
		}

		contentType := http.DetectContentType(content)

		url := uuid.NewString() + filepath.Ext(file.Filename)

		path, err := storage.save(url, content)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "cannot save file",
			})
			return
		}

		multimedia := MultimediaFile{

			Url:      url,
			Path:     path,
			Type:     contentType,
			Filename: file.Filename,
		}

		if err := repo.Save(multimedia); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "cannot save metadata",
			})
			return
		}

		app.cache.Put(multimedia.Url, content)
		app.Success(ctx, http.StatusOK, map[string]string{"url": multimedia.Url})

	}
}
