# Naughty Strings Chrome Extension

Tests an input field or textarea against strings which "have a high probability of causing issues when used as user-input data". Strings from (Big List of Naughty Strings)[https://github.com/minimaxir/big-list-of-naughty-strings].

## Note

You should disable the extension if not used since it is active on every opened tab/webpage.

That strings are safed locally so that no internet connection is required. I may change that in future.

The extension is written in Typescript.

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

