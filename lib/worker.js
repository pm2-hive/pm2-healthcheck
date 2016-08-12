/**
 * Copyright 2016 Keymetrics Team. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var pmx         = require('pmx');
var request     = require('request');
var Probe       = pmx.probe();

var WORKER_INTERVAL = undefined;
var TARGET_URLS  = undefined;

/** Constructor */
var Worker = function (workerInterval, urls) {
  var self = this;

  WORKER_INTERVAL = workerInterval;
  TARGET_URLS = urls.split(',');
  this.probes = {};
}

Worker.prototype.probes = {};

/** Init all probes */
Worker.prototype.init = function () {
  var instance = this;

  TARGET_URLS.forEach(function (url) {
    var tmp = instance.probes[url] = Probe.metric({
      name: url,
      value : function() { return 'N/A'; }
    });
    Probe.attachAlert({
      name: url,
      value: 2000,
      mode: 'threshold',
      cmp: '>'
    });
  });
}

/** Update all probes */
Worker.prototype.update = function () {
  var instance = this;
  
  TARGET_URLS.forEach(function (url, idx) {
    var start = Date.now();
    request(url, function (error, response, body) {
      // if we got a 200 http code, send the respond time
      if (!error && response.statusCode == 200) 
        instance.probes[url].set(Date.now() - start);
      // else put a big number to be sure that it trigger an alert
      else
        instance.probes[url].set(100000);
    })
  });
}

module.exports = Worker;