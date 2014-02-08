var amortizationFunctions = formulas(Math);
var viewModel = amortization(ko, amortizationFunctions);

var viewExtraPaymentDate = function(monthNumber) {
	var startDate = viewModel.startDate();
	var newDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
	
	newDate.setMonth(startDate.getMonth() + (monthNumber() - 1));
	
	return newDate.toLocaleDateString();
};

var getExtraPaymentMonthNumber = function(date) {
	var startDate = viewModel.startDate();
	
	var monthDiff = function(d1, d2) {
		var months = (d2.getFullYear() - d1.getFullYear()) * 12;
		months -= d1.getMonth();
		months += d2.getMonth();
		return months <= 0 ? 0 : months;
	}
	
	return monthDiff(startDate, date) + 1;
};

$(document).ready(function() {
	ko.applyBindings(viewModel);
	
	var startdatepicker = $('#startDate').datepicker(),
		extraPaymentDate = $('#extraPaymentDate').datepicker(),
		extraPaymentAmount = $('#extraPaymentAmount');
	
	startdatepicker.datepicker('update', viewModel.startDate());
	
	startdatepicker.on('changeDate', function (e) {
		viewModel.startDate(e.date);
	});
	
	$('#extraPaymentButton').click(function() {
		try {
			var monthNumber = getExtraPaymentMonthNumber(extraPaymentDate.datepicker('getDate'));
		
			var payment = parseInt(extraPaymentAmount.val());
			if (payment && monthNumber) {
				if (viewModel.extraPayments.get(monthNumber)()){
					viewModel.extraPayments.set(monthNumber, parseInt(viewModel.extraPayments.get(monthNumber)()) + payment);
				}
				else {
					viewModel.extraPayments.set(monthNumber, payment);
				}
			}
		}
		catch (err) {
			console.log(err);
		}
		return false;
	});
});