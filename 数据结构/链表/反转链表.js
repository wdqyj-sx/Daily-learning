function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)    
}

let arr = [1,2,3,4,5]
let head = new ListNode(1)
head.next = new ListNode(2)
head.next.next = new ListNode(3)
head.next.next.next = new ListNode(4)
head.next.next.next.next = new ListNode(5)



 var reverseList = function(head) {
    if(!head||!head.next){
        return head
    }
    let pre = head
    second = pre.next   
    let first = reverseList(second)
    pre.next = null
    second.next = pre
    return first
};
reverseList(head)