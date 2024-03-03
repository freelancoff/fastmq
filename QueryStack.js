class QueryStack {
    constructor() {
        this._stack = []
    }
    push(queryElement) {
        this._stack.push(queryElement)
    }
    pop() {
        return this._stack.pop()
    }
}

module.exports = QueryStack
