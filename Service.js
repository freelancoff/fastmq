const ServiceEmitter = require('./ServiceEmitter')
const express = require('express')


class Service extends ServiceEmitter {
    constructor(props) {
        super(props);
        this.port = props.port
        this.serviceName = props.serviceName
        this.memcachedURL = props.memcachedURL
        this.serviceApp = express()
    }
    start() {
        try {
            this.serviceApp.start()
        } catch (error) {
            console.log(`-------ERROR CODE: ${error.code}-------`)
            console.log(`-------ERROR MESSAGE:${error.message}-------`)
        }
    }
}
