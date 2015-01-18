var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var data = require("sdk/self").data;
var tabs = require("sdk/tabs");

var popup = require("sdk/panel").Panel({
    contentURL: data.url("popup.html"),
    contentScriptFile: data.url("popup.js")
});

var button = ToggleButton({
    id: "lantern-button",
    label: "Lantern",
    icon: {
        "32": "./icons/icon-32.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    contentURL: self.data.url("panel.html"),
    contentScriptFile: data.url("panel.js"),
    onHide: handleHide
});

panel.port.on("open-www", function() {
    panel.hide();
    tabs.open({
        url: "http://www.getlantern.org",
        onReady: function onReady(tab) {
            console.log(tab.title);
        }
    });
});

panel.port.on("show-popup", function() {
    panel.hide();
    popup.show();
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
popup.on("show", function() {
      popup.port.emit("show");
});

// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
popup.port.on("text-entered", function (text) {
  console.log(text);
  popup.hide();
});
