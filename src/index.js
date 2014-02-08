var amortizationFunctions = formulas(Math);
var viewModel = amortization(ko, amortizationFunctions);

$(document).ready(function() {
	ko.applyBindings(viewModel);
});