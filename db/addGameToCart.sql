INSERT INTO cart_products (cart_id, game_id, price, quantity, imgurl, name)
values (${cart_id}, ${game_id}, ${price}, ${quantity}, ${imgurl}, ${name});

SELECT *
FROM cart_products;