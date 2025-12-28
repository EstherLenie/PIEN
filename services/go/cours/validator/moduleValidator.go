package validator

import "PIEN/cours/domain"

func NewModuleValidator(d domain.Module) Validator {
	return moduleValidator{
		module: d,
		err:    make(map[string][]string),
	}
}

type moduleValidator struct {
	module domain.Module
	err    map[string][]string
}

func (v moduleValidator) IsValid() bool {
	if len(v.module.Titre) == 0 {
		v.err["titre"] = append(v.err["titre"], "le titre est obligatoire")
	}
	return len(v.err) == 0
}

func (v moduleValidator) GetErrors() map[string][]string {
	return v.err
}
