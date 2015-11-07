GAME.Controller = (function(){
	'use strict';

	var currentScreen;

	// Shows the desired screen
	function showScreen(name){
		currentScreen = name;
		//GAME.screens[currentScreen].run(); // DISABLED FOR NOW!!!
	}

	// Initializes each screen (if necessary)
	function initialize(){
		var screen;

		for (screen in GAME.screens){
			if(GAME.screens.hasOwnProperty(screen)){
				GAME.screens[screen].initialize();
			}
		}

		currentScreen = "game";
		showScreen(currentScreen);		
	}

	return {
		initialize:initialize,
		showScreen:showScreen
	};
}());
