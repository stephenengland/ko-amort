var amortization = function(ko, formulas) {
	var todaysDate = new Date();
	var amort = {
		"originalPrincipal": ko.observable(165000),
		"valueOfHome": ko.observable(185000),
		"annualInterestRatePercent": ko.observable(4.5),
		"numberOfYears": ko.observable(30),
		"startDate": ko.observable(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1)),
		"schedule": ko.observableArray([]),
		"extraPayments": new ko.observableDictionary({}),
		"regenPayments": ko.observable(),
		"annualTaxPercent": ko.observable(2.26),
		"pmiPercent": ko.observable(0.5),
		"totalInterestPaid": ko.observable(0)
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
	
	amort.hasTwentyPercentPrincipal = function (currentPrincipal) {
		return (amort.originalPrincipal() * 0.80) > currentPrincipal;
	};
	
	amort.annualTaxRate = ko.computed(function() {
		return amort.annualTaxPercent() / 100.00;
	}, amort);
	amort.pmiRate = ko.computed(function() {
		return amort.pmiPercent() / 100.00;
	}, amort);
	
	amort.pmiPayment = ko.computed(function() {
		return formulas.roundToTwo(amort.pmiRate() * amort.valueOfHome() / 12.0);
	}, amort);
	
	amort.taxPayment = ko.computed(function() {
		return formulas.roundToTwo(amort.annualTaxRate() * amort.valueOfHome() / 12.00);
	}, amort);
	
	amort.additionalCost = ko.computed(function() {
		return formulas.roundToTwo(parseFloat(amort.taxPayment()) + parseFloat(amort.pmiPayment()));
	}, amort);
	
	amort.totalMonthlyPayment = ko.computed(function() {
		return formulas.roundToTwo(parseFloat(amort.additionalCost()) + parseFloat(amort.monthlyPayment()));
	}, amort);

	amort.payoffDate = ko.computed(function() {
		amort.schedule.removeAll();
		var dummy = amort.regenPayments();
		
		var monthlyPayment = amort.monthlyPayment(),
			currentPrincipal = amort.originalPrincipal(),
			monthlyInterestRate = amort.monthlyInterestRate(),
			monthNumber = 1,
			startDate = amort.startDate(),
			hasTwentyPercent = false,
			payOffDate,
			totalInterest = 0.0;

		while (currentPrincipal >= 0) {
			var interestPayment = formulas.getCurrentInterestPayment(currentPrincipal, monthlyInterestRate);
			totalInterest += parseFloat(interestPayment);
			var principalPayment = formulas.roundToTwo(monthlyPayment - interestPayment);
			currentPrincipal = formulas.roundToTwo(currentPrincipal - principalPayment);
			var newDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
			newDate.setMonth(newDate.getMonth() + (monthNumber - 1));
			
			var twentyPercentEnded = false;
			if (!hasTwentyPercent) {
				hasTwentyPercent = amort.hasTwentyPercentPrincipal(currentPrincipal);
				if (hasTwentyPercent) {
					twentyPercentEnded = true;
				}
			}
			
			var escrow = hasTwentyPercent ? amort.taxPayment() : amort.additionalCost(),
				principalComplete = currentPrincipal <= 0,
				totalPayment;
			
			if (principalComplete) {
				principalPayment = formulas.roundToTwo(parseFloat(principalPayment) + parseFloat(currentPrincipal));
				totalPayment = formulas.roundToTwo(parseFloat(principalPayment) + parseFloat(interestPayment) + parseFloat(escrow));
			}
			else {
				totalPayment = amort.totalMonthlyPayment();
				if (hasTwentyPercent) {
					totalPayment = formulas.roundToTwo(parseFloat(totalPayment) - parseFloat(amort.pmiPayment()));
				}
			}
			
			amort.schedule.push({
				'principalPayment': principalPayment, 
				'interestPayment': interestPayment,
				'principalRemaining': principalComplete ? 0 : currentPrincipal,
				'monthNumber': monthNumber,
				'date': newDate,
				'escrow': escrow,
				'totalPayment': totalPayment,
				'twentyPercentEnded': twentyPercentEnded,
				'totalInterestPaid': formulas.roundToTwo(totalInterest),
				'isExtraPayment': false
			});
			
			if (amort.extraPayments) {
				var extraPayment = amort.extraPayments.get(monthNumber)();
				if (extraPayment) {
					currentPrincipal = (currentPrincipal - extraPayment).toFixed(2);
					twentyPercentEnded = false;
					
					if (!hasTwentyPercent) {
						hasTwentyPercent = amort.hasTwentyPercentPrincipal(currentPrincipal);
						if (hasTwentyPercent) {
							twentyPercentEnded = true;
						}
					}
					amort.schedule.push({
						'principalPayment': extraPayment, 
						'interestPayment': 0.00,
						'principalRemaining': currentPrincipal,
						'monthNumber': monthNumber,
						'escrow': escrow,
						'totalPayment': extraPayment,
						'twentyPercentEnded': twentyPercentEnded,
						'totalInterestPaid': totalInterest,
						'date': newDate,
						'isExtraPayment': true
					});
				}
			}
			
			amort.totalInterestPaid(formulas.roundToTwo(totalInterest));
			payOffDate = newDate;
			monthNumber++;
		}
		
		return payOffDate;
	}, amort);
	
	return amort;
};