var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');





// prompts user for input 

inquirer.prompt([
	{ 	type: "list",
		message: "what action would you like to take?",
		choices: ["Add Inventory", "Remove Item", "Replenish Stock"],
		name: "userChoice"
	}

]).then(function (answers) {
	console.log(answers.userChoice);

	switch(answers.userChoice) {
    case "Add Inventory":
        connectDB();
        dissconnectDB();
        break;
    case "Remove Item":
       	connectDB();
        dissconnectDB();
        break;
    case "Replenish Stock":
        connectDB();
        dissconnectDB();
        break;
    default:
        console.log("I have never heard of that fruit...");
	}



});

//connect to database

function connectDB(){

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
	  	console.log("connected as id " + connection.threadId);
	});
}

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
		  , [1,2,3,4,5]
		);
		 
		console.log(table.toString());







	  for (var i = 0; i < res.length; i++) {
	    console.log(res[i].id + " | " + res[i].title + " | " + res[i].artist + " | " + res[i].genre);
	  }
	  console.log("-----------------------------------");
	});
}





