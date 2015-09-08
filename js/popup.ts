declare var $, chrome;


$(document).ready(function() {
	$("#setInterval").click(setInterval);
	$("#run").click(run);	

});

function setInterval(): void {
	var interval: number = $("#interval").val();
	if (!interval){
		console.error("entered interval not valid");
		return;
	}

	getActiveTab().pipe(function(tab) {
		chrome.tabs.sendMessage(tab.id, {action: 'setInterval', interval: interval}, function(res){
		});
	});
}

function run(): void {
	getActiveTab().pipe(function(tab){

		if (!tab.id){
			console.error('no tab id');
			return;
		}

		chrome.tabs.sendMessage(tab.id, {action: 'start'}, function(res){
		});
	});
}

function getActiveTab(): any {
	var def = $.Deferred();

	chrome.tabs.query({active: true}, function(tabs){
		if (tabs[0])
			def.resolve(tabs[0]);
		else
			def.reject("no active tab found");
	});

	return def.promise();
}