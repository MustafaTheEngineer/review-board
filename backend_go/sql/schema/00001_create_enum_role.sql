-- +goose Up
-- +goose StatementBegin
CREATE TYPE role AS ENUM ('USER', 'ADMIN');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE role;
-- +goose StatementEnd
