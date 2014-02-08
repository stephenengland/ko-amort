var amortizationFunctions = formulas(Math);
var viewModel = amortization(ko, amortizationFunctions);

$(document).ready(function() {
	ko.applyBindings(viewModel);
	
	var datepicker = $('.input-group.date').datepicker();
	
	datepicker.datepicker('update', viewModel.startDate());
	
	datepicker.on('changeDate', function (e) {
		viewModel.startDate(e.date);
	});
});