(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _companion = require("push-simple/companion");

var _app = require("push-simple/app");

$(document).ready(_companion.ready);
$(document).ready(_app.ready);
$(document).on('page:load.push-simple', _app.ready);
$(document).on('page:before-change.push-simple', function () {
  $(document).unbind('page:load.push-simple');
});

$(document).on('page:send-notification.push-simple', _app.sendNotification);
$('.send-notification-button').on('click', _app.sendNotification);

console.log("Push simple");

},{"push-simple/app":2,"push-simple/companion":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendNotification = exports.ready = undefined;

var _logger = require('utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _logger2.default('[push-simple/app]');

function ready() {
  setup(logSubscription);
}

function setup(onSubscribed) {
  logger.log('Setting up push subscription');

  if (!window.PushManager) {
    logger.warn('Push messaging is not supported in your browser');
  }

  if (!ServiceWorkerRegistration.prototype.showNotification) {
    logger.warn('Notifications are not supported in your browser');
    return;
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        logger.log('Permission to receive notifications granted!');
        subscribe(onSubscribed);
      }
    });
    return;
  } else {
    logger.log('Permission to receive notifications granted!');
    subscribe(onSubscribed);
  }
}

function subscribe(onSubscribed) {
  navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    var pushManager = serviceWorkerRegistration.pushManager;
    pushManager.getSubscription().then(function (subscription) {
      if (subscription) {
        refreshSubscription(pushManager, subscription, onSubscribed);
      } else {
        pushManagerSubscribe(pushManager, onSubscribed);
      }
    });
  });
}

function refreshSubscription(pushManager, subscription, onSubscribed) {
  logger.log('Refreshing subscription');
  return subscription.unsubscribe().then(function (bool) {
    pushManagerSubscribe(pushManager);
  });
}

function pushManagerSubscribe(pushManager, onSubscribed) {
  logger.log('Subscribing started...');

  pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: window.publicKey
  }).then(onSubscribed).then(function () {
    logger.log('Subcribing finished: success!');
  }).catch(function (e) {
    if (Notification.permission === 'denied') {
      logger.warn('Permission to send notifications denied');
    } else {
      logger.error('Unable to subscribe to push', e);
    }
  });
}

function logSubscription(subscription) {
  logger.log("Current subscription", subscription.toJSON());
}

function getSubscription() {
  return navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    return serviceWorkerRegistration.pushManager.getSubscription().catch(function (error) {
      logger.warn('Error during getSubscription()', error);
    });
  });
}

function sendNotification() {
  getSubscription().then(function (subscription) {
    return fetch("/push", {
      headers: formHeaders(),
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ subscription: subscription.toJSON() })
    }).then(function (response) {
      logger.log("Push response", response);
      if (response.status >= 500) {
        logger.error(response.statusText);
        alert("Sorry, there was a problem sending the notification. Try resubscribing to push messages and resending.");
      }
    }).catch(function (e) {
      logger.error("Error sending notification", e);
    });
  });
}

function formHeaders() {
  return new Headers({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': authenticityToken()
  });
}

function authenticityToken() {
  return document.querySelector('meta[name=csrf-token]').content;
}

exports.ready = ready;
exports.sendNotification = sendNotification;

},{"utils/logger":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ready = undefined;

var _logger = require('utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _alertonce = require('utils/alertonce');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _logger2.default('[push-simple/client]');

function ready() {
  if (navigator.serviceWorker) {
    logger.log('Registering serviceworker');
    navigator.serviceWorker.register('/push-simple/serviceworker.js').then(function (reg) {
      logger.log(reg.scope, 'register');
      logger.log('Service worker change, registered the service worker');
    });
  } else {
    (0, _alertonce.alertSWSupport)();
  }
}

exports.ready = ready;

},{"utils/alertonce":4,"utils/logger":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function alertOnce(labelSuffix, message) {
  if (!localStorage) {
    alert(message);
    return false;
  }

  var label = 'alerted-' + labelSuffix;
  var alerted = localStorage.getItem(label) || '';

  if (alerted != "yes") {
    localStorage.setItem(label, 'yes');
    alert(message);
  }

  return true;
}

function alertSWSupport() {
  return alertOnce("serviceWorker", "Sorry but the browser you're using does not support Service Workers yet! Check out caniuse.com to learn moreabout browser support");
}

exports.alertOnce = alertOnce;
exports.alertSWSupport = alertSWSupport;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
  function Logger(label) {
    _classCallCheck(this, Logger);

    this.label = label;
  }

  _createClass(Logger, [{
    key: "log",
    value: function log() {
      var _console;

      (_console = console).log.apply(_console, [this.label].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "error",
    value: function error() {
      var _console2;

      (_console2 = console).error.apply(_console2, [this.label].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "warn",
    value: function warn() {
      var _console3;

      (_console3 = console).warn.apply(_console3, [this.label].concat(Array.prototype.slice.call(arguments)));
    }
  }]);

  return Logger;
}();

exports.default = Logger;

},{}]},{},[1]);
