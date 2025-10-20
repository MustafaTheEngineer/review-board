package helpers

import "github.com/go-playground/validator/v10"

type Validator struct{}

func InitValidator() {
	V = validator.New()
}

var V *validator.Validate
