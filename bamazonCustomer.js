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

    showItems()
});


function showItems() {
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

            inquirer.prompt([
                {
                    message: 'Enter the ID of the item you would like to buy.',
                    type: 'input',
                    name: 'item_choice'
                },
                {
                    message: 'How many would you like to buy?',
                    type: 'input',
                    name: 'quantity_choice'
                }
            ]).then(function (answer) {  
                checkQuantity(answer.item_choice, answer.quantity_choice);
            })
        }
    )
}

function checkQuantity(item, quantity) {  
    var query = connection.query(
        'SELECT * FROM products WHERE item_id=?', [item],
        (err, res) => {  
            if(res[0].stock_quantity < quantity) console.log('Insufficient Quantity.\n')
            else {
                var query = connection.query(
                    'UPDATE products SET ? WHERE ? ', 
                    [
                        {
                            stock_quantity: res[0].stock_quantity - quantity,
                            product_sales: res[0].product_sales += parseFloat(res[0].price * quantity).toFixed(2)
                        },
                        {
                            item_id: item   
                        }
                    ],
                    (err, result) => {  
                        console.log('Total cost of purchase: $' + parseFloat(res[0].price * quantity).toFixed(2))
                    }
                )
            }
        }
    )
}