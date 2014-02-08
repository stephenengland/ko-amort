//http://stackoverflow.com/questions/7704268/formatting-rules-for-numbers-in-knockoutjs - answer by Stephen R.
ko.bindingHandlers.numericText = {
	update: function(element, valueAccessor, allBindingsAccessor) {
		var value = parseFloat(ko.utils.unwrapObservable(valueAccessor()));
		var positions = ko.utils.unwrapObservable(allBindingsAccessor().positions) || ko.bindingHandlers.numericText.defaultPositions;
		var formattedValue = value.toFixed(positions); 
		var finalFormatted = ko.bindingHandlers.numericText.withCommas(formattedValue);  
		
		ko.bindingHandlers.text.update(element, function() { return finalFormatted; });
	},
	defaultPositions: 2,
	withCommas: function(original){
		original += '';
		x = original.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
};