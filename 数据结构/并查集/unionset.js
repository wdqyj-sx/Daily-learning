//特点，创建方便，查找复杂
class UnionSet1{
    constructor(n=100){
        this.n = n
        this.color = new Array(n)
        this.init(n)
    }
    init(){
        for(let i = 0;i<this.n;++i){
            this.color[i] = i
        }
    }
    //查找x属于哪个集合
    find(x){
        return this.color[x]
    }
    //合并两个集合
    merge(a,b){
        const colorB = this.color[b]
        for(let i = 0;i<this.n;i++){
            if(this.color[i] === colorB){
                this.color[i] = this.color[a]
            }
        }
    }
    //判断a,b属于哪个集合
    query(a,b){
        return this.find(a) === this.find(b)
    }

}
//优化查找的复杂程度
class UnionSet2{
    constructor(n = 100){
        this.n = n
        this.father = new Array(n)
        this.init()
    }
    init(){
        for(let i = 0;i<this.n;i++){
            this.father[i] = i
        }
    }
    //查找根节点
    find(x){
        if(this.father[x] === x) return x
        return   this.find(this.father[x])
    }
    //把b合并到a
    merge(a,b){
        const fa = this.find(a)
        const fb = this.find(b)
        if(fa === fb) return 
        this.father[fb] = fa
    }
    //查询a,b是否属于同一节点
    query(a,b){
         return this.find(a) === this.find(a)
    }
}
//优化查找操作的复杂度
class UnionSet3{
    constructor(n=100){
        this.n = n
        this.father = new Array(n)
        this.size = new Array(n)
        this.init(n)
    }
    init(n){
        for(let i = 0;i<n;++i){
            this.father[i] = i
            this.size[i] = 1
        }
    }
    find(a){
        return this.father[a] === a?a:this.find(this.father[a])
    }
   merge(a,b){
        const fa = this.find(a)
        const fb = this.find(b)
        if(fa === fb) return 
        if(this.size[fa] < this.size[fb]){
            this.father[fa] = fb
            this.size[fb] +=this.size[fa]
        }else {
            this.father[fb] = fa
            this.size[fa] += this.size[fb]
        }
   }
   query(a,b){
    return this.find(a) === this.find(b)
   }
}
//带路径压缩
// 带路径压缩
class UnionSet4 {
    constructor (n = 100) {
      this.n = n;
      this.father = new Array(n); // father[i] : i 这个节点的父节点是谁 // 节点结束 0 ~ i
      this.size = new Array(n); // 每个集合的节点数量
      this.init(n);
    }
    init(n) {
      for (let i = 0; i < n; i++) {
        this.father[i] = i;  // 所有元素的父节点初始化为自己
        this.size[i] = 1;
      }
    }
    // 查找“根”节点
    find(x) {
      if (this.father[x] === x) return x;
      let root = this.find(this.father[x]);
  
      // 将x节点直接挂到根节点上
      this.father[x] = root;
      return root;
    }
    // 把b合并到a
    merge(a, b) {
      const fa = this.find(a);
      const fb = this.find(b);
      if (fa === fb) return;
      if (this.size[fa] < this.size[fb]) {
        this.father[fa] = fb; // 把 a 挂到 b 上面
        this.size[fb] += this.size[fa];
      } else {
        // 把 b 挂到 a 上面
        this.father[fb] = fa;
        this.size[fa] += this.size[fb];
      }
      // this.father[fb] = fa;
    }
    query(a, b) {
      return this.find(a) === this.find(b)
    }
  }
  // 模版
class UnionSet {
    constructor (n = 100) {
      this.father = new Array(b);
      this.init(n);
    }
    // 将各元素的父节点指向自己
    init() {
      for (let i = 0; i < n; i++) this.father[i] = i;
    }
    // 递归查找父节点； 将当前元素的直接指向根元素
    find(x) {
      return this.father[x] = (this.father[x] === x ? x : this.find(this.father[x]));
    }
    // 将 a 的根节点挂到b的根节点下面
    merge(a, b) {
      this.father[this.find(a)] = this.find(b);
    }
    // 判断a,b的根节点是否相同
    query(a, b) {
      return this.find(a) === this.find(b);
    }
  }
function test() {
    const unionSet = new UnionSet3();
    unionSet.merge(3, 1);
    unionSet.merge(1, 4);
    console.log(`1属于集合 ${unionSet.find(1)}`);
    console.log(`4属于集合 ${unionSet.find(4)}`);
    console.log(`6属于集合 ${unionSet.find(6)}`);
    console.log(`3、4属于一个集合 ${unionSet.query(3, 4)}`);
    console.log(`3、6属于一个集合 ${unionSet.query(3, 6)}`);
  }
  test();