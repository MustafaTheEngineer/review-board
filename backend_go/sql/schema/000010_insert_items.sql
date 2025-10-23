-- +goose Up
-- +goose StatementBegin
INSERT INTO items (id, creator_id, title, description, amount, status) VALUES
    (
    'a05b2b57-4470-4bd9-8f61-c02025022780',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'Website Redesign',
    'Complete overhaul of company website with modern UI/UX design',
    5000.00,
    'APPROVED'
    ),
    (
    'f3a23c9f-7f84-4faf-b14b-dcab188b4f77',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'Mobile App Development',
    'Develop cross-platform mobile application for iOS and Android',
    15000.00,
    'APPROVED'
    ),
    (
    'd59fff3f-c178-4dbc-a4b3-beaf1abb43bf',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'Database Migration',
    'Migrate legacy database to PostgreSQL with zero downtime',
    3500.00,
    'APPROVED'
    ),
    (
    '35de5482-c548-4b0f-8c58-cdd2df99662c',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'API Integration',
    'Integrate third-party payment gateway and shipping APIs',
    2500.00,
    'APPROVED'
    ),
    (
    'dc586f33-b83a-4114-84b4-e2ffcfa861de',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'Security Audit',
    'Comprehensive security audit and penetration testing',
     4000.00,
    'APPROVED'
    ),
    (
    '653f1ede-5e4b-4d7f-b674-638263a4a147',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'Cloud Infrastructure Setup',
    'Set up AWS infrastructure with auto-scaling and load balancing',
     6000.00,
    'REJECTED'
    ),
    (
    'ec281d80-1a03-49e7-996b-71bdabfceb0e',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'E-commerce Platform',
    'Build custom e-commerce platform with inventory management',
     20000.00,
    'REJECTED'
    ),
    (
    '8501dc67-e8be-4d79-a578-ef289575aa15',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'Content Management System',
    'Develop headless CMS for blog and marketing content',
     8000.00,
    'REJECTED'
    ),
    (
    'f90f0375-e640-4e48-9fab-11071c9aa465',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'Performance Optimization',
    'Optimize application performance and reduce load times by 50%',
     3000.00,
    'REJECTED'
    ),
    (
    'e09540c4-6e3c-4768-96ce-f7386110d00c',
    'a452b60a-df84-48d4-95ad-2542b8ed10aa',
    'Analytics Dashboard',
    'Create real-time analytics dashboard with data visualization',
     4500.00,
    'REJECTED'
    )
  ON CONFLICT DO NOTHING;

  INSERT INTO item_tags (item_id, tag_id) VALUES
    ('a05b2b57-4470-4bd9-8f61-c02025022780', '369d92ca-1b80-4aaa-8ef6-89e21b9d105d'),
    ('f3a23c9f-7f84-4faf-b14b-dcab188b4f77', '42c58800-6fe2-441f-83b7-ee55a203bcf9'),
    ('d59fff3f-c178-4dbc-a4b3-beaf1abb43bf', '39f271ee-2990-44f6-9e0e-88e682063055'),
    ('35de5482-c548-4b0f-8c58-cdd2df99662c', 'a9261b5c-3508-4514-8b44-f0ae40eca101'),
    ('dc586f33-b83a-4114-84b4-e2ffcfa861de', '599d862d-15df-4a70-8150-63e2f63199c7'),
    ('653f1ede-5e4b-4d7f-b674-638263a4a147', '32485a5b-fc94-42c8-996e-a463604d611c'),
    ('ec281d80-1a03-49e7-996b-71bdabfceb0e', '42c58800-6fe2-441f-83b7-ee55a203bcf9'),
    ('8501dc67-e8be-4d79-a578-ef289575aa15', '42c58800-6fe2-441f-83b7-ee55a203bcf9'),
    ('f90f0375-e640-4e48-9fab-11071c9aa465', '32485a5b-fc94-42c8-996e-a463604d611c'),
    ('e09540c4-6e3c-4768-96ce-f7386110d00c', '369d92ca-1b80-4aaa-8ef6-89e21b9d105d')
  ON CONFLICT DO NOTHING;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM item_tags WHERE item_id IN (
    'a05b2b57-4470-4bd9-8f61-c02025022780',
    'f3a23c9f-7f84-4faf-b14b-dcab188b4f77',
    'd59fff3f-c178-4dbc-a4b3-beaf1abb43bf',
    '35de5482-c548-4b0f-8c58-cdd2df99662c',
    'dc586f33-b83a-4114-84b4-e2ffcfa861de',
    '653f1ede-5e4b-4d7f-b674-638263a4a147',
    'ec281d80-1a03-49e7-996b-71bdabfceb0e',
    '8501dc67-e8be-4d79-a578-ef289575aa15',
    'f90f0375-e640-4e48-9fab-11071c9aa465',
    'e09540c4-6e3c-4768-96ce-f7386110d00c',
    );
DELETE FROM items WHERE id IN (
    'a05b2b57-4470-4bd9-8f61-c02025022780',
    'f3a23c9f-7f84-4faf-b14b-dcab188b4f77',
    'd59fff3f-c178-4dbc-a4b3-beaf1abb43bf',
    '35de5482-c548-4b0f-8c58-cdd2df99662c',
    'dc586f33-b83a-4114-84b4-e2ffcfa861de',
    '653f1ede-5e4b-4d7f-b674-638263a4a147',
    'ec281d80-1a03-49e7-996b-71bdabfceb0e',
    '8501dc67-e8be-4d79-a578-ef289575aa15',
    'f90f0375-e640-4e48-9fab-11071c9aa465',
    'e09540c4-6e3c-4768-96ce-f7386110d00c',
    );
-- +goose StatementEnd