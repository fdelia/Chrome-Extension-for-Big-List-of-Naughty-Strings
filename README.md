# Chrome Extension for Big List of Naughty Strings

Tests an input field or textarea against strings which "have a high probability of causing issues when used as user-input data". Strings are from [Big List of Naughty Strings](https://github.com/minimaxir/big-list-of-naughty-strings).

## Notes

Internet connection is required to get the file with strings (downloads [this file](https://raw.githubusercontent.com/minimaxir/big-list-of-naughty-strings/master/blns.json)).

You should disable the extension if not used since it is active on every opened tab/webpage.

The extension is very basic and written in Typescript (*.ts). The Typescript files are partly commented.

## Installation

- Download to zip (or clone it)
- Unzip
- In chrome: enter `chrome://extensions/` into the address bar
- Ensure "Developer Mode" is ticked/enabled in the top right
- Click on "Load unpacked extension...".
- Navigate to your extracted directory, and click "OK".
- The extension should now be loaded. There should be an icon next to the address bar.

## Usage

- Go to the website you want to test, log in etc.
- Open dev console (mac: alt + cmd + j) to see what's going on
- Click the input target (where you would input the text)
- Click the click target (where you would click to send the text)
- Click the extension icon and set the interval there
- Click `run`

