-- +goose Up
-- +goose StatementBegin
CREATE TYPE item_status AS ENUM ('NEW', 'IN_REVIEW', 'APPROVED', 'REJECTED');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE IF EXISTS item_status;
-- +goose StatementEnd
