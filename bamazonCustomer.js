// import dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table")

// db config
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

// connect to db
connection.connect(function (err) {
  if (err) throw err;
  console.log("You are connected to bamazon!");
  forSale();
});

// query products for sale
function forSale() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// prompt user with two messages
  // pick product by "item_id"
  // pick how many
    // check if amt requested is gt/lt
function start() {
  inquirer.prompt([
    {
      name: "item_id",
      message: "What item would you like to purchase? Please choose by id number."
    },
    {
      name: "purchased",
      message: "How many do you want to buy?"
    }
  ]).then(function (userChoice) {
    connection.query("SELECT * FROM products WHERE item_id = ?", userChoice.item_id, function (err, res) {
      if (err) throw err;

      if (isNaN(userChoice.item_id)) {
        console.log("Please enter a number");
        start();
      } else if (isNaN(userChoice.purchased)){
        console.log("Please enter a number");
        start();
      }
      else if (res[0].stock < userChoice.purchased) {
      console.log("We do not have that many in stock");
        start();
      } else {
        let total = res[0].price * userChoice.purchased;
        let newStock = res[0].stock - userChoice.purchased;
        console.log("Your total will be: " + total);
        connection.query("UPDATE products SET ? WHERE ?", 
          [{
            stock: newStock
          },
          {
            item_id: userChoice.item_id
          }
        ])
        forSale();
      }
    });
  });

}