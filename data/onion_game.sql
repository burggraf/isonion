CREATE TABLE onion_game (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid uuid REFERENCES auth.users,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    game_name text NULL
);