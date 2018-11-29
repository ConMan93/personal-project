SELECT *
FROM cart_products
WHERE game_id = ${game_id}
AND cart_id = ${cart_id};