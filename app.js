/**
 * Copyright 2016 Keymetrics Team. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var pmx         = require('pmx');
var Probe       = pmx.probe();
var Worker      = require('./lib/worker');

pmx.initModule({
  widget : {
    type             : 'generic',
    logo             : 'https://raw.githubusercontent.com/pm2-hive/pm2-healthcheck/master/pres/health-check.png',

    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme            : ['#39bdb1', '#1B2228', 'white', '#807C7C'],

    block : {
      issues  : false,
      meta : true
    }
  }
}, function(err, conf) {

  var WORKER_INTERVAL     = (conf.workerInterval * 1000) || 2000;
  var TARGET_URLS         = conf.urls || process.env.PM_HEALTHCHECK_URLS;

  // register all workers
  var worker = new Worker(WORKER_INTERVAL, TARGET_URLS);

  // init all probes
  worker.init();
  worker.update();

  // start all workers
  setInterval(worker.update.bind(worker), WORKER_INTERVAL);
});