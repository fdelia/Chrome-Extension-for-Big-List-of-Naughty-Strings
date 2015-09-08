console.log('background script');

// chrome.runtime.onMessage.addListener(function(req, sender, sendRes) {
// 	if (req.method === "sendPoints") {
// 		console.log(req);

// 		chrome.storage.local.set({
// 			"pointsToday": req.points
// 		}, function() {
// 			console.log('points set');
// 		});

// 		sendRes({
// 			status: "ok"
// 		});
// 	}
// });

// chrome.runtime.sendMessage({
// 	method: "startCollection"
// }, function(res) {
// 	console.log(res);
// });



// TODO into own class files
var JoizCollector = (function() {
	function JoizCollector() {

	}

	function dateDDMMYY() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;

		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd
		}
		if (mm < 10) {
			mm = '0' + mm
		}

		return dd + '.' + mm + '.' + yyyy;
	}

	function createTab(url) {
		chrome.tabs.create({
			url: url,
			selected: false
		});
		console.log('create tab with url ' + url);

		setTimeout(function() {
			var queryInfo = {
				url: [url]
			};

			console.log('search for the id of opened tab');
			chrome.tabs.query(queryInfo, function(tabs) {
				console.log(tabs);

				if (tabs[0] && tabs[0].id) {
					console.log('tab closed');
					chrome.tabs.remove(tabs[0].id);
				}
			});


		}, 10 * 1000);
	}

	JoizCollector.prototype.runLive = function() {
		var url = "http://www.joiz.ch/onair/livestream";
		createTab(url);
	};

	JoizCollector.prototype.runMarketPlace = function() {
		var url = "https://www.joiz.ch/marketplace/products-by-status/4";
		createTab(url);
	};

	function getUser(users){
		// stop condition for recursivity
		if (Object.prototype.toString.call(users) !== '[object Array]' || users.length < 1) return;

		// gets and removes first user
		var nickName = users.shift().nickName;
		if (typeof nickName !== 'string') {
			console.error('type error');
			return;
		}

		// try to find out if isn't friend or isn't fan
		$.ajax({
			url: 'https://www.joiz.ch/user/mini-profile/' + nickName
		}).done(function(data) {
			if (data.indexOf('Freund werden') > -1 || data.indexOf('Fan werden') > -1) {
				// go for this user
				console.log('go for user '+nickName);
				var url = "https://www.joiz.ch/user/profile/gluupsch" + nickName;
				createTab(url);
			} else {
				// try next user
				getUser(users);
			}

		});


	}

	JoizCollector.prototype.runPerson = function() {
		// this gets a list of online users
		// https://www.joiz.ch/online-users/1/52.json
		// this gets a mini profile in html
		// https://www.joiz.ch/user/mini-profile/severindesmond

		var sendData = {};
		$.getJSON('https://www.joiz.ch/online-users/1/52.json', sendData, function(data, textStatus, jqXHR) {
			var users = data.users.slice(0, 3); // only look at first 3 users

			if (users.length < 3) {
				console.error('user list from online-users is too small');
				return;
			}

			getUser(users);

		});

	};

	// gets points only once a day, to see how many points have been made on this day
	JoizCollector.prototype.getTodayPoints = function() {
		var promise = new Promise(function(resolve, reject) {
			chrome.storage.local.get("points-amount", function(res) {
				resolve(parseInt(res["points-amount"]));
			});
		});

		return promise;
	};

	// only sets today's points if not already set
	JoizCollector.prototype.setTodayPoints = function() {
		// https://www.joiz.ch/user/getData
		chrome.storage.local.get("points-day", function(res) {
			var ddmmyyyy = dateDDMMYY();

			if (res.day !== ddmmyyyy) {
				var data = {};
				$.getJSON('https://www.joiz.ch/user/getData', data, function(data, textStatus, jqXHR) {
					if (textStatus === 'success' && data && data.user) {
						var points = data.user.totalPoints;

						chrome.storage.local.set({
							"points-day": ddmmyyyy
						});

						chrome.storage.local.set({
							"points-amount": points
						});
					}
				});
			}
		});

	};

	return JoizCollector;

})();



var StateController = (function() {
	var state = null;
	var lastColDate = null;
	var colInterval = null;
	var isLoaded = false;

	function StateController(ConstcolInterval) {
		colInterval = ConstcolInterval || 180 * 60 * 1000;

		chrome.storage.local.get("state", function(res) {
			state = res.state;
			chrome.storage.local.get("lastColDate", function(res) {
				lastColDate = res.lastColDate;
				isLoaded = true;
			});
		});
	}

	function setState(newState) {
		state = newState;
		chrome.storage.local.set({
			"state": newState
		});
	}

	StateController.prototype.isLoaded = function() {
		return isLoaded;
	}

	StateController.prototype.checkIfShouldRun = function() {
		// if lastColDate too old and state == check -> run
		return (Date.now() - lastColDate > colInterval) && state !== 'stop';
	};

	StateController.prototype.didRun = function() {
		lastColDate = Date.now();
		chrome.storage.local.set({
			"lastColDate": lastColDate
		});
	}

	StateController.prototype.getState = function() {
		return state;
	};

	StateController.prototype.getLastColDate = function() {
		return lastColDate;
	}

	StateController.prototype.setController = function(newState, newLastColDate) {
		setState(newState);
		lastColDate = newLastColDate;
	};

	// StateController.prototype.setStateToCol = function() {
	// 	setState('col-0');
	// };

	StateController.prototype.setStateToStart = function() {
		setState('check');
	};

	StateController.prototype.setStateToStop = function() {
		setState('stop');
	};

	return StateController;

})();



main();

function main() {
	var runJoizInterval = 180 * 60 * 1000;
	var SC = new StateController(runJoizInterval);
	var JC = new JoizCollector();

	var intHandler = setInterval(function() {
		console.log('* interval tick *');
		// get and save today points
		JC.setTodayPoints();

		// check if should run
		if (SC.isLoaded() && SC.checkIfShouldRun()) {
			console.log('running now');
			JC.runLive();
			JC.runMarketPlace();
			JC.runPerson();

			SC.didRun();
		}
	}, 60 * 1000);


	// dev
	// JC.runPerson();
	// JC.setTodayPoints();
	// JC.runLive();
	// JC.runMarketPlace();
}



// *** TESTS *** OLD

// console.log('* test StateController *');
// var SC = new StateController(1000);
// console.log('load state');
// console.log('is loaded: ' + SC.isLoaded());
// console.log('initial state: ' + SC.getState());

// setTimeout(function() {
// 	console.log('is loaded: ' + SC.isLoaded());
// 	console.log('initial state: ' + SC.getState());
// 	console.log('set state to "stop"');
// 	SC.setStateToStop();
// 	console.log('get state: ' + SC.getState());
// 	console.log('check state: ' + SC.checkIfShouldRun());


// 	console.log('* test JoizCollector *');
// 	var JC = new JoizCollector();


// }, 1000);