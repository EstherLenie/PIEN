package validator

type Validator interface {
	IsValid() bool
	GetErrors() map[string][]string
}
