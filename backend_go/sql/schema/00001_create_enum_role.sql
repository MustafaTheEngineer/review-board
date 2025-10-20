-- +goose Up
-- +goose StatementBegin
CREATE TYPE role AS ENUM ('user', 'admin');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE role;
-- +goose StatementEnd
