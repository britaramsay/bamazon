//   * List a set of menu options:
const mysql = require('mysql'),
      connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'bamazon'
      }),
      inquirer = require('inquirer'),
      Table = require('cli-table')


connection.connect( err => {
    if(err) throw err
    console.log('Connected as id ' + connection.threadId)

    mainPrompt()
});

function mainPrompt() {  
    inquirer.prompt([
        {
            message: 'What do you want to do?.',
            type: 'rawlist',
            choices: ['View Inventory', 'View low stock items', 'Add to item stock', 'Add a new item'],
            name: 'choice'
        }
    ]).then(function (answer) {  
        if(answer.choice == 'View Inventory') showItems(0)
        else if(answer.choice == 'View low stock items') viewLowInventory()
        else if(answer.choice == 'Add to item stock') showItems(1)
        else addNewProduct()
    })
}

function showItems(type) {
    var query = connection.query(
        'SELECT * FROM products',
        function (err, res) { 
            var head = [];

            var table = new Table({
                head: ['ID', 'Product', 'Department', 'Price', 'Quantity']
              , colWidths: [5, 25, 15, 10, 10]
            });

            for(var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity])
            }

            console.log(table.toString()) 
            
            if(type == 1) {
                inquirer.prompt([
                    {
                        message: 'Enter the ID of the item you would add mmore.',
                        type: 'input',
                        name: 'item_choice'
                    },
                    {
                        message: 'How many would you like to add?',
                        type: 'input',
                        name: 'quantity_choice'
                    }
                ]).then(function (answer) {  
                    increaseQuantity(answer.item_choice, answer.quantity_choice);
                })
            }
            else mainPrompt()
        }
    )
}

function viewLowInventory() {  
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 5',
        (err, res) => {
            var head = [];

            var table = new Table({
                head: ['ID', 'Product', 'Department', 'Price', 'Quantity']
              , colWidths: [5, 25, 15, 10, 10]
            });

            for(var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
            }

            console.log(table.toString())   
            mainPrompt()
        }
    )
}
  
function increaseQuantity(item, quantity) {  
    var query = connection.query(
        'SELECT * FROM products WHERE item_id=?', [item],
        (err, res) => {  
            var query = connection.query(
                'UPDATE products SET ? WHERE ? ', 
                [
                    {
                        stock_quantity: res[0].stock_quantity + parseInt(quantity)
                    },
                    {
                        item_id: item   
                    }
                ],
                (err, result) => {  
                    console.log('Value of items added: $' + parseFloat(res[0].price * quantity).toFixed(2))
                    mainPrompt()
                }
            )
        }
    )
}

function addNewProduct() {  
    inquirer.prompt([
        {
            message: 'Enter the name of the product to add.',
            type: 'input',
            name: 'name'
        },
        {
            message: 'Enter the deparment of the product to add.',
            type: 'input',
            name: 'department'
        },
        {
            message: 'Enter the price of the product to add.',
            type: 'input',
            name: 'price'
        },
        {
            message: 'Enter the quantity of the product to add.',
            type: 'input',
            name: 'quantity'
        }
    ]).then((answers) => {  
        var query = connection.query(
            'INSERT INTO products SET ?',
            {
                product_name: answers.name,
                department_name: answers.department,
                price: answers.price,
                stock_quantity: answers.quantity
            },
            (err, res) => {
                if(!err)
                    console.log('Items Added.\n')
                mainPrompt()
            }
        )
    })
}
//   * Add to Inventory
  
//   * Add New Product

// * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

// * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
