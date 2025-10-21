-- name: RegisterUser :one
INSERT INTO users (id, email, password_hash, verification_code, verification_code_expiry, provider)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: SetUserUsername :one
UPDATE users
SET username = $2
WHERE id = $1
RETURNING *;

-- name: ConfirmUser :one
UPDATE users
SET verification_code = NULL, verification_code_expiry = NULL, confirmed = TRUE, provider = $2
WHERE id = $1 AND verification_code = $3 AND verification_code_expiry > NOW()
RETURNING *;