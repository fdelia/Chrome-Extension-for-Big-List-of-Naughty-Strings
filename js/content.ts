declare var $, chrome;

// timeout because it's possible that the event handler is set before the buttons loaded
setTimeout(function() {
	setEventHandlers();
}, 5000);

chrome.runtime.onMessage.addListener(onMessage);



var setInputTarget: boolean = false;

var inputTarget: any = null;
var clickTarget: any = null;
var interval: number = 300;

function setEventHandlers(): void {
	console.log('bind event handlers');

	// .setTarget is for namespacing
	$("body").on("click.setTarget", setTarget);
	$("button").on("click.setTarget", setTarget);
}

function unbindEventHandlers(): void {
	console.log('unbind event handlers');

	$("body").off("click.setTarget");
	$("button").off("click.setTarget");
}

function setTarget(event): void {
	if (! setInputTarget){
		inputTarget = event.target;
		console.log('input target set to', inputTarget);
		setInputTarget = true;
	} else {
		clickTarget = event.target;
		console.log('click target set to', clickTarget);
		setInputTarget = false;
	}
}

function onMessage(req, sender, sendResponse): void {	
	switch (req.action){
		case 'start':
			run();
			break;
		case 'setInterval':
			if (!interval) break;
			interval = req.interval;
			console.log('interval set to ' + interval);
			break;
	}

	sendResponse({status: 'ok'});
}

function run(): void {
	console.log('running tests now');

	var url = "https://raw.githubusercontent.com/minimaxir/big-list-of-naughty-strings/master/blns.json";
	// var url = chrome.extension.getURL('blns.json');
	$.getJSON(url, function(strings) {
 		// "strings" is an array of test strings

		// unbind since click() would mess up the targets
		unbindEventHandlers();
		

		// dev
		// strings = strings.slice(0, 3);
		// console.log(strings);
		// strings = [];


		if (!strings || strings.length < 1){
			console.error('No strings found. Connected to internet? Tried with url: ' + url);
			return;
		}

		console.log('found ' + strings.length + ' strings');

		var intHandler = setInterval(function() {
			testString(strings.shift());

			if (strings.length < 1){ 
				clearInterval(intHandler);
				console.log('tests finished');
				
				// set the event handlers again
				setEventHandlers();
			}
		}, interval);
			
	});
}

function testString(string: string): void {
	console.log('testing string "'+ string + '"');
	$(inputTarget).val(string);
	$(inputTarget).trigger('input');
	$(clickTarget).click();
}


