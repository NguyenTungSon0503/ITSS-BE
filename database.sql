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
description TEXT,
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

CREATE TABLE IF NOT EXISTS recommendation(
id SERIAL PRIMARY KEY,
invitation_id INTEGER, FOREIGN KEY (invitation_id) REFERENCES invitations(id),
recommendation_sender_id INTEGER, FOREIGN KEY (partner_id) REFERENCES users(id),
meal_price NUMERIC NOT NULL,
description TEXT, 
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
)
	
CREATE TABLE IF NOT EXISTS contracts(
id SERIAL PRIMARY KEY,
recommendation_id INTEGER, FOREIGN KEY (recommendation_id) REFERENCES recommendation(id),
invitation_sender_rating NUMERIC NOT NULL,
recommendation_sender_rating NUMERIC NOT NULL,
invitation_sender_cmt TEXT,
recommendation_sender_cmt TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
)





--update RecommentStar
create trigger updateRecommentStar after INSERT on contracts
for each row
execute procedure updateRecommentStar();

create or replace function updateRecommentStar() returns trigger
as $$
BEGIN
update users
set rating = (select sum(b3.recommendation_sender_rating)/count(b3.recommendation_sender_rating) from users a1,
(select b2.recommendation_sender_id, b1.recommendation_sender_rating from recommendation b2,
(select * from contracts where recommendation_id = new.recommendation_id ) b1 where b1.recommendation_id = b2.id) b3
where a1.id = b3.recommendation_sender_id);

RETURN NEW;
END;
$$ 
LANGUAGE plpgsql;


--update InvitationStar		
create trigger updateInvitationStar after INSERT on contracts
for each row
execute procedure updateInvitationStar();

create or replace function updateInvitationStar() returns trigger
as $example_table$
BEGIN
update users
set 
rating = (select sum(b3.invitation_sender_rating)/count(b3.invitation_sender_rating) from users a1,
(select b2.invitation_sender_id , b1.invitation_sender_rating from invitation b2,
(select * from contracts where recommendation_id = new.recommendation_id ) b1 where b1.recommendation_id = b2.id) b3
where a1.id = b3.invitation_sender_id);
RETURN NEW;
END;
$example_table$ LANGUAGE plpgsql;