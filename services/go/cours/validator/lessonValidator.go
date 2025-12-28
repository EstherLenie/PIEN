package validator

import "PIEN/cours/domain"

func NewLessonValidator(l domain.Lesson) Validator {
	return lessonValidator{lesson: l, err: make(map[string][]string)}
}

type lessonValidator struct {
	lesson domain.Lesson
	err    map[string][]string
}

func (l lessonValidator) IsValid() bool {
	return len(l.err) == 0
}

func (l lessonValidator) GetErrors() map[string][]string {
	return l.err
}
