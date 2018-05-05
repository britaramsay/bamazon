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
            type: 'list',
            choices: [
                {name: 'View Product Sales by Departmemt', value: viewProductSales},
                {name: 'Create New Department', value: createDepartment}
            ],
            name: 'choice'
        }
    ]).then(function (answer) {  
        answer.choice()
        // if(answer.choice == 'View Product Sales by Departmemt') viewProductSales(0)
        // else createDepartment()
    })
}

function viewProductSales() {
    var query = connection.query(

        'SELECT departments.department_id, departments.department_name, SUM(over_head_costs) AS overhead, SUM(product_sales) AS sales FROM products RIGHT JOIN departments ON departments.department_name = products.department_name GROUP BY products.department_name',
        function (err, res) { 
            var head = [],
                totalOverhead = [],
                totalSales = []

            var table = new Table({
                head: ['ID', 'Department', 'Overhead Costs', 'Product Sales', 'Total Profit']
              , colWidths: [5, 15, 25, 20, 15]
            });

            for(var i = 0; i < res.length; i++) {
                var sales;
                if(res[i].sales == null) {
                    res[i].sales = 0;
                    // console.log(res[i].sales)
                }
                table.push([res[i].department_id, res[i].department_name, res[i].overhead, res[i].sales, res[i].sales - res[i].overhead])
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