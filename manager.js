var inquirer = require("inquirer");

inquirer.prompt([
	{ 	type: "list",
		message: "what action would you like to take?",
		choices: ["Add Inventory", "Remove Item", "Replenish Stock"],
		name: "userChoice"
	}

]).then(function (answers) {
	console.log(answers.userChoice);
});