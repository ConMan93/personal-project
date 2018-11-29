DELETE FROM cart_products
WHERE id = ${id};

-- SELECT *
-- FROM cart_products cp
-- join cart c on cp.cart_id = c.id
-- WHERE c.user_id = ${id};