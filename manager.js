//----------------------------------------------------------//
//              required variables                          //
//----------------------------------------------------------//

var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');


//----------------------------------------------------------//
//              prompts user for input                      //
//----------------------------------------------------------//



// prompts user for input 
function promptUser(){
	inquirer.prompt([
		{ 	type: "list",
			message: "what action would you like to take?",
			choices: ["Add Inventory", "Remove Item", "Replenish Stock", "View Products for Sale", "View Low Inventory", "Quit"],
			name: "userChoice"
		}

	]).then(function (answers) {
		console.log(answers.userChoice);

		switch(answers.userChoice) {
	    case "Add Inventory":
	        printDB(addInventory);
	        break;
	    case "Remove Item":
	   		printDB();
	       	
	        break;
	    case "Replenish Stock"://done
	    	printDB(replenishStock);
	        
	        break;
	    case "View Products for Sale": //done
	   		console.log("Here are all the available products for sale.");
	   		printDB(promptUser);
	        
	        break;
	    case "Quit": //done
	        dissconnectDB();
	        break; 

	    case "View Low Inventory":
	        printDB();
	        break;       
	    default: //done
	        console.log("I have never heard of that command...Please try again");
		}
	});

}

//----------------------------------------------------------//
//              connect to database                         //
//----------------------------------------------------------//

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
	  	console.log("Welcome to the Manager Portal");
	  	promptUser();
	});

//----------------------------------------------------------//
//              stop database function                      //
//----------------------------------------------------------//

//stop DB connection
function dissconnectDB(){
	connection.end();
	console.log("Your connection has been terminated. Have a nice day!")
}

//----------------------------------------------------------//
//               print table  function                      //
//----------------------------------------------------------//

// print table 
function printDB(funct){
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
		

	  console.log(table.toString());
	  //return true;
	  //console.log(currentInventory);
	  //only runs if a function is put in it
	  if (funct){
	  	funct();
	  }

	});

	
}

//----------------------------------------------------------//
//              Replenish stock function                    //
//----------------------------------------------------------//

function replenishStock(){
	inquirer.prompt([
		{
		message: "what is the SKU of the item you would like to restock?",
		name: "choice",
		validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
                return false;
        }

	} , {
		message: "How much would you like to stock?",
		name: "quanity",
		validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
                return false;
        }
	} , {
		type: "confirm",
	    message: "Are you done stocking?",
	    name: "confirm",
	    default: false
	}

	]).then(function (answers) {
		itemSKU = answers.choice;
		amount = answers.quanity;
		if(currentInventory.indexOf(parseInt(itemSKU)) === -1){
			console.log("hmmm, we dont seem to have a type of product, please enter a correct SKU number");
			printDB(replenishStock);
		}else{
			currentInventory = [];
			//checks current inventory
			connection.query("SELECT * FROM inventory WHERE ?", {SKU : itemSKU},function(err, res) {
				if (err) {
					console.log("that item does not appear in our systems, please try again");
				};
			var stock = res[0].quanity;
			var itemName = res[0].name;
			//var charges = amount * parseFloat(res[0].price);
			var newStock = parseInt(stock) + parseInt(answers.quanity);

			if(answers.confirm){
				

				connection.query("UPDATE inventory SET ? WHERE ?", [{
					quanity: newStock
				}, {
					SKU: itemSKU
				}], function(err, res) {});
						
				console.log("You have stocked " + amount +" units of " + itemName);
				console.log("You have been logged out of the manager portal here is a summary of your current stock.");
				printDB();				
				dissconnectDB();
			} else {
				connection.query("UPDATE inventory SET ? WHERE ?", [{
					quanity: newStock
				}, {
					SKU: itemSKU
				}], function(err, res) {});
				console.log("You have stocked " + amount +" units of " + itemName);
				printDB(replenishStock);
				}
			});
		}
	});
}

//----------------------------------------------------------//
//                add inventory function                    //
//----------------------------------------------------------//


function addInventory(){


inquirer.prompt([
		{
		message: "what is the name of the item you would like to add?",
		name: "brand",
		validate: function(value) {
            if (isNaN(value) === true && value.length > 0) {
                return true;
            }
                return false;
        }

	} , {
		message: "How much would you like to stock?",
		name: "quanity",
		validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
                return false;
        }
	} , {
		message: "How much does this item cost?",
		name: "quanity",
		validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
                return false;
        }
	} , {
		message: "What is this products category?",
		name: "quanity",
		validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
                return false;
        }
	} , {
		type: "confirm",
	    message: "Are you done stocking?",
	    name: "confirm",
	    default: false
	}

	]).then(function (answers) {

	});


}



