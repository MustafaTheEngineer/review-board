-- +goose Up
-- +goose StatementBegin
INSERT INTO users (id, email, username, provider, password_hash, confirmed, role) VALUES
    (
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'admin@mail.com',
    'Admin',
    'email',
    '$2a$14$SnJ0rC1uLOvqvcmrqwAhcOkDvjXQRU3M9VhaaEYPk6Qb.VbmiS6Pq',
    TRUE,
    'ADMIN'
    ),
    (
    '617d6126-efb6-454a-bdf2-a1b512e19569',
    'user@mail.com',
    'User',
    'email',
    '$2a$14$SnJ0rC1uLOvqvcmrqwAhcOkDvjXQRU3M9VhaaEYPk6Qb.VbmiS6Pq',
    TRUE,
    'USER'
    )
  ON CONFLICT DO NOTHING;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM users WHERE id = 'a452b60a-df84-48d4-95ad-2542b8ed10aa';
-- +goose StatementEnd