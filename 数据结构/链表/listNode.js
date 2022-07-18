class Node {
    constructor(value,next = null){
        this.value = value
        this.next = next
    }
}

function ListNode(){
    let head = new Node(1)
    head.next = new Node(2)
    head.next.next = new Node(3)
    let p = head 
    let ret = ''
    while(p){
        ret += `${p.value} =>`
        p = p.next;
    }
    ret += null
    console.log(ret)
}

// ListNode()
function ListNode2(){
    let data = []
    let next = []
    function addNode(ind,p,val){
        data[p] = val
        next[p] = next[ind]
        next[ind] = p
    }
    let hand = 3;
    data[hand] = 'a'
    addNode(3,5,'b')
    addNode(5,4,'c')
    addNode(4,3,'a')
    
}
ListNode2()