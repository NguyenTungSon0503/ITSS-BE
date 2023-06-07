CREATE DATABASE jwttest;
CREATE TYPE role AS ENUM ('admin', 'user', 'partner');
CREATE TYPE sex AS ENUM ('male', 'female', 'other');


-- users table
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY, 
    user_name TEXT NOT NULL, 
    user_email TEXT UNIQUE NOT NULL, 
    user_password TEXT NOT NULL,
    user_role role NOT NULL, 
    -- add avatar field, co the set default la avatar default (tinh sau)
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- offers table
CREATE TABLE IF NOT EXISTS invitations(
id SERIAL PRIMARY KEY,
invitation_sender_id INTEGER NOT NULL,
FOREIGN KEY (invitation_sender_id) REFERENCES users(id),
start_time TEXT NOT NULL,
end_time TEXT NOT NULL,
date TIMESTAMP NOT NULL,
sex sex NOT NULL,
age INTEGER NOT NULL,
location TEXT NOT NULL,
meal_price_range NUMERIC NOT NULL,
description TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);


INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ('Son', 'sonmeliodas@gmail.com', 'tungsontk3','admin');
INSERT INTO users (user_name, user_email, user_password) VALUES ('Test_Name', 'test@gmail.com', 'test_pass');

SELECT * FROM users;