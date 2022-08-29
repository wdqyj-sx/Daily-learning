// 小顶堆 小顶堆 小顶堆
class Heap {
    constructor (data) {
      this.data = data; // 数组结构
      this.heapify(); // 初始化data为一个堆
    }
  
    heapify() {
      if (this.size() < 2) return;
      for (let i = 1; i < this.size(); i++) {
        this.bubbleUp(i);
      }
    }
  
    size() { // 大小
      return this.data.length;
    }
  
    peek() { // 查看堆元素
      if (!this.size()) return null
      return this.data[0];
    }
  
    offer(val) { // 插入元素
      this.data.push(val);
      this.bubbleUp(this.size() - 1); // 上浮调整
    }
  
    poll() { // 弹出元素
      if (!this.size()) return null;
      if (this.size() === 1) return this.data.pop(); // 弹出堆顶元素
      const res = this.data[0];
  
      // 堆尾元素填充到堆顶
      this.data[0] = this.data.pop();
      this.bubbleDown(0);
      return res;
    }
  
    swap(i, j) {
      if (i === j) return;
      [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }
  
    // 上浮调整
    bubbleUp(index) { // index: 要调整的元素的下标
      while (index > 0) { // index === 0 时： 到了跟节点了
        let parentIndex = (index - 1) >> 1; // 右移一位： 除2，下取整。
        if (this.data[index] > this.data[parentIndex]) break;
        this.swap(index, parentIndex);
        index = parentIndex;
      }
    }
  
    // 下沉调整
    bubbleDown(index) { // index：要调整的节点下标
      let lastIndex = this.size() - 1;
  
      while (index < lastIndex) {
        let leftIndex = 2 * index + 1;
        let rightIndex = 2 * index + 2;
  
        let findIndex = index; // 父和两个子节点中最小的下标
        if (this.data[leftIndex] < this.data[findIndex]) findIndex = leftIndex;
        if (this.data[rightIndex] < this.data[findIndex]) findIndex = rightIndex;
        // findIndex 就是父和两个子节点中最小的下标了
  
        if (index === findIndex) break; // 调整到合适的位置的了，不需要交换了
        this.swap(index, findIndex);
        index = findIndex;
      }
    }
  }
  
  let arr = [10, 12, 1, 14, 6, 5, 8, 15, 3, 9, 7];
  let minHeap = new Heap(arr);
  console.log(minHeap.poll())
  console.log(minHeap.poll())
  minHeap.offer(4)
  minHeap.offer(16)
  console.log(minHeap.data);