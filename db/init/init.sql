-- CREATE TABLE users (
--     id serial primary key,
--     username varchar,
--     email varchar,
--     hash varchar
-- );

-- CREATE TABLE cart (
--     id serial primary key,
--     user_id integer references users
-- );

-- CREATE TABLE cart-products (
--     id serial primary key,
--     cart_id integer references cart,
--     game_id integer,
--     price decimal,
--     quantity integer
-- );