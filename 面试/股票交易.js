var maxProfit = function(prices) {
    let profit = []
    for(let i = 0;i<prices.length-1;++i){
        profit.push(  Math.max(... prices.slice(i+1)) -  prices[i] )
    }
    let i = Math.min(...profit)
    if(i>0){
        return i
    }
    else return 0
};

maxProfit([7,1,5,3,6,4])