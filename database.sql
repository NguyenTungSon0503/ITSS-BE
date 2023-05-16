CREATE DATABASE jwttest;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY, 
    user_name text NOT NULL, 
    user_email text NOT NULL, 
    user_password text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO users (user_name, user_email, user_password) VALUES ('Son', 'sonmeliodas@gmail.com', 'tungsontk3');
INSERT INTO users (user_name, user_email, user_password) VALUES ('Test_Name', 'test@gmail.com', 'test_pass');

SELECT * FROM users;