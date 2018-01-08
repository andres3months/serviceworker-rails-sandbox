(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _logger = require('utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _logger2.default('[push-react/serviceworker]');

logger.log("Hello!");

function onPush(event) {
  logger.log("Received push message", event);

  var title = event.data && event.data.text() || "Yay a message";
  var body = "We have received a push message";
  var tag = "push-react-demo-notification-tag";
  var icon = '/assets/turtle-logo-120x120.png';

  event.waitUntil(self.registration.showNotification(title, { body: body, icon: icon, tag: tag }));
}

self.addEventListener("push", onPush);

},{"utils/logger":2}],2:[function(require,module,exports){
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
