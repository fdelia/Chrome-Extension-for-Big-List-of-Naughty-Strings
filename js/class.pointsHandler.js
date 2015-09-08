class PointsHandler {
    loadAndSavePoints() {
    }
    getPoints() {
        var promise = new Promise(function (resolve, reject) {
            chrome.storage.local.get("points-amount", function (res) {
                resolve(parseInt(res["points-amount"]));
            });
        });
        return promise;
    }
}
