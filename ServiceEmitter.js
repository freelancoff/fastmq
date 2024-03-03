const {EventEmitter} = require('events')

class ServiceEmitter extends EventEmitter {
    constructor(props) {
        super(props);
    }
}

module.exports = ServiceEmitter
