CREATE TABLE onion_game_data (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    gameid uuid REFERENCES onion_game,
    itemid uuid REFERENCES onion,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    correct INTEGER
);