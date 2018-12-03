UPDATE cart_products
SET quantity = ${val}
WHERE id = ${id}
RETURNING *;