// includes mysql, inquirer, and cli-table2 NPMs
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
    afterConnection();
});

// after establishing mysql connection, product table information is requested and displayed using cli.table2
function afterConnection() {
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
        purchase(res);
    });
}

// prompts the user to provide an item ID and a quantity to make a purchase
function purchase(firstResponse) {
    inquirer.prompt([
        {
            type: "input",
            message: "Please input the Product ID of the item you would like to purchase.",
            name: "purchaseID"
        },
        {
            type: "input",
            message: "How many units would you like to purchase?",
            name: "numberOfUnits"
        }
    ]).then(function (response) {
        var ID = response.purchaseID;
        var units = response.numberOfUnits;

        connection.query("SELECT stock_quantity FROM products WHERE item_id=" + ID, function (err, res) {
            if (err) throw err;

            // checks to see if there is sufficient stock to fulfill the request
            if(units <= res[0].stock_quantity){

                var newStock = res[0].stock_quantity - units;
                var price = firstResponse[(ID - 1)].price;

                updateStock(newStock,ID,price,units);
            }
            // shows if there is not enough product in stock to make a sale
            else{
                console.log("Insufficient quantity!");
                connection.end();
            }
        });
    })
}

// updates the stock of the item in the bamazon database and gives the user a total based on the price and number of the item of interest
function updateStock(newStock,ID, price, units){
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [newStock, ID], function (error, results) {
        if (error) throw error;
        var userTotal = price * units;
        console.log("Total due: $" + userTotal);
        connection.end();
    });
}