console.log("popup script");

$(document).ready(function() {
	$("#linkStartCollection").click(startCollection);

	chrome.storage.local.get("pointsToday", function(item) {
		console.log(item);
		$("#pointsToday").html(item.pointsToday);
	});


	

});

function startCollection() {
	// var url = "https://www.joiz.ch/marketplace/products-by-status/2";
	// chrome.tabs.create({
	// 	url: url
	// });


	// chrome.runtime.sendMessage({
	// 	method: "startCollection"
	// }, function(res) {
	// 	console.log(res);
	// });

	// var queryInfo = {
	// 	url: ["https://www.joiz.ch/*", "http://www.joiz.ch/*"]
	// }

	// chrome.tabs.query(queryInfo, function(tabs) {
	// 	console.log(tabs);
	// });

	// chrome.tabs.remove(id);

}