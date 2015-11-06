// Storage module for interacting with localStorage in the browser
var Storage = (function(){

	// Adds a new pair to localStorage
   	function add(key, value){
       	localStorage[key] = value;
    }

	// Removes a pair from localStorage
   	function remove(key){
       	localStorage.removeItem(key);
   	}

	// Returns all of the keys in localStorage
    function getKeys(){
       	var i, keys = [];

        for(i = 0; i < localStorage.length; i++){
           	keys.push(localStorage.key(i));
       	}

       	return keys;
   	}

	// Returns all pairs in localStorage
    function getPairs(){
       	var i, pairs = [];

        for(i = 0; i < localStorage.length; i++){
           	pairs.push({
              	key:localStorage.key(i),
               	value:localStorage[localStorage.key(i)]
           	});
       	}

		return pairs;
    }

	// Gets one specific value when given a key
    function getValue(key){
       	return localStorage[key];
   	}

   	function clearAll(){
  		localStorage.clear();
   	}

    return {
		add:add,
		remove:remove,
		getKeys:getKeys,
		getPairs:getPairs,
		getValue:getValue,
		clearAll:clearAll
	};

})();
