CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(28) NOT NULL UNIQUE,
        passHash VARCHAR NOT NULL
);

insert into users (username,passHash) value ($1,$2);