-- Drop sequence for body_shapes
DROP SEQUENCE IF EXISTS body_shapes_id_seq CASCADE;

-- This table contains the body shapes.
CREATE TABLE body_shapes (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert body shapes data.
INSERT INTO body_shapes (id, name) VALUES
  (1, 'Inverted Triangle'),
  (2, 'Rectangle'),
  (3, 'Apple'),
  (4, 'Pear'),
  (5, 'Hourglass');

-- Drop sequence for clothing_categories
DROP SEQUENCE IF EXISTS clothing_categories_id_seq CASCADE;

-- This table contains the clothing categories.
CREATE TABLE clothing_categories (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER DEFAULT NULL,
  "name" VARCHAR(50) NOT NULL
);

-- Insert clothing categories data.
INSERT INTO clothing_categories (id, parent_id,name) VALUES
  (1, NULL, 'Tops'),
  (2, NULL, 'Bottoms'),
  (3, NULL, 'Dresses'),
  (4, NULL, 'Layers'),
  (5, NULL, 'Bags'),
  (6, NULL, 'Shoes'),
  (7, 1, 'Pants'),
  (8, 1, 'Skirts');

-- Drop sequence for clothing_feature_groups
DROP SEQUENCE IF EXISTS clothing_feature_groups_id_seq CASCADE;

-- This table contains the clothing feature groups, such as "Sleeve", "Neckline" etc.
CREATE TABLE clothing_feature_groups (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

INSERT INTO clothing_feature_groups (id, name) VALUES
  (1, 'Neckline'),
  (2, 'Sleeve');

-- Drop sequence for clothing_features
DROP SEQUENCE IF EXISTS clothing_features_id_seq CASCADE;

-- This table contains the clothing features, such as "Long", "Short" etc.
CREATE TABLE clothing_features (
  id SERIAL PRIMARY KEY,
  clothing_feature_group_id INTEGER NOT NULL,
  "name" VARCHAR(50) NOT NULL
);

-- Insert clothing features data.
INSERT INTO clothing_features (id, clothing_feature_group_id, name) VALUES
  -- Neckline features.
  (1, 1, 'Asymmetrical / One-Shoulder'),
  (2, 1, 'Boat / Bateau'),
  (3, 1, 'Cowl'),
  (4, 1, 'Deep V'),
  (5, 1, 'Gathered / Ruched'),
  (6, 1, 'Narrow V'),
  (7, 1, 'Off-Shoulder / Bardot'),
  (8, 1, 'Open-collared Blouse'),
  (9, 1, 'Open-collared Shirt'),
  (10, 1, 'Plunging'),
  (11, 1, 'Scoop'),
  (12, 1, 'Soft Cowl'),
  (13, 1, 'Square'),
  (14, 1, 'Sweetheart'),
  (15, 1, 'V / Wrap / Surplice'),
  (16, 1, 'Wide V'),
  -- Sleeve features.
  (17, 2, 'Sleeveless'),
  (18, 2, 'Normal'),
  (19, 2, 'Elbow'),
  (20, 2, 'Three-Quarter'),
  (21, 2, 'Full');

-- An entry in this table indicates that a clothing category has a feature group.
CREATE TABLE clothing_categories_feature_groups (
  clothing_category_id INTEGER NOT NULL,
  clothing_feature_group_id INTEGER NOT NULL,
  PRIMARY KEY (clothing_category_id, clothing_feature_group_id)
);

-- Insert the clothing categories and their feature groups.
INSERT INTO clothing_categories_feature_groups (clothing_category_id, clothing_feature_group_id) VALUES
  (1, 1), -- Tops -> Neckline.
  (1, 2); -- Tops -> Sleeve.

-- This table contains what features are available for a given body shape.
CREATE TABLE body_shapes_features (
  body_shape_id INTEGER NOT NULL,
  clothing_feature_id INTEGER NOT NULL,
  PRIMARY KEY (body_shape_id, clothing_feature_id)
);

-- Insert the body shapes and their features.
INSERT INTO body_shapes_features (body_shape_id, clothing_feature_id) VALUES
  -- Inverted Triangle tops.
  (1, 15), -- Inverted Triangle has 'V / Wrap / Surplice' neckline feature.
  (1, 4), -- Inverted Triangle has 'Deep V' neckline feature.
  (1, 11), -- Inverted Triangle has 'Scoop' neckline feature.
  (1, 14), -- Inverted Triangle has 'Sweetheart' neckline feature.
  (1, 3), -- Inverted Triangle has 'Cowl' neckline feature.
  (1, 1), -- Inverted Triangle has 'Asymmetrical / One-Shoulder' neckline feature.
  -- Inverted Triangle sleeves.
  (1, 17), -- Inverted Triangle has 'Sleeveless' sleeve feature.
  (1, 18), -- Inverted Triangle has 'Normal' sleeve feature.
  (1, 19), -- Inverted Triangle has 'Elbow' sleeve feature.
  (1, 20), -- Inverted Triangle has 'Three-Quarter' sleeve feature.
  (1, 21), -- Inverted Triangle has 'Full' sleeve feature.

  -- Rectangle top necklines.
  (2, 14), -- Sweetheart
  (2, 1), -- Asymmetrical / One-Shoulder
  (2, 15), -- V / Wrap / Surplice
  (2, 7), -- Off-Shoulder / Bardot
  (2, 3), -- Cowl
  (2, 13), -- Square
  (2, 11), -- Scoop,
  -- Rectangle top sleeves.
  (2, 17), -- Sleeveless
  (2, 18), -- Normal
  (2, 19), -- Elbow
  (2, 20), -- Three-Quarter
  (2, 21), -- Full

  -- Pear top necklines.
  (3, 2), -- Boat / Bateau
  (3, 7), -- Off-Shoulder / Bardot
  (3, 13), -- Square
  (3, 3), -- Cowl
  (3, 14), -- Sweetheart
  (3, 16), -- Wide V
  (3, 1), -- Asymmetrical / One-Shoulder
  (3, 5), -- Gathered / Ruched
  -- Pear top sleeves.
  (3, 17), -- Sleeveless
  (3, 18), -- Normal
  (3, 19), -- Elbow
  (3, 20), -- Three-Quarter
  (3, 21), -- Full

  -- Apple top necklines.
  (4, 15), -- V / Wrap / Surplice
  (4, 4), -- Deep V
  (4, 6), -- Narrow V
  (4, 11), -- Scoop
  (4, 14), -- Sweetheart
  (4, 1), -- Asymmetrical / One-Shoulder
  (4, 12), -- Soft Cowl
  (4, 8), -- Open-collared Blouse
  (4, 9), -- Open-collared Shirt
  (4, 10), -- Plunging
  -- Apple top sleeves.
  (4, 17), -- Sleeveless
  (4, 18), -- Normal
  (4, 19), -- Elbow
  (4, 20), -- Three-Quarter
  (4, 21), -- Full

  -- Hourglass top necklines.
  (5, 15), -- V / Wrap / Surplice
  (5, 14), -- Sweetheart
  (5, 11), -- Scoop
  (5, 7), -- Off-Shoulder / Bardot
  (5, 1), -- Asymmetrical / One-Shoulder
  (5, 3), -- Cowl
  -- Hourglass top sleeves.
  (5, 17), -- Sleeveless
  (5, 18), -- Normal
  (5, 19), -- Elbow
  (5, 20), -- Three-Quarter
  (5, 21); -- Full

----------------------------------------------------------------------------------------------------------------
-- User data.
----------------------------------------------------------------------------------------------------------------

-- Drop sequence for users
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;

-- This table contains the users.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  username VARCHAR(255),
  body_shape_id INTEGER
);

-- Drop sequence for users_clothing_items
DROP SEQUENCE IF EXISTS users_clothing_items_id_seq CASCADE;

-- This table contains the clothing items that belongs to a user.
CREATE TABLE users_clothing_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description VARCHAR(255) NOT NULL,
  image_file_name VARCHAR(255) NOT NULL,
  clothing_category_id INTEGER NOT NULL
);

-- This table contains the features that have been selected for a given clothing item.
CREATE TABLE users_clothing_items_features (
  users_clothing_item_id INTEGER NOT NULL,
  clothing_feature_id INTEGER NOT NULL,
  PRIMARY KEY (users_clothing_item_id, clothing_feature_id)
);

-- Reset sequences for all tables
SELECT setval('body_shapes_id_seq', (SELECT MAX(id) FROM body_shapes));
SELECT setval('clothing_categories_id_seq', (SELECT MAX(id) FROM clothing_categories));
SELECT setval('clothing_feature_groups_id_seq', (SELECT MAX(id) FROM clothing_feature_groups));
SELECT setval('clothing_features_id_seq', (SELECT MAX(id) FROM clothing_features));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('users_clothing_items_id_seq', (SELECT MAX(id) FROM users_clothing_items));






