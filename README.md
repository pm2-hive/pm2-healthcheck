## Description

PM2 module to monitor http endpoints

## Install

`pm2 install pm2-healthcheck`

## Configure

- `workerInterval` (Defaults to `2` in secs) : You can control at which interval the worker is updating the stats (minimum is `1`)
- `urls` (Defaults to `http://google.fr`): Set endpoints split by `,`

#### How to set these values ?

 After having installed the module you have to type :
`pm2 set pm2-healthcheck:<key> <value>`

e.g: 
- `pm2 set pm2-healthcheck:workerInterval 5` (every 5 seconds)
- `pm2 set pm2-healthcheck:urls "http://docs.keymetrics.io,http://pm2.keymetrics.io/"` (set two endpoints for monitor)

## Uninstall

`pm2 uninstall pm2-healthcheck`
