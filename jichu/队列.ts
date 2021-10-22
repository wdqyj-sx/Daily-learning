class Queue {
    private items: number[] = []
    enqueue(element: number) {
        this.items.push(element)
    }
    dequeue(): number | undefined {
        return this.items.shift()
    }
}

let queue = new Queue();
queue.enqueue(1)
queue.enqueue(2)
console.log(queue.dequeue())