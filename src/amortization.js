var amortization = function(ko, formulas) {
	var amort = {
		"originalPrincipal": ko.observable(209950),
		"annualInterestRatePercent": ko.observable(3.375),
		"numberOfYears": ko.observable(30),
		"startDate": ko.observable(new Date(2013, 1, 1)),
		"schedule": ko.observableArray([]),
		"extraPayments": new ko.observableDictionary({}),
		"regenPayments": ko.observable()
	};

	amort.annualInterestRate = ko.computed(function() {
		return (amort.annualInterestRatePercent() / 100);
	}, amort);

	amort.monthlyInterestRate = ko.computed(function() {
		return formulas.getMonthlyInterestRate(amort.annualInterestRate());
	}, amort);

	amort.numberOfMonths = ko.computed(function() {
		return formulas.getNumberOfMonths(amort.numberOfYears());
	}, amort);

	amort.monthlyPayment = ko.computed(function() {
		return formulas.getPayment(amort.originalPrincipal(), amort.monthlyInterestRate(), amort.numberOfMonths());
	}, amort);

	amort.payoffMonths = ko.computed(function() {
		amort.schedule.removeAll();
		var dummy = amort.regenPayments();
		
		var monthlyPayment = amort.monthlyPayment(),
			currentPrincipal = amort.originalPrincipal(),
			monthlyInterestRate = amort.monthlyInterestRate(),
			monthNumber = 1,
			startDate = amort.startDate();

		while (currentPrincipal >= 0) {
			var interestPayment = formulas.getCurrentInterestPayment(currentPrincipal, monthlyInterestRate);
			var principalPayment = formulas.roundToTwo(monthlyPayment - interestPayment);
			currentPrincipal = formulas.roundToTwo(currentPrincipal - principalPayment);
			var newDate = new Date(startDate.getTime());
			newDate.setMonth(newDate.getMonth() + (monthNumber - 1));
			
			amort.schedule.push({
				'principalPayment': principalPayment, 
				'interestPayment': interestPayment,
				'principalRemaining': currentPrincipal,
				'monthNumber': monthNumber,
				'date': newDate,
				'isExtraPayment': false
			});
			
			if (amort.extraPayments) {
				var extraPayment = amort.extraPayments.get(monthNumber)();
				if (extraPayment) {
					currentPrincipal = (currentPrincipal - extraPayment).toFixed(2);
					amort.schedule.push({
						'principalPayment': extraPayment, 
						'interestPayment': 0.00,
						'principalRemaining': currentPrincipal,
						'monthNumber': monthNumber,
						'date': newDate,
						'isExtraPayment': true
					});
				}
			}

			monthNumber++;
		}
	}, amort);
	
	return amort;
};