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

-- This table contains the clothing categories.
CREATE TABLE clothing_categories (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

-- Insert clothing categories data.
INSERT INTO clothing_categories (id, name) VALUES
  (1, 'Tops'),
  (2, 'Bottoms'),
  (3, 'Dresses'),
  (4, 'Layers'),
  (5, 'Bags'),
  (6, 'Shoes');

-- This table contains the clothing subcategories.
CREATE TABLE clothing_subcategories (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL
);

-- Insert clothing subcategories data.
INSERT INTO clothing_subcategories (id, name) VALUES
  (1, 'Pants'),
  (2, 'Skirts');

-- This table contains the clothing feature groups, such as "Sleeve", "Neckline" etc.
CREATE TABLE clothing_feature_groups (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

INSERT INTO clothing_feature_groups (id, name) VALUES
  (1, 'Neckline'),
  (2, 'Sleeve');

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

-- Now we need to create a table that contains the clothing categories and their feature groups.
-- This table will be used to determine which feature groups are available for a given clothing category.
-- For example, a top will have a neckline feature group, but a skirt will not. 
CREATE TABLE clothing_categories_feature_groups (
  id SERIAL PRIMARY KEY,
  clothing_category_id INTEGER NOT NULL,
  clothing_subcategory_id INTEGER,
  clothing_feature_group_id INTEGER NOT NULL
);

-- Insert the clothing categories and their feature groups.
INSERT INTO clothing_categories_feature_groups (id, clothing_category_id, clothing_subcategory_id, clothing_feature_group_id) VALUES
  (1, 1, NULL, 1), -- Tops have a neckline feature group.
  (2, 1, NULL, 2); -- Tops have a sleeve feature group.

-- This table contains what features are available for a given body shape.
CREATE TABLE body_shapes_features (
  id SERIAL PRIMARY KEY,
  body_shape_id INTEGER NOT NULL,
  clothing_feature_id INTEGER NOT NULL
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

-- This table contains the users.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  username VARCHAR(255),
  body_shape_id INTEGER
);

-- This table contains the clothing items that belongs to a user.
CREATE TABLE users_clothing_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description VARCHAR(255) NOT NULL,
  image_file_name VARCHAR(255) NOT NULL,
  clothing_category_id INTEGER NOT NULL,
  clothing_subcategory_id INTEGER
);

-- This table contains the features that have been selected for a given clothing item.
CREATE TABLE users_clothing_items_features (
  id SERIAL PRIMARY KEY,
  users_clothing_item_id INTEGER NOT NULL,
  clothing_feature_id INTEGER NOT NULL
);






