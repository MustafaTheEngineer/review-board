package types

import "github.com/MustafaTheEngineer/review_board/internal/database"

type contextKey string

const UserContextKey contextKey = "user"

type UserContext struct {
	User database.User
}
