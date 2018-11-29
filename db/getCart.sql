SELECT cp.*
FROM cart_products cp
join cart c on cp.cart_id = c.id
WHERE c.user_id = $1;