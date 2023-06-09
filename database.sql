CREATE DATABASE jwttest;
CREATE TYPE role AS ENUM ('admin', 'user', 'partner');
CREATE TYPE sex AS ENUM ('male', 'female', 'other');
CREATE TYPE rate AS ENUM (1,2,3,4,5)


-- users table
-- CREATE TABLE IF NOT EXISTS users(
--     id SERIAL PRIMARY KEY, 
--     name TEXT NOT NULL, 
--     email TEXT UNIQUE NOT NULL, 
--     password TEXT NOT NULL,
--     role role NOT NULL, 
--     nation TEXT,
--     location TEXT,
--     age INT,
--     bio TEXT,
--     rating rating,
--     -- add avatar field, co the set default la avatar default (tinh sau)
--     avatar TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
-- );
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

CREATE TABLE IF NOT EXISTS invitation_rejections(
  id SERIAL PRIMARY KEY,
  invitation_id INTEGER, FOREIGN KEY (invitation_id) REFERENCES invitations(id),
  partner_id INTEGER, FOREIGN KEY (partner_id) REFERENCES users(id),
  rejected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
