
const Service = require('./Service')

// import middlewares
const delegateMiddleware = require('./middleware/delegate')
const memcachedMiddleware = require('./middleware/memcached')
const express = require('express')
class Gateway extends Service {
    constructor({port, memcachedURL = '127.0.0.1:11211'}) {
        super({serviceName: 'gateway', port, memcachedURL});
        this.use(express.json())
        this.use(memcachedMiddleware(memcachedURL))
        this.use(delegateMiddleware())
    }
}

module.exports = Gateway