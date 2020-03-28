// ==UserScript==
// @name         Instacart Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ZiAng Zhu
// @match        https://www.instacart.com/store/checkout_v3
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

"use strict";

const DELIVERY_OPTIONS_SELECTOR = 'div[id="Delivery options"]';
const DELIVERY_OPTIONS_MESSAGE_SELECTOR = "div > p > span:nth-child(1) > span";
const NOTIFICATION_SOUND_PLAYER = document.createElement("audio");

NOTIFICATION_SOUND_PLAYER.src = "https://www.w3schools.com/jsref/horse.ogg";
NOTIFICATION_SOUND_PLAYER.type = "audio/ogg";
NOTIFICATION_SOUND_PLAYER.preload = "auto";
NOTIFICATION_SOUND_PLAYER.allow = "autoplay";


let checkDeliveryOption = (websiteName) => {
    switch (websiteName) {
        case "instacart":
            return instacartWatcher();
            break;
        default:
            console.log("Current website is not supported");
    }
};

let instacartWatcher = () => new Promise((resolve, reject) => {
    var waitForInstacartToLoadDeliveryOptions = setInterval(() => {
        var changeDeliveryTimeButton = $('#nav-checkout + div button[aria-label="Change Delivery time"]');
        if (changeDeliveryTimeButton.length === 0) {
            console.log("Instacart is not fully loaded. Retrying...");
        } else if (changeDeliveryTimeButton.is(":disabled")) {
            var deliveryTabs = $('#nav-checkout + div button[aria-label="Change Delivery time"] + div .react-tabs');
            var dateList = deliveryTabs.find("ul > li");
            if (dateList.length > 0) {
                clearInterval(waitForInstacartToLoadDeliveryOptions);
                console.log("Number of available date: %o", dateList.length);
                var deliveryOptionContainer = deliveryTabs.find('div[id="Delivery options"]');
                var deliveryOptions = deliveryOptionContainer.find('input[type="radio"]');
                console.log("Number of delivery options: %o", deliveryOptions.length);
                if (dateList.length > 0 && deliveryOptions.length > 0) {
                    resolve();
                } else {
                    reject();
                }
            } else {
                console.log("Delivery tab has not been loaded yet ...");
            }
        } else {
            console.log("Change delivery time button is not selected. Trying to click on change delivery time button.");
            changeDeliveryTimeButton.click();
        }
    }, 1000);
});

let reloadPageInSeconds = (seconds) => {
    var target = new Date();
    target.setSeconds(target.getSeconds() + 60);
    var countDown = setInterval(() => {
        var diff = Math.ceil((target - Date.now()) / 1000);
        if (diff <= 0) {
            console.log("Reloading ... ");
            clearInterval(countDown);
            location.reload();
        } else {
            console.log("Reloading page in", diff, "seconds ...");
        }
    }, 1000);
};

let main = () => {
    checkDeliveryOption("instacart")
    .then(() => {
        console.log("Delivery options might be available now!");
        NOTIFICATION_SOUND_PLAYER.play();
    })
    .catch(() => {
        reloadPageInSeconds(60);
    });
}

(function () {
    console.log("Start monitoring delivery options!");
    main();
})();
