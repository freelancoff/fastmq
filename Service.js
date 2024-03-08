const express = require('express')
const fetch = require('node-fetch')
const MemcachedClient = require('./MemcachedClient')

const delegateMiddleware = require('./middleware/delegate')
class Service  {
    constructor({port, serviceName, memcachedURL = '127.0.0.1:11211'}) {
        this._port = port
        this._serviceName = serviceName
        this._memcachedURL = memcachedURL
        this._memcachedClient = new MemcachedClient(this._memcachedURL)
        this._RPCEvents = {}
        this._serviceHttp = express()
    }
    start() {
        try {
            this._serviceHttp.use(express.json())
            this._createRPCHandler()
            this.serverStatus = this._serviceHttp.listen(this._port)
            this._memcachedClient.connect()
            this._addServiceToMemcached()
            console.log(`-------The service ${this._serviceName} started successfully-------`)
            return true
        } catch (error) {
            console.log(`-------ERROR CODE: ${error.code}-------`)
            console.log(`-------ERROR MESSAGE:${error.message}-------`)
            return false
        }
    }
    on (eventName, handler) {
        this._RPCEvents[eventName] = handler
    }
    async emit(eventName, serviceName, action) {
        try {
            const servicePort = await this._memcachedClient.get(serviceName)
            const serviceURL = `http://127.0.0.1:${servicePort}/json-rpc`
            const response = await fetch(serviceURL, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({eventName, action})
            })
            const responseJSON = await response.json()
            return responseJSON
        } catch (error) {
            console.log(`-------ERROR CODE: ${error.code}-------`)
            console.log(`-------ERROR MESSAGE:${error.message}-------`)
        }
    }

    _createRPCHandler() {
        this._serviceHttp.post('/json-rpc', (req, res) => {
            const requestBody = req.body
            if (!requestBody.eventName) {
                return res.status(400).json({message: 'Eventname is required'})
            }
            if (!requestBody.action) {
                return res.status(400).json({message: 'Action (body) is required'})
            }
            return this._RPCEvents[requestBody.eventName](req, res, requestBody)
        })
    }
   async _addServiceToMemcached() {
       const setResult = await this._memcachedClient.add(this._serviceName, this._port.toString(), 0)
       if (!setResult) {
            throw new Error(`Erorr to add service to memcached`)
        }
    }

    get use() {
        return this._serviceHttp.use.bind(this._serviceHttp)
    }

    get post() {
        return this._serviceHttp.post.bind(this._serviceHttp)
    }

    get get() {
        return this._serviceHttp.get.bind(this._serviceHttp)
    }

    get put() {
        return this._serviceHttp.put.bind(this._serviceHttp)
    }

    get delete() {
        return this._serviceHttp.delete.bind(this._serviceHttp)
    }
    close() {
        this.serverStatus.close()
        this._memcachedClient.del(this._serviceName)
    }
}

module.exports = Service
