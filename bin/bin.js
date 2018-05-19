const http = require('http');
const cluster = require('cluster');

const numCPUs = require("os").cpus().length;

const app = require('../app');

const pkg = require('../package');

const debug = require('../lib/debug');

const isDebug = process.env.DEBUG === "debug";

if (isDebug) {
    debug("Debug Mode");
    http.createServer(app.callback()).listen(port);
} else {
    console.info("Production Mode");
    if (cluster.isMaster) {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on("exit", (worker, code, signal) => {
            console.error(`worker ${worker.process.pid} died, exit code is ${code}`);
        });
    } else {
        http.createServer(app.callback()).listen(3000);
    }
}