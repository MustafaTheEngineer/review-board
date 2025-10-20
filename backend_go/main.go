package main

import (
	//_ "github.com/99designs/gqlgen"
	_ "github.com/99designs/gqlgen/graphql/introspection"
	apiConfig "github.com/MustafaTheEngineer/review_board/config/api"
	dbConfig "github.com/MustafaTheEngineer/review_board/config/db"
	"github.com/MustafaTheEngineer/review_board/handlers"
	"github.com/MustafaTheEngineer/review_board/helpers"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	dbConfig.NewDbConfig()
	apiConfig.NewApiConfig()

	helpers.InitValidator()
	handlers.GraphqlHandler()
}