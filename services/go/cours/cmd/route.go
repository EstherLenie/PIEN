package main

import (
	"PIEN/cours/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

func route(app *App) http.Handler {
	router := gin.Default()

	modelRepository := newGlbModelRepository(app.GetDb())
	hdrRepository := newHdrRepository(app.GetDb())
	moduleRepository := repository.NewModuleRepository(app.GetDb())
	lessonsRepository := repository.NewLessonRepository(app.GetDb())

	router.GET("/cours/models", listModels(app, modelRepository))
	router.GET("/cours/models/presets", listEnvironment(app, hdrRepository))
	router.GET("/cours/classes/:classId/modules/:moduleId/lessons", getLecons(app, moduleRepository))
	router.GET("/cours/classes/:classId/modules/:moduleId/lessons/:leconId", getLecon(app, lessonsRepository))
	router.GET("/cours/classes/:classId/modules/:moduleId/lessons/:leconId/contenus/:versionId", getLessonVersion(app, lessonsRepository))
	router.GET("/cours/classes/:classId/modules/:moduleId/lessons/:leconId/gerer", getLessonActiveVersion(app, lessonsRepository))
	router.GET("/cours/classes/:classId/modules", listClassModules(app, moduleRepository))
	router.GET("/cours/classes/:classId/modules/:moduleId", getModule(app, moduleRepository))

	router.POST("/cours/classes/:classId/modules", createModule(app, moduleRepository))
	router.POST("/cours/classes/:classId/modules/:moduleId", createLesson(app, lessonsRepository))

	router.PUT("/cours/classes/:classId/modules/:moduleId", updateModule(app, moduleRepository))
	router.PUT("/cours/classes/:classId/modules/:moduleId/lessons/:leconId", createLessonContent(app, lessonsRepository))
	router.PUT("/cours/classes/:classId/modules/:moduleId/order-lessons", orderModuleLessons(app, lessonsRepository))
	router.PUT("/cours/classes/:classId/order-modules", orderClassModules(app, moduleRepository))

	return router
}
