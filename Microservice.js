const Service = require('./Service')

// import middlewares
const delegateMiddleware = require('./middleware/delegate')
const memcachedMiddleware = require('./middleware/memcached')
const express = require('express')
class Microservice extends Service {
    constructor({serviceName, port, memcachedURL}) {
        super({serviceName, port, memcachedURL})
        this.use(express.json())
        this.use(memcachedMiddleware(memcachedURL))
        this.use(delegateMiddleware())
    }
}

module.exports = Microservice