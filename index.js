function roundToTwo(num) {    
    return (+(Math.round(num + "e+2")  + "e-2")).toFixed(2);
}

var formulas = { 
	"getPayment": function (principal, monthlyInterestRate, numberOfMonths) {
		//http://en.wikipedia.org/wiki/Amortization_calculator
		var bottom = Math.pow((1.00 + monthlyInterestRate), numberOfMonths) - 1.00;
		
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
	}
};

var amortization = {
	"originalPrincipal": ko.observable(209950),
	"annualInterestRate": ko.observable(0.03375),
	"numberOfYears": ko.observable(30),
	"startDate": ko.observable(new Date(2013, 1, 1)),
	"schedule": ko.observableArray([]),
	"extraPayments": new ko.observableDictionary({}),
	"regenPayments": ko.observable()
};
amortization.monthlyInterestRate = ko.computed(function() {
	return formulas.getMonthlyInterestRate(amortization.annualInterestRate());
}, amortization);

amortization.numberOfMonths = ko.computed(function() {
	return formulas.getNumberOfMonths(amortization.numberOfYears());
}, amortization);

amortization.monthlyPayment = ko.computed(function() {
	return formulas.getPayment(amortization.originalPrincipal(), amortization.monthlyInterestRate(), amortization.numberOfMonths());
}, amortization);

amortization.payoffMonths = ko.computed(function() {
	amortization.schedule.removeAll();
	
	var monthlyPayment = amortization.monthlyPayment(),
		currentPrincipal = amortization.originalPrincipal(),
		monthlyInterestRate = amortization.monthlyInterestRate(),
		monthNumber = 1,
		startDate = amortization.startDate(),
		dummy = amortization.regenPayments();

	while (currentPrincipal >= 0) {
		var interestPayment = formulas.getCurrentInterestPayment(currentPrincipal, monthlyInterestRate);
		var principalPayment = roundToTwo(monthlyPayment - interestPayment);
		currentPrincipal = roundToTwo(currentPrincipal - principalPayment);
		var newDate = new Date(startDate.getTime());
		newDate.setMonth(newDate.getMonth() + (monthNumber - 1));
		var scheduleItem = {
			'principalPayment': principalPayment, 
			'interestPayment': interestPayment,
			'principalRemaining': currentPrincipal,
			'monthNumber': monthNumber,
			'date': newDate,
			'extraPayment': false,
			'extraPaymentPrincipal': 0
		};
		
		if (amortization.extraPayments) {
			var extraPayment = amortization.extraPayments.get(monthNumber)();
			if (extraPayment) {
				scheduleItem.extraPayment = extraPayment;
				currentPrincipal = (currentPrincipal - extraPayment).toFixed(2);
				scheduleItem.extraPaymentPrincipal = currentPrincipal;
			}
		}
		
		amortization.schedule.push(scheduleItem);

		monthNumber++;
	}
}, amortization);

$(document).ready(function() {
	ko.applyBindings(amortization);
});
