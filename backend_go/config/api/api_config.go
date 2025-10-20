package apiConfig

import (
	"os"
)

type ApiConfig struct {
	JWTSecret string
	Url       string
	Port      string
}

func NewApiConfig() {
	jwtSecret := os.Getenv("JWT_SECRET")
	portString := os.Getenv("PORT")
	urlString := os.Getenv("URL")

	if jwtSecret == "" || portString == "" || urlString == "" {
		panic("Missing required environment variables: JWT_SECRET, PORT, URL")
	}

	ApiCfg = &ApiConfig{
		JWTSecret: jwtSecret,
		Url:       urlString,
		Port:      portString,
	}
}

var ApiCfg *ApiConfig
