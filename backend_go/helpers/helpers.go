package helpers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	apiConfig "github.com/MustafaTheEngineer/review_board/config/api"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateVerificationCode() (string, error) {
	bytes := make([]byte, 3)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func GenerateJWT(userID string, userRole string) (string, error) {
	tokenExpiry := time.Now().Add(time.Hour * 24).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  userID,
		"role": userRole,
		"iat":  time.Now().Unix(), // Issued At: current time
		"exp":  tokenExpiry,
	})


	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString([]byte(apiConfig.ApiCfg.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

type contextKey string
const ResponseWriterKey contextKey = "responseWriter"

func WithResponseWriter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), ResponseWriterKey, w)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}