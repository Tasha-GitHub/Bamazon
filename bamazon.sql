CREATE DATABASE bamazon_db;

USE bamazon_db;
CREATE TABLE inventory (
SKU INTEGER(11) AUTO_INCREMENT NOT NULL,
name VARCHAR(100) NOT NULL,
department VARCHAR(100) NOT NULL, 
price DECIMAL(10,2) NOT NULL, -- change to decimals
quanity INTEGER(11)NOT NULL,
PRIMARY KEY(SKU)
)

USE bamazon_db;
INSERT INTO inventory(name, department, price, quanity)
VALUES ("Ice cream","Dairy",1.99, 10),
("coffee","coffee",2.99, 30),
("Towels","Bathroom",3.00, 5),("popcorn","snacks",1.99, 30),
("eggs","misc",5.00, 30),
("snickers","candy",5.00, 5);



