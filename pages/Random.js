// Gives random numbers
var Random = (function(){

	// Gets random double between 0 and max
    	function getRandomDouble(max){
       		return Math.random() * max;
    	}

	// Gets random double between min and max
	function getRandomDoubleInRange(min, max){
		return min + Math.random() * (max - min);
	}

	// Gets random integer between 0 and max
	function getRandomInteger(max){
		return Math.floor(Math.random() * max + 1);
	}

	// Gets random integer between min and max
	function getRandomIntegerInRange(min, max){
		return Math.floor(min + Math.random() * (max - min));
	}

	return {
		getRandomDouble:getRandomDouble,
		getRandomDoubleInRange:getRandomDoubleInRange,
		getRandomInteger:getRandomInteger,
		getRandomIntegerInRange:getRandomIntegerInRange
	};
})();
