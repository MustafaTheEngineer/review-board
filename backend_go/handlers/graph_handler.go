package handlers

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	transport "github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	generated "github.com/MustafaTheEngineer/review_board/graph/generated"
	resolvers "github.com/MustafaTheEngineer/review_board/graph/resolvers"
	"github.com/MustafaTheEngineer/review_board/helpers"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8100"

func GraphqlHandler() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	c := generated.Config{Resolvers: &resolvers.Resolver{}}

	defineDirectives(&c)

	srv := handler.New(generated.NewExecutableSchema(c))

	if os.Getenv("ENVIRONMENT") == "development" {
		srv.Use(extension.Introspection{})
	}

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	mux := http.NewServeMux()

	mux.Handle("/", playground.Handler("GraphQL playground", "/query"))
	mux.Handle("/query", helpers.WithResponseWriter(srv))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://176.33.96.143", "http://localhost:4000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type", "Set-Cookie"},
		AllowCredentials: true,
	}).Handler(mux)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
