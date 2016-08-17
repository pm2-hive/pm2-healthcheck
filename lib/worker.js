/**
 * Copyright 2016 Keymetrics Team. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var pmx             = require('pmx');
var request         = require('request');
var Probe           = pmx.probe();

var WORKER_INTERVAL = undefined;
var TARGET_URLS     = undefined;

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

  // register each tracked probes
  TARGET_URLS.forEach(function (url) {
    var tmp = instance.probes[url] = Probe.metric({
      name: url,
      value : function() { return 'N/A'; },
      alert : {
        mode  : 'threshold',
        value : 1000,
        msg   : 'Health check for ' + url + " has taken more than "
      }
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
      else {
        console.error(error);
        pmx.notify('A error has been thrown when trying to reach ' + url + ' , check your logs');
      }
    })
  });
}

module.exports = Worker;