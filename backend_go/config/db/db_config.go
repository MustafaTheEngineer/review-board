package dbConfig

import (
	"database/sql"
	"os"

	"github.com/MustafaTheEngineer/review_board/internal/database"
	_ "github.com/lib/pq"
)

type DbConfig struct {
	SqlDb   *sql.DB
	Queries *database.Queries
}

func NewDbConfig() {
	dbUrl := os.Getenv("DB_URL")

	if dbUrl == "" {
		panic("DB_URL environment variable is not set")
	}

	db, err := sql.Open("postgres", dbUrl)
	if err != nil {
		panic(err)
	}

	queries := database.New(db)

	DbCfg = &DbConfig{
		SqlDb:   db,
		Queries: queries,
	}
}

var DbCfg *DbConfig
