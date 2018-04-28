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
            choices: ['View Product Sales by Departmemt', 'Create New Department'],
            name: 'choice'
        }
    ]).then(function (answer) {  
        if(answer.choice == 'View Product Sales by Departmemt') viewProductSales(0)
        else createDepartment()
    })
}

function viewProductSales() {
    var query = connection.query(
        'SELECT * FROM products INNER JOIN departments ON products.department_name = departments.department_name ORDER BY products.department_name',
        function (err, res) { 
            var head = [];

            var table = new Table({
                head: ['ID', 'Department', 'Product', 'Overhead Costs', 'Product Sales', 'Total Profit']
              , colWidths: [5, 15, 25, 20, 15, 15]
            });

            for(var i = 0; i < res.length; i++) {
                console.log(res[i])
                table.push([res[i].department_id, res[i].department_name, res[i].product_name, '$'+parseFloat(res[i].over_head_costs).toFixed(2), '$'+parseFloat(res[i].product_sales).toFixed(2), '$'+parseFloat(parseFloat(res[i].product_sales).toFixed(2) - res[i].over_head_costs).toFixed(2)])
            }

            console.log(table.toString()) 
            
            mainPrompt()
        }
    )
}

function createDepartment() {  
    inquirer.prompt([
        {
            message: 'Enter the name of the department to add.',
            type: 'input',
            name: 'name'
        },
        {
            message: 'Enter overhead cost of department',
            type: 'input',
            name: 'overhead'
        }
    ]).then((answer) => {
        var query = connection.query(
            'INSERT INTO departments SET ?', 
            {
                department_name: answer.name,
                over_head_costs: answer.overhead
            },
            (err, res) => {
                console.log(res.affectedRows + ' departments added.')
                mainPrompt()
            }
        )
    })
}