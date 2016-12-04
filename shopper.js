var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');
var itemSKU;
var amount;
var currentInventory = [];




// prompts user for input 
function promptUser(){
	inquirer.prompt([
	{
		message: "what is the SKU of the item you would like to buy?",
		name: "choice",
		validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
                return false;
        }

	} , {
		message: "How much would you like to buy?",
		name: "quanity",
		validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
                return false;
        }
	} , {
		type: "confirm",
	    message: "Are you done shopping?",
	    name: "confirm",
	    default: false
	}

	]).then(function (answers) {
		//assigns users choices to variables
		itemSKU = answers.choice;
		amount = answers.quanity;
		//console.log(itemSKU);
		//console.log(amount);
		if(currentInventory.indexOf(parseInt(itemSKU)) === -1){
			console.log("hmmm, we dont seem to have a type of product, please enter a correct SKU number");
			printDB();
		}else{
			currentInventory = [];
			//checks current inventory
			connection.query("SELECT * FROM inventory WHERE ?", {SKU : itemSKU},function(err, res) {
				if (err) {
					console.log("that item does not appear in our systems, please try again");
				};
				var stock = res[0].quanity;
				var itemName = res[0].name;
				var charges = amount * parseFloat(res[0].price)
				//console.log(charges)
				var newStock = parseInt(res[0].quanity) - amount;
				//console.log(newStock)
				//console.log(stock)

				if(stock >= amount) {
					if(answers.confirm){
						console.log("end transaction");

						connection.query("UPDATE inventory SET ? WHERE ?", [{
						  quanity: newStock
						}, {
						  SKU: itemSKU
						}], function(err, res) {
							console.log("successfully updated")
						});
						// looks in db and lets user know what they purchased
						//connection.query("SELECT * FROM inventory WHERE ?", {SKU : itemSKU},function(err, res) {
						//if (err) throw err;
						
						console.log("You have purchased " + amount +" units of " + itemName)
						console.log("You have been charged: " + charges);
						console.log("thank you for your purchases");
						//})
						
						dissconnectDB();
					} else {
						console.log("repeat again")
						connection.query("UPDATE inventory SET ? WHERE ?", [{
						  quanity: newStock
						}, {
						  SKU: itemSKU
						}], function(err, res) {
							console.log("successfully updated")
						});
						// looks in db and lets user know what they purchased
						//connection.query("SELECT * FROM inventory WHERE ?", {SKU : itemSKU},function(err, res) {
						//if (err) throw err;
						//var itemName = res[0].name;
						console.log("You have purchased " + amount +" units of " + itemName);
						console.log("You have been charged: " + charges);
						//});
						printDB();
					}
				} else{
					console.log("There is not enough inventory for that purchase");
					printDB();
				}
			});
		}	
	});
}


//connect to database



	var connection = mysql.createConnection({
  		host: "localhost",
  		port: 3306,

  		// Your username
  		user: "root",

  		// Your password
  		password: "",
  		database: "bamazon_db"
	});

	connection.connect(function(err) {
	  	if (err) throw err;
	  	printDB();
	  	//console.log("connected as id " + connection.threadId);
	});



//stop DB connection
function dissconnectDB(){
	connection.end();
}

// print DB
function printDB(){
	connection.query("SELECT * FROM inventory", function(err, res) {
	  	if(err) throw err;

	  	//if no error, print table
		var table = new Table({
		  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
		         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
		         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
		         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
		});
		 
		table.push(
		    ["SKU", "Product Name", "Product Category", "Price", "Quanity"]
		);
		 
		currentInventory = [];
		//console.log(res);
		for (var i = 0; i < res.length; i++) {
		    table.push([res[i].SKU , res[i].name , res[i].department , res[i].price, res[i].quanity]);
		    currentInventory.push(res[i].SKU);
		}
	  //console.log("-----------------------------------");
		

	  console.log(table.toString());
	  //console.log(currentInventory);
	  promptUser();

	});

	
}








