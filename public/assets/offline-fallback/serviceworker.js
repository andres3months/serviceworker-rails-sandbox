(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _caching = require('utils/caching');

var _logger = require('utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _logger2.default('[offline-fallback/serviceworker]');

function cacheOfflineResources() {
  logger.log('install event started.');

  return caches.open((0, _caching.cacheKey)('offline')).then(function (cache) {
    return cache.addAll(["/pages/offline-fallback/offline", "/assets/pics/cash-cat-9a8f5cc0c0a1c24f6ce69b75e4a0810b21335e056c7a7c304186af06f2d6d7fd.jpg", "/assets/application-4c8d0a2d29768f8b550bde982692f2837d6f57eeb8c91797ae1174b04ef48368.css"]);
  }).then(function () {
    logger.log('installation event complete!');
  });
}

function fetchOrOffline(request) {
  logger.log('fetch event started', request.url);

  if (request.method !== 'GET') {
    return;
  }

  return fetch(request).catch(function (error) {
    logger.error('fetch failed, falling back to offline response in cache', error);
    return offlineResponse(request);
  });
}

function offlineResponse(request) {
  var match = void 0;
  if (request.headers.get('accept').includes('text/html')) {
    match = '/pages/offline-fallback/offline';
  } else {
    match = request;
  }

  return caches.open((0, _caching.cacheKey)('offline')).then(function (cache) {
    return cache.match(match);
  });
}

self.addEventListener('install', function onInstall(event) {
  event.waitUntil(cacheOfflineResources());
});

self.addEventListener('fetch', function onFetch(event) {
  var request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(fetchOrOffline(request));
});

},{"utils/caching":2,"utils/logger":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var version = 'v05022016-1';

function cacheKey() {
  return [version].concat(Array.prototype.slice.call(arguments)).join(':');
}

exports.cacheKey = cacheKey;
exports.version = version;

},{}],3:[function(require,module,exports){
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
