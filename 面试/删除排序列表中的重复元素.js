
// //   Definition for singly-linked list.
//   function ListNode(val, next) {
//       this.val = (val===undefined ? 0 : val)
//      this.next = (next===undefined ? null : next)
//  }
 
// /**
//  * @param {ListNode} head
//  * @return {ListNode}
//  */
 var deleteDuplicates = function(head) {
    let pre = head
    let afa = head.next
    if(head == null){
        return null
    }
    while(afa!==null){
        if(pre.val === afa.val){
            afa = afa.next
        }else{
            pre.next = afa
            afa = afa.next
        }
    }
    return head
};