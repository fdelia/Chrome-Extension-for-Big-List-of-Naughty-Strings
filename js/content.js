// timeout because it's possible that the event handler is set before the buttons loaded
setTimeout(function () {
    setEventHandlers();
}, 5000);
chrome.runtime.onMessage.addListener(onMessage);
var setInputTarget = false;
var inputTarget = null;
var clickTarget = null;
var interval = 300;
function setEventHandlers() {
    console.log('bind event handlers');
    // .setTarget is for namespacing
    $("body").on("click.setTarget", setTarget);
    $("button").on("click.setTarget", setTarget);
}
function unbindEventHandlers() {
    console.log('unbind event handlers');
    $("body").off("click.setTarget");
    $("button").off("click.setTarget");
}
function setTarget(event) {
    if (!setInputTarget) {
        inputTarget = event.target;
        console.log('input target set to', inputTarget);
        setInputTarget = true;
    }
    else {
        clickTarget = event.target;
        console.log('click target set to', clickTarget);
        setInputTarget = false;
    }
}
function onMessage(req, sender, sendResponse) {
    switch (req.action) {
        case 'start':
            run();
            break;
        case 'setInterval':
            if (!interval)
                break;
            interval = req.interval;
            console.log('interval set to ' + interval);
            break;
    }
    sendResponse({ status: 'ok' });
}
function run() {
    console.log('running tests now');
    $.getJSON(chrome.extension.getURL('blns.json'), function (strings) {
        // strings is an array of test strings
        // unbind since click() would mess up the targets
        unbindEventHandlers();
        //  	var backup_inputTarget = inputTarget;
        // var backup_clickTarget = clickTarget;
        // dev
        // strings = strings.slice(0, 3);
        console.log('found ' + strings.length + ' strings');
        var intHandler = setInterval(function () {
            testString(strings.shift());
            // inputTarget = backup_inputTarget;
            // clickTarget = backup_clickTarget;
            if (strings.length < 1) {
                clearInterval(intHandler);
                console.log('tests finished');
                // set the event handlers again
                setEventHandlers();
            }
        }, interval);
    });
}
function testString(string) {
    console.log('testing string "' + string + '"');
    $(inputTarget).val(string);
    $(inputTarget).trigger('input');
    $(clickTarget).click();
}
