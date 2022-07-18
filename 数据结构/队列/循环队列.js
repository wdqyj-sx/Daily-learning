class Queue{
    constructor(n){
        this.arr = new Array(n)
        this.head = 0
        this.tail = 0
        this.cnt = 0
    }
    enqueue(val){
        if(this.full())return;
        this.arr[this.tail] = val
        this.tail++
        this.tail %= this.arr.length
        this.cnt++
    }
    dequeue(){
        if(this.empty())return
        this.head++
        this.head%=this.arr.length
        this.cnt--
    }
    empty(){
        return this.cnt === 0
    }
    full(){
        return this.cnt === this.arr.length
    }
    front(){
        if(this.empty())return;
        return this.arr[this.head]
    }
    size(){
        return this.cnt
    
    }
    clear(){
        this.head = this.tail = this.cnt = 0
    }
    output(){
        let temp = []
        for(let i = 0,j=this.head;i<this.cnt;i++){
            temp.push(this.arr[j])
            j++
            j %=this.arr.length
        }
        return temp
    }
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
  
  let opts = ['insert', 'insert', 'insert', 'dequeue', 'insert', 'insert', 'dequeue', 'insert', 'insert'];
  let vals = [1, 2, 3, '', 4, 5, '', 6, 7]
  test(opts, vals)