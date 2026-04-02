package main

import (
	"PIEN/cours/domain"
	"PIEN/cours/repository"
	"PIEN/cours/service"
	"PIEN/cours/validator"
	"context"
	"net/http"
	"slices"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
)

func listModels(app *App, repo *GlbModelRepository) gin.HandlerFunc {

	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15)
		defer cancel()

		models, err := repo.GetAll(ctx)
		if err != nil {
			app.Error(err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}

		app.Success(c, http.StatusAccepted, models)

	}
}

func listEnvironment(app *App, repo *HdrRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15)
		defer cancel()

		environments, err := repo.listEnvironments(ctx)
		if err != nil {
			app.Error(err)
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}

		app.Success(c, http.StatusAccepted, environments)

	}
}

func listClassModules(app *App, repo repository.ModuleRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		classId, err := app.int64(c, "classId")
		if err != nil {
			return
		}

		modules, err := repo.ListClassModules(uint64(classId))
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, modules)

	}
}

func getLecons(app *App, repo repository.ModuleRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		moduleId, err := app.int64(c, "moduleId")
		if err != nil {
			return
		}

		module, err := repo.ListModuleLessons(uint64(moduleId))
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, module.Lecons)
	}
}

func getLecon(app *App, repo repository.LessonRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		leconId, err := app.int64(c, "leconId")
		if err != nil {
			return
		}

		lecon, err := repo.GetById(leconId)
		if err != nil {
			return
		}
		app.Success(c, http.StatusOK, lecon)
	}
}

func getLessonActiveVersion(app *App, repo repository.LessonRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		leconId, err := app.int64(c, "leconId")
		if err != nil {
			return
		}

		lecon, err := repo.GetActiveVersion(leconId)
		if err != nil {
			return
		}
		app.Success(c, http.StatusOK, lecon)
	}
}

func getLessonVersion(app *App, repo repository.LessonRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		leconId, err := app.int64(c, "leconId")
		if err != nil {
			return
		}

		versionId, err := app.int64(c, "versionId")
		if err != nil {
			return
		}

		lecon, err := repo.GetLeconVersion(leconId, versionId)
		if err != nil {
			return
		}
		app.Success(c, http.StatusOK, lecon)
	}
}

func saveNewContenuLecon(app *App, contentRepo repository.LessonContentRepository, lessonRepo repository.LessonRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		leconId, err := app.int64(c, "leconId")
		lecon, err := lessonRepo.GetById(leconId)
		if err != nil {
			return
		}

		lessonContent := domain.ContenuLecon{LeconID: lecon.ID}
		err = contentRepo.Save(&lessonContent)
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, lessonContent.ID)

	}
}

func createLessonContent(
	app *App,
	lessonRepo repository.LessonRepository,
	contentRepo repository.LessonContentRepository,
	mediaClient service.MediaClient,
) gin.HandlerFunc {

	return func(c *gin.Context) {
		leconId, err := app.int64(c, "leconId")
		if err != nil {
			return
		}

		lesson, err := lessonRepo.GetById(leconId)
		if err != nil {
			return
		}

		var payload struct {
			Contenu     datatypes.JSON `json:"contenu"`
			Titre       string         `json:"titre"`
			Description string         `json:"description"`
			Id          uint           `json:"id"`
		}

		if err := c.BindJSON(&payload); err != nil {
			return
		}

		// Ancienne version active
		var oldFiles map[string]struct{}
		if lesson.VersionActive != nil {
			oldFiles, err = extractFileRefsFromJSON(lesson.VersionActive.Contenu)
			if err != nil {
				return
			}
		} else {
			oldFiles = make(map[string]struct{})
		}

		// Nouvelle version
		newFiles, err := extractFileRefsFromJSON(payload.Contenu)
		if err != nil {
			return
		}

		//  Fichiers supprimés
		deleted := diffDeleted(oldFiles, newFiles)

		for _, f := range deleted {
			mediaClient.MarkOrphan(f)
		}

		// Création nouvelle version
		newContent := domain.ContenuLecon{
			LeconID:      lesson.ID,
			Contenu:      payload.Contenu,
			DateCreation: time.Now(),
		}

		if err := contentRepo.Save(&newContent); err != nil {
			return
		}

		// Mise à jour leçon
		lesson.VersionActiveID = &newContent.ID
		lesson.Titre = payload.Titre
		lesson.Description = payload.Description

		if err := lessonRepo.Save(&lesson); err != nil {
			return
		}

		app.Success(c, http.StatusOK, newContent.ID)
	}
}

func createModule(app *App, repo repository.ModuleRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		classId, err := app.int64(c, "classId")
		if err != nil {
			return
		}

		var module domain.Module

		err = c.BindJSON(&module)
		if err != nil {
			return
		}

		validator := validator.NewModuleValidator(module)
		if ok := validator.IsValid(); !ok {
			return
		}

		module.ClassId = uint64(classId)
		module.ID = 0

		err = repo.Save(&module)
		if err != nil {
			return
		}

		app.Success(c, http.StatusCreated, module)

	}
}

func updateModule(app *App, repo repository.ModuleRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		moduleId, err := app.int64(c, "moduleId")
		if err != nil {
			return
		}

		oldModule, err := repo.GetById(moduleId)
		if err != nil {
			return
		}

		var module domain.Module
		err = c.BindJSON(&module)
		if err != nil {
			return
		}

		validator := validator.NewModuleValidator(module)
		if ok := validator.IsValid(); !ok {
			return
		}

		module.ClassId = oldModule.ClassId
		module.ID = oldModule.ID

		err = repo.Save(&module)
		if err != nil {
			return
		}

		app.Success(c, http.StatusCreated, module)

	}
}

func orderModuleLessons(app *App, repo repository.LessonRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		moduleId, err := app.int64(c, "moduleId")
		if err != nil {
			return
		}

		var lessonOrder ItemOrder
		err = c.BindJSON(&lessonOrder)
		if err != nil {
			return
		}

		var orders = lessonOrder.Content
		lessons, err := repo.ListModuleLessons(uint64(moduleId))
		if err != nil {
			return
		}

		slices.SortFunc(orders, func(o1, o2 order) int {
			return int(o1.Id) - int(o2.Id)
		})
		slices.SortFunc(lessons, func(a, b domain.Lesson) int {
			return int(a.ID) - int(b.ID)
		})

		ok := slices.EqualFunc(orders, lessons, func(o order, l domain.Lesson) bool {
			return o.Id == uint64(l.ID)
		})

		if !ok {
			return
		}

		for i := range lessons {
			lessons[i].Ordre = orders[i].Order
		}

		err = repo.OrderLessons(lessons)
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, lessons)

	}
}

func orderClassModules(app *App, repo repository.ModuleRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		classId, err := app.int64(c, "classId")
		if err != nil {
			return
		}

		var moduleOrder ItemOrder
		err = c.BindJSON(&moduleOrder)
		if err != nil {
			return
		}

		var orders = moduleOrder.Content
		modules, err := repo.ListClassModules(uint64(classId))
		if err != nil {
			return
		}

		slices.SortFunc(orders, func(o1, o2 order) int {
			return int(o1.Id) - int(o2.Id)
		})
		slices.SortFunc(modules, func(a, b domain.Module) int {
			return int(a.ID) - int(b.ID)
		})

		ok := slices.EqualFunc(orders, modules, func(o order, l domain.Module) bool {
			return o.Id == uint64(l.ID)
		})

		if !ok {
			return
		}

		for i := range modules {
			modules[i].Ordre = orders[i].Order
		}

		err = repo.SortModules(modules)
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, modules)

	}
}

func createLesson(app *App, repo repository.LessonRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		moduleId, err := app.int64(c, "moduleId")
		if err != nil {
			return
		}

		var lesson domain.Lesson

		err = c.BindJSON(&lesson)
		if err != nil {
			return
		}

		validator := validator.NewLessonValidator(lesson)
		if ok := validator.IsValid(); !ok {
			return
		}

		lesson.ModuleID = uint64(moduleId)
		lesson.ID = 0

		err = repo.Save(&lesson)
		if err != nil {
			return
		}

		app.Success(c, http.StatusCreated, lesson)

	}
}

func getLessonContent(app *App, repo repository.LessonRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		lessonId, err := app.int64(c, "moduleId")
		if err != nil {
			return
		}

		lesson, err := repo.GetById(lessonId)
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, lesson)
	}
}

func getModule(app *App, repo repository.ModuleRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		moduleId, err := app.int64(c, "moduleId")
		if err != nil {
			return
		}

		module, err := repo.GetById(moduleId)
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, module)
	}
}

func listClassResources(app *App, repo repository.RessourceRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		classId, err := app.int64(c, "classId")
		if err != nil {
			return
		}
		resources, err := repo.ListClassRessources(uint64(classId))
		app.Success(c, http.StatusOK, resources)
	}
}

func deleteLesson(app *App, repo repository.LessonRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		lessonId, err := app.int64(c, "lessonId")
		if err != nil {
			return
		}
		lesson, err := repo.GetById(lessonId)
		err = repo.Delete(lessonId)
		if err != nil {
			return
		}
		app.Success(c, http.StatusOK, lesson)

	}
}

func DeleteClassResources(app *App, repo repository.RessourceRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		Id, err := app.int64(c, "ressourceId")
		if err != nil {
			return
		}
		err = repo.DeleteRessources(uint(Id))
		if err != nil {
			return
		}
		app.Success(c, http.StatusOK, Id)

	}
}

func deleteModule(app *App, repo repository.ModuleRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		moduleId, err := app.int64(c, "moduleId")
		if err != nil {
			return
		}

		module, err := repo.GetById(moduleId)
		if err != nil {
			return
		}

		err = repo.Delete(moduleId)
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, module)
	}
}
func addRessources(app *App, repo repository.RessourceRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		classId, err := app.int64(c, "classId")
		if err != nil {
			return
		}
		var ressource domain.Materiel
		err = c.BindJSON(&ressource)
		if err != nil {
			return
		}
		ressource.ClassId = uint64(classId)
		ressource.SourceId = nil
		err = repo.AddRessources(&ressource)
		if err != nil {
			return
		}
		app.Success(c, http.StatusOK, ressource)

	}
}

func deleteLessonContent(app *App, repo repository.LessonContentRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		versionId, err := app.int64(c, "versionId")
		if err != nil {
			return
		}

		content, err := repo.FindById(versionId)
		if err != nil {
			return
		}

		err = repo.Delete(versionId)
		if err != nil {
			return
		}

		app.Success(c, http.StatusOK, content)
	}
}
