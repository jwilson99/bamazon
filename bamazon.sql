CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price decimal(10,4) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Socks","Clothing",5,20);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Blender","Appliances",50,10);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Shirt","Clothing",20,20);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Couch","Furniture",500,5);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Chair","Furniture",75,7);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Chopsticks","Kitchenware",5,30);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Dog Toy","Pet",5,15);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Cat Bed","Pet",15,8);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Toaster","Appliances",30,12);
INSERT INTO products(product_name,department_name,price,stock_quantity)
Values("Flower Pot","Garden",5,25);

SELECT * FROM products;