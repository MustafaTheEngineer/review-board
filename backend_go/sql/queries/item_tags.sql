-- name: InsertItemTag :one
INSERT INTO item_tags (item_id, tag_id)
VALUES ($1, $2)
RETURNING *;

-- name: ItemHaveTag :one
SELECT * FROM item_tags
WHERE item_id = $1 AND tag_id = $2;

-- name: DeleteItemTags :execresult
DELETE FROM item_tags
WHERE item_id = $1;