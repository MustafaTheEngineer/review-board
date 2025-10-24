-- +goose Up
-- +goose StatementBegin
CREATE TYPE audit_action AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'PASSWORD_RESET',
    'EMAIL_VERIFICATION',
    'STATUS_CHANGE',
    'ROLE_CHANGE'
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE audit_action;
-- +goose StatementEnd