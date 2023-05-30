CREATE DATABASE jwttest;
CREATE TYPE role AS ENUM ('admin', 'user', 'partner');


CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY, 
    user_name TEXT UNIQUE NOT NULL, 
    user_email TEXT NOT NULL, 
    user_password TEXT NOT NULL,
    user_role role NOT NULL, 
    -- add avatar field, co the set default la avatar default (tinh sau)
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ('Son', 'sonmeliodas@gmail.com', 'tungsontk3','admin');
INSERT INTO users (user_name, user_email, user_password) VALUES ('Test_Name', 'test@gmail.com', 'test_pass');

SELECT * FROM users;