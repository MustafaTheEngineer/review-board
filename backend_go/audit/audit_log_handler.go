package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"github.com/MustafaTheEngineer/review_board/internal/database"
	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

type Log[T any] struct {
	UserID      uuid.UUID
	UserEmail   string
	UserRole    database.Role
	EntityType  string
	EntityID    uuid.UUID
	Action      database.AuditAction
	OldValues   *T
	NewValues   *T
	Description *string
}

func InsertAuditLog[T any](
	qtx *database.Queries,
	ctx context.Context,
	log Log[T]) error {

	oldValuesByte, err := json.Marshal(
		&log.OldValues,
	)
	if err != nil {
		return err
	}
	oldValuesRaw := json.RawMessage(oldValuesByte)

	newValuesByte, err := json.Marshal(
		&log.NewValues,
	)
	if err != nil {
		return err
	}
	newValuesRaw := json.RawMessage(newValuesByte)

	_, err = qtx.InsertAuditLog(ctx, database.InsertAuditLogParams{
		ID: uuid.New(),
		UserID: uuid.NullUUID{
			UUID:  log.UserID,
			Valid: true,
		},
		UserEmail: sql.NullString{
			String: log.UserEmail,
			Valid:  true,
		},
		UserRole: database.NullRole{
			Role:  log.UserRole,
			Valid: true,
		},
		EntityType: log.EntityType,
		EntityID:   log.EntityID,
		Action:     log.Action,
		OldValues: pqtype.NullRawMessage{
			RawMessage: oldValuesRaw,
			Valid:      true,
		},
		NewValues: pqtype.NullRawMessage{
			RawMessage: newValuesRaw,
			Valid:      true,
		},
		Description: sql.NullString{
			String: func() string {
				if log.Description == nil {
					return ""

				}
				return *log.Description
			}(),
			Valid: log.Description != nil,
		},
	})
	if err != nil {
		return err
	}

	return nil
}
