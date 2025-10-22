-- name: InsertTag :one
INSERT INTO tags (id, created_by_user_id, name)
VALUES ($1, $2, $3)
RETURNING *;

-- name: SelectTagByName :one
SELECT * FROM tags WHERE name = $1;