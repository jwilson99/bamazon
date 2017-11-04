// includes NPMs mysql, inquirer, and cli-table2
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

// uses cli-table2 to create a table
var table = new Table({
    chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
        , 'right': '║', 'right-mid': '╢', 'middle': '│'
    }
});

// connects to the bamazon database using mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\nWelcome to Bamazon! Browse our products, and place an order below!\n");
    runPrompt();
});

// when the app is run, user is prompted
function runPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose an option:",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "option"
        }
    ]).then(function (response) {
        var userOption = response.option;
        //insert switch case here

        switch (userOption) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            default:
                console.log("H-how did you choose something that wasn't an option?");
        }
    });
}


function viewProducts() {
// If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        table.push(
            ["Product ID", "Product Name", "Price/Unit ($)", "Units Remaining"]
        );

        // displays data from the products table in the bamazon database
        var productInformation = [];

        for (var i = 0; i < res.length; i++) {

            productInformation = [];

            productInformation.push(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);

            table.push(productInformation);
        }
        console.log(table.toString());
    });
    connection.end();
}

function lowInventory() {
// If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        table.push(
            ["Product ID", "Product Name", "Price/Unit ($)", "Units Remaining"]
        );

        // displays data from the products table in the bamazon database
        var productInformation = [];

        for (var i = 0; i < res.length; i++) {

            if (res[i].stock_quantity < 5) {
                productInformation = [];

                productInformation.push(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);

                table.push(productInformation);
            }
        }
        console.log(table.toString());
    });
    connection.end();
}

function addInventory() {
// If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        table.push(
            ["Product ID", "Product Name", "Price/Unit ($)", "Units Remaining"]
        );

        // displays data from the products table in the bamazon database
        var productInformation = [];

        for (var i = 0; i < res.length; i++) {

            productInformation = [];

            productInformation.push(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);

            table.push(productInformation);
        }
        console.log(table.toString());
        inquirer.prompt([
            {
                type: "input",
                message: "Please, input the item ID of the product to update.",
                name: "product"
            },
            {
                type: "input",
                message: "How many units would you like to add?",
                name: "units"
            }
        ]).then(function(response){
            var ID = response.product;
            var units = response.units;

            connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?', [units, ID], function (error, results) {
                if (error) throw error;
                console.log("Product updated");
                connection.end();
            });
        });
    });
}

function addProduct() {
// If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
    inquirer.prompt([
        {
            type: "input",
            message: "Input the name of the product you wish to add",
            name: "product"
        },
        {
            type: "input",
            message: "Please, input the name of the department associated with this product.",
            name: "department"
        },
        {
            type: "input",
            message: "Please, input an integer or decimal price for this product.",
            name: "price"
        },
        {
            type: "input",
            message: "Please, input the amount of product being added to the inventory.",
            name: "quantity"
        }
    ]).then(function(response){
        var name = response.product;
        var department = response.department;
        var price = response.price;
        var quantity = response.quantity;

        connection.query('INSERT INTO products(product_name,department_name,price,stock_quantity) VAlUES(?,?,?,?)',[name,department,price,quantity],function(error,results){
            if (error) throw error;
            console.log("Product added");
            connection.end();
        })
    })
}