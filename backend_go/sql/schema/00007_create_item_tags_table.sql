-- +goose Up
-- +goose StatementBegin
CREATE TABLE item_tags (
    item_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY (item_id, tag_id),
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create a trigger to call the function
CREATE TRIGGER update_item_tags_updated_at
BEFORE UPDATE ON item_tags
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS update_item_tags_updated_at ON item_tags;
DROP TABLE IF EXISTS item_tags;
-- +goose StatementEnd