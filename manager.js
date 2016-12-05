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
	        printDB();
	        break;
	    case "Remove Item":
	   		printDB();
	       	
	        break;
	    case "Replenish Stock":
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
		{	message: "please enter the id of the product you would like to re-stock",
			name: "id",
			validate: function(value) {
            if (isNaN(value) === false && value.length > 0) {
                return true;
            }
                return false;
        }
		}

	]).then(function (answers) {
		console.log(answers.userChoice);
}



