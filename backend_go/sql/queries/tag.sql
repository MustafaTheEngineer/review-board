-- name: InsertTag :one
INSERT INTO tags (id, created_by_user_id, name)
VALUES ($1, $2, $3)
RETURNING *;

-- name: SelectTagByName :one
SELECT * FROM tags WHERE name = $1;


-- name: SelectItemTags :many
SELECT t.id, t.name
FROM tags t
INNER JOIN item_tags it ON t.id = it.tag_id
WHERE it.item_id = $1;