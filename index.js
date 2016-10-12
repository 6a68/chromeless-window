var self = require("sdk/self");
const { getMostRecentBrowserWindow } = require('sdk/window/utils');

function main(options, callbacks) {
  var window = getMostRecentBrowserWindow();
  var win = window.open(self.data.url('window.html'), "_blank",
                        "chrome,dialog=no,width=300,height=300,titlebar=no");

  function waitForWin(callback) {
    if (win.wrappedJSObject.communicate) {
      callback(win.wrappedJSObject.communicate);
    } else {
      // There must be a better way to do this...
      window.setTimeout(() => waitForWin(callback), 0);
    }
  }

  waitForWin(communicate => {
    // communicate with the popup window.
    communicate("opener says hello.");

    // read the popup window's global state and send it back.
    communicate("opener says the window.response value is : " + win.wrappedJSObject.response);

    // try to overwrite the popup window's global state after reading it
    win.wrappedJSObject.response = 'overwritten by opener';
    communicate("opener unset the popup's window.response after reading it: " + win.wrappedJSObject.response);
  });
}

exports.main = main;
