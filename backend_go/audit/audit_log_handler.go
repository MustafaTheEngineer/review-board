package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"github.com/MustafaTheEngineer/review_board/internal/database"
	"github.com/google/uuid"
	"github.com/sqlc-dev/pqtype"
)

func InsertAuditLog(
	qtx *database.Queries,
	ctx context.Context,
	userID uuid.UUID,
	userEmail string,
	userRole database.Role,
	entityType string,
	entityID uuid.UUID,
	action database.AuditAction,
	oldValues any,
	newValues any,
	description *string) error {

	oldValuesByte, err := json.Marshal(
		oldValues,
	)
	if err != nil {
		return err
	}
	oldValuesRaw := json.RawMessage(oldValuesByte)

	newValuesByte, err := json.Marshal(
		newValues,
	)
	if err != nil {
		return err
	}
	newValuesRaw := json.RawMessage(newValuesByte)

	_, err = qtx.InsertAuditLog(ctx, database.InsertAuditLogParams{
		ID: uuid.New(),
		UserID: uuid.NullUUID{
			UUID:  userID,
			Valid: true,
		},
		UserEmail: sql.NullString{
			String: userEmail,
			Valid:  true,
		},
		UserRole: database.NullRole{
			Role:  userRole,
			Valid: true,
		},
		EntityType: "USER",
		EntityID:   entityID,
		Action:     database.AuditActionCREATE,
		OldValues: pqtype.NullRawMessage{
			RawMessage: oldValuesRaw,
			Valid:      true,
		},
		NewValues: pqtype.NullRawMessage{
			RawMessage: newValuesRaw,
			Valid:      true,
		},
	})
	if err != nil {
		return err
	}

	return nil
}
