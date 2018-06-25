DROP TABLE IF EXISTS child_node;
DROP TABLE IF EXISTS factory_node;

CREATE TABLE factory_node(
  id INT AUTO_INCREMENT NOT NULL,
  node_name VARCHAR(100) NOT NULL,
  min INT NOT NULL,
  max INT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE child_node(
  id INT AUTO_INCREMENT NOT NULL,
  factory INT NOT NULL,
  node_value INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (factory) REFERENCES factory_node(id) ON DELETE CASCADE
);

INSERT INTO factory_node (node_name, min, max)
VALUES ("First Factory", 10, 50),
       ("Second Factory", 3, 30);

INSERT INTO child_node (factory, node_value)
VALUES (1, 10),
       (1, 20),
       (1, 30),
       (1, 40),
       (1, 50),
       (2, 9),
       (2, 18),
       (2, 27);
