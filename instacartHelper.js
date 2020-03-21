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


function findDeliveryOptionsElements() {
    var deliveryOptionsElements = $(DELIVERY_OPTIONS_SELECTOR);
    if (deliveryOptionsElements && deliveryOptionsElements.length) {
        return deliveryOptionsElements;
    }
    return null;
}

function findDeliveryOptionsMessageElements() {
    var deliveryOptionsElements = $(DELIVERY_OPTIONS_SELECTOR);
    if (deliveryOptionsElements.length) {
        console.log("Delivery options is loaded.");
        var message = deliveryOptionsElements.find(
            "div > p > span:nth-child(1) > span"
        );
        return message;
    }
    return null;
}

function isDeliveryAvailable(message) {
    return !(message && message.length && message.text() && message.text().toLowerCase().includes("sorry"));
}

function reloadPageInSeconds(seconds) {
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
}

function waitForDeliveryOptions() {
    var waitForElement = setInterval(() => {
        var deliveryOptionsElements = findDeliveryOptionsElements();
        if (deliveryOptionsElements) {
            var message = findDeliveryOptionsMessageElements();
            clearInterval(waitForElement);
            if (isDeliveryAvailable(message)) {
                NOTIFICATION_SOUND_PLAYER.play();
                console.log("Delivery options might be available now!");
            } else {
                console.log("Delivery options is not available now.");
                reloadPageInSeconds(60);
            }
        } else {
            console.log("Waiting for delivery options to be loaded ...");
        }
    }, 1000);
}

(function () {
    console.log("Start monitoring delivery options!");
    waitForDeliveryOptions();
})();
