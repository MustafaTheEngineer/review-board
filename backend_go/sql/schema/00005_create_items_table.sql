-- +goose Up
-- +goose StatementBegin
CREATE TABLE items (
    id UUID PRIMARY KEY,
    creator_id UUID NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    status item_status NOT NULL DEFAULT 'NEW',

    deleted_by_user_id UUID,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (deleted_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE (title, creator_id)
);

-- Create a trigger to call the function
CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate risk score based on amount
CREATE OR REPLACE FUNCTION calculate_risk_score(amount_value NUMERIC)
RETURNS INTEGER AS $$
BEGIN
    -- Simple rule engine for risk scoring based on amount
    -- Low risk: 0-100 (score: 10)
    -- Medium risk: 100-1000 (score: 30)
    -- High risk: 1000-10000 (score: 60)
    -- Very high risk: 10000+ (score: 90)
    
    IF amount_value < 100 THEN
        RETURN 10;
    ELSIF amount_value < 1000 THEN
        RETURN 30;
    ELSIF amount_value < 10000 THEN
        RETURN 60;
    ELSE
        RETURN 90;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger to automatically calculate risk score on insert/update
CREATE OR REPLACE FUNCTION update_risk_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.risk_score := calculate_risk_score(NEW.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_items_risk_score
BEFORE INSERT OR UPDATE OF amount ON items
FOR EACH ROW
EXECUTE FUNCTION update_risk_score();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS calculate_items_risk_score ON items;
DROP FUNCTION IF EXISTS update_risk_score();
DROP FUNCTION IF EXISTS calculate_risk_score(NUMERIC);
DROP TRIGGER IF EXISTS update_items_updated_at ON items;
DROP TABLE IF EXISTS items;
-- +goose StatementEnd
