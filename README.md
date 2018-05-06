# bamazon
* This is a command line online store simulator 
* It uses a MySQL database to keep track of store items
---
##### There are three modes the application can be run in
1. Customer View
    * Buy items from the store

![Alt Text](gifs/customer.gif)
2. Manager View
    * View all products
    * View products with a low stock quantity
    * Restock items
    * Add new items

![Alt Text](gifs/manager.gif)
3. Supervisor View
    * View profit from each store department
    * Add new departments

![Alt Text](gifs/supervisor.gif)
---
##### To use this project
* Clone the repository
* Run `npm i` in the terminal
* Create a MySQL database called bamazon with the following tables
```
CREATE TABLE `products` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `price` decimal(13,2) NOT NULL,
  `stock_quantity` int(10) NOT NULL,
  `product_sales` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
```
```
CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) DEFAULT NULL,
  `over_head_costs` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
```
* Run `node bamazonCustomer.js`, `node bamazonManager.js` or `node bamazonSupervisor.js` 
---
##### Tools used in this project
* [npm my-sql](https://www.npmjs.com/package/mysql)
* [npm cli-table](https://www.npmjs.com/package/cli-table)
* [npm Inquirer](https://www.npmjs.com/package/inquirer)