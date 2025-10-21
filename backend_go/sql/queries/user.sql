-- name: RegisterUser :one
INSERT INTO users (id, email, password_hash, verification_code, verification_code_expiry, provider)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;