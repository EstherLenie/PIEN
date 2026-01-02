package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func route(app *App) http.Handler {
	router := gin.Default()
	multiMediaRepository := newMultiMediaRepository(app.db)
	storage := newFileStorage()

	router.GET("/multimedia/:url", GetFileHandler(app, multiMediaRepository, storage))
	router.POST("/multimedia", SaveFileHandler(app, multiMediaRepository, storage))

	return router
}
