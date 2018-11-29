UPDATE cart_products
SET quantity = quantity + ${val}
WHERE id = ${id}
RETURNING *;