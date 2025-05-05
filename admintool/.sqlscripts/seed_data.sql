

INSERT INTO clothing_items (id, description, image_file_name, clothing_category_id) VALUES
  (2, 'Long Sleeve Top', 'Test.png', 1),
  (3, 'Long Skirt', 'test.png', 2),
  (4, 'Short Skirt', 'testing.png', 2),
  (5, 'Medium Skirt', 'test.png', 2),
  (6, 'Medium Top', 'test.png', 1),
  (7, 'Short Top', 'test.png', 1),
  (8, 'Long Dress', 'test.png', 3),
  (9, 'Medium Dress', 'test.png', 3),
  (10, 'Short Dress', 'test.png', 3),
  (11, 'Cozy Jacket', 'test.png', 4),
  (12, 'Shirt Jacket', 'test.png', 4),
  (13, 'Wooley Jacket', 'testing.png', 4),
  (14, 'Small Bag', 'test.png', 5),
  (15, 'Medium Bag', 'test.png', 5),
  (17, 'Large Bag', 'test.png', 5),
  (18, 'Flat Shoes', 'test.png', 6),
  (19, 'Casual Shoe', 'test.png', 6),
  (20, 'High Heels', 'test.png', 6);

INSERT INTO clothing_item_body_shapes (clothing_item_id, body_shape_id) VALUES
  (3, 1), (3, 2), (3, 3),
  (4, 4), (4, 5),
  (5, 1), (5, 2), (5, 3), (5, 4), (5, 5),
  (6, 1), (6, 2), (6, 3), (6, 4), (6, 5),
  (7, 1), (7, 2), (7, 3), (7, 4), (7, 5),
  (8, 1), (8, 2), (8, 3), (8, 4), (8, 5),
  (9, 1), (9, 2), (9, 3), (9, 4), (9, 5),
  (10, 1), (10, 2), (10, 3), (10, 4), (10, 5),
  (11, 1), (11, 2), (11, 3), (11, 4), (11, 5),
  (12, 1), (12, 2), (12, 3), (12, 4), (12, 5),
  (13, 1), (13, 2), (13, 3), (13, 4), (13, 5),
  (14, 1), (14, 2), (14, 3), (14, 4), (14, 5),
  (15, 1), (15, 2), (15, 3), (15, 4), (15, 5),
  (16, 1), (16, 2), (16, 3), (16, 4), (16, 5),
  (17, 1), (17, 2), (17, 3), (17, 4), (17, 5),
  (18, 1), (18, 2), (18, 3), (18, 4), (18, 5),
  (19, 1), (19, 2), (19, 3), (19, 4), (19, 5),
  (20, 1), (20, 2), (20, 3), (20, 4), (20, 5);

INSERT INTO users (id, email, username, body_shape_id) VALUES
  (1, 'test@test.com', 'martin1', 3);

INSERT INTO users_clothing_items (user_id, clothing_item_id) VALUES
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),
  (1, 8),
  (1, 9),
  (1, 10),
  (1, 11),
  (1, 12),
  (1, 13),
  (1, 14),
  (1, 15),
  (1, 17),
  (1, 18),
  (1, 19),
  (1, 20);