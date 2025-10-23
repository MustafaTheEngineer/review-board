-- +goose Up
-- +goose StatementBegin
INSERT INTO tags (id, name) VALUES
  ('39f271ee-2990-44f6-9e0e-88e682063055', 'urgent'),
  ('864c34fc-1825-4315-947c-bc885d5437ce', 'bug'),
  ('42c58800-6fe2-441f-83b7-ee55a203bcf9', 'feature'),
  ('a9261b5c-3508-4514-8b44-f0ae40eca101', 'enhancement'),
  ('839aa0f6-ad44-42aa-94fb-3dd743b2c054', 'documentation'),
  ('369d92ca-1b80-4aaa-8ef6-89e21b9d105d', 'design'),
  ('32485a5b-fc94-42c8-996e-a463604d611c', 'performance'),
  ('599d862d-15df-4a70-8150-63e2f63199c7', 'security'),
  ('b7343abd-f790-48e0-920d-85f9627e238e', 'testing'),
  ('64c44114-5c7a-4044-aee7-aa2814336bd2', 'refactoring'),
  ('e5124bfd-9398-4be4-9461-d69a6ee296b7', 'risky')
  ON CONFLICT DO NOTHING;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM tags WHERE id IN (
    '39f271ee-2990-44f6-9e0e-88e682063055',
    '864c34fc-1825-4315-947c-bc885d5437ce',
    '42c58800-6fe2-441f-83b7-ee55a203bcf9',
    'a9261b5c-3508-4514-8b44-f0ae40eca101',
    '839aa0f6-ad44-42aa-94fb-3dd743b2c054',
    '369d92ca-1b80-4aaa-8ef6-89e21b9d105d',
    '32485a5b-fc94-42c8-996e-a463604d611c',
    '599d862d-15df-4a70-8150-63e2f63199c7',
    'b7343abd-f790-48e0-920d-85f9627e238e',
    '64c44114-5c7a-4044-aee7-aa2814336bd2'
);
-- +goose StatementEnd