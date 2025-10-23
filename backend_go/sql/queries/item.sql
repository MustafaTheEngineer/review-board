-- name: InsertItem :one
INSERT INTO items (id, creator_id, title, description, amount, status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: SelectUserItem :one
SELECT * FROM items WHERE creator_id = $1 AND  title = $2;

-- name: ItemById :one
SELECT * FROM items WHERE id = $1;

-- name: UpdateItemStatus :one
UPDATE items
SET status = $1
WHERE id = $2
RETURNING *;