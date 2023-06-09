CREATE DATABASE jwttest;
CREATE TYPE role AS ENUM ('admin', 'user', 'partner');
CREATE TYPE sex AS ENUM ('male', 'female', 'other');
CREATE TYPE rate AS ENUM ('1','2','3','4','5');


-- users table
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY, 
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL,
    role role NOT NULL, 
    name TEXT, 
    nation TEXT,
    location TEXT,
    sex sex,
    age INT,
    bio TEXT,
    rating rate,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- CREATE TABLE IF NOT EXISTS users(
--     id SERIAL PRIMARY KEY, 
--     user_name TEXT NOT NULL, 
--     user_email TEXT UNIQUE NOT NULL, 
--     user_password TEXT NOT NULL,
--     user_role role NOT NULL, 
--     -- add avatar field, co the set default la avatar default (tinh sau)
--     avatar TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
-- );

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
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--reject table
CREATE TABLE IF NOT EXISTS invitation_rejections(
  id SERIAL PRIMARY KEY,
  invitation_id INTEGER, FOREIGN KEY (invitation_id) REFERENCES invitations(id),
  partner_id INTEGER, FOREIGN KEY (partner_id) REFERENCES users(id),
  rejected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

---updated_at trigger on users
create trigger updateTime after INSERT OR UPDATE on users
for each row
WHEN (pg_trigger_depth() = 0)
execute procedure updateTime();

create or replace function updateTime() returns trigger
as $example_table$
BEGIN
update users
set 
updated_at = CURRENT_TIMESTAMP where id = new.id;
RETURN NEW;
END;
$example_table$ LANGUAGE plpgsql;