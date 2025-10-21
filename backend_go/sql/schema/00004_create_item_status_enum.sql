-- +goose Up
-- +goose StatementBegin
CREATE TYPE item_status AS ENUM ('new', 'in_review', 'approved', 'rejected');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE IF EXISTS item_status;
-- +goose StatementEnd
