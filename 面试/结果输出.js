var test = (function() {
    var num = 0
    return () => {
        return num++
    }
  }())
  for (var i = 0; i < 20; i++) {
    test()
  }
  console.log(test());