var formulas = function(math) {
	var roundToTwo = function(num){
		return (+(math.round(num + "e+2")  + "e-2")).toFixed(2);
	};
	
	return {
		"getPayment": function (principal, monthlyInterestRate, numberOfMonths) {
			//http://en.wikipedia.org/wiki/Amortization_calculator
			var bottom = math.pow((1.00 + monthlyInterestRate), numberOfMonths) - 1.00;
			
			return roundToTwo(principal * (monthlyInterestRate + (monthlyInterestRate / bottom)));
		},
		"getCurrentInterestPayment": function (principal, monthlyInterestRate) {
			return roundToTwo(principal * monthlyInterestRate);
		},
		"getMonthlyInterestRate": function(annualInterestRate) {
			return parseFloat(annualInterestRate) / 12.00;
		},
		"getNumberOfMonths": function(numberOfYears) {
			return parseInt(numberOfYears) * 12;
		},
		"roundToTwo": roundToTwo
	};
};