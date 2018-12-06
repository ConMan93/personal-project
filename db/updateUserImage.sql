UPDATE users
SET profileimage = ${uploadedImage}
WHERE id = ${id}
RETURNING profileimage;