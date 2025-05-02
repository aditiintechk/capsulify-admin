CREATE TABLE body_shapes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE clothing_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE clothing_item_body_shapes (
  clothing_item_id INTEGER NOT NULL,
  body_shape_id INTEGER NOT NULL,
  PRIMARY KEY (clothing_item_id, body_shape_id)
);

CREATE TABLE clothing_items (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  image_file_name VARCHAR(255),
  clothing_category_id INTEGER
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  username VARCHAR(255),
  body_shape_id INTEGER
);

CREATE TABLE users_clothing_items (
  user_id INTEGER NOT NULL,
  clothing_item_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, clothing_item_id)
);
