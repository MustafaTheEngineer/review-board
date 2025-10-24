-- name: InsertAuditLog :execresult
INSERT INTO audit_logs (
    id,
    user_id,
    user_email,
    user_role,
    entity_type,
    entity_id,
    action,
    old_values,
    new_values,
    changed_fields,
    description
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);

-- name: GetAuditLogs :many
SELECT * FROM audit_logs;