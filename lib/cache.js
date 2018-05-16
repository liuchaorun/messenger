module.exports = (prefix) => {      // 修改成函数，可自定义prefix
    let redis = require('redis');
    let Promise = require('bluebird');

    Promise.promisifyAll(redis.RedisClient.prototype);
    Promise.promisifyAll(redis.Multi.prototype);

    let client = redis.createClient();
    let commands = ['set', 'setex', 'get','getAsync','setexAsync','del','delAsync'];

    commands.forEach( function (cmd)  {
        let oldCmd = `_${cmd}`;
        client[oldCmd] = client[cmd];
        client[cmd] = function (key, arg, cb) {
            arguments[0] = `${prefix}/${arguments[0]}`;
            return client[oldCmd].apply(this, arguments);
        };
    });

    client.jsetex = (key,expire,value) => client.setexAsync(key,expire,JSON.stringify(value));//expire 默认单位为s
    client.jget = (key) => {
        return client.getAsync(key).then((res) => {
            return JSON.parse(res);
        });
    };

    return client;
};