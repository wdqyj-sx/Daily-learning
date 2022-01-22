# Daily learning
 * 记录一下每日学习的笔记，投资自己

    ## [个人博客](https://wdqyj-sx.github.io/)
 ## node
  * 记录node的学习历程
  ### 高阶函数(2021-8-30)
    * 给函数进行扩展，可以使用高阶函数，在函数执行前，先执行一些操作
  ### 函数柯里化
    * 通用的函数柯里化写法
  ### 发布订阅模式和观察者模式 
  ### Promise基本实现（2021-9-4）
    * Pormise是一个类，无需考虑兼容性
    * 使用Promise会传入一个执行器(executor)，执行器是立即执行
    * 当前executor给了两个函数来操作当前状态，Promise有三个状态，成功态，失败态，等待态，默认等待态，执行resolve，进入成功态，执行reject进入失败态
    * 每个Promise实例都有一个then方法
    * Promise状态改变，不能更改
  ### Promise链式调用实现(2021-9-6)
    * promise异步问题
        - 发布订阅模式
    * Promise的链式调用，当调用then方法之后会返回一个新的Promise对象
        - then方法返回一个普通值的话，会作为外层then的成功结果执行
        - then方法执行出错，会作为外层then的失败结果执行
        - then方法返回一个promise对象，则根据Promise中的状态来决定走成功还是走失败