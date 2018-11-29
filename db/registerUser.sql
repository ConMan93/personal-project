INSERT INTO users (username, email, hash)
values (${username}, ${email}, ${hash})
RETURNING *;
