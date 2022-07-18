//普通队列
class Queue{
    constructor(n){
        this.arr = new Array(n)
        this.head = this.tail = 0
    }
}
//入队
Queue.prototype.enqueue = function(val){
    if(this.full()){
        return ;
    }
    this.arr[this.tail] = val
    this.tail++
}
//出队
Queue.prototype.dequeue = function(){
    if(this.empty()) return;
    this.head+=1
}
//查看队首元素
Queue.prototype.front = function(){
    if(this.empty()) return;
    return this.arr[this.head]
}
//队列满

Queue.prototype.full = function(){
    return this.tail === this.arr.length
}
//空队列
Queue.prototype.empty = function(){
    return this.head === this.tail
}

//队列元素个数
Queue.prototype.size = function(){
    return this.tail - this.head
}
//打印队列
Queue.prototype.output = function(val){
    return this.arr.slice(this.head,this.tail)
}

function test(opts, vals) {
    let queue = new Queue(5);
  
    for (let i = 0; i < opts.length; i++) {
      switch (opts[i]) {
        case 'insert':
          queue.enqueue(vals[i]);
          break;
        case 'front':
          console.log(`front element: ${queue.front()}`);
          break;
        case 'dequeue':
          queue.dequeue();
          break;
        case 'size':
          console.log(`queue size: ${queue.size()}`);
          break;
        default:
          break;
      }
      console.log(queue.output());
    }
  }
  
  let opts = ['insert', 'insert', 'insert', 'front', 'insert', 'insert', 'insert', 'insert', 'dequeue'];
  let vals = [1, 2, 3, '', 4, 5, 6, 7, ''];
  test(opts, vals)