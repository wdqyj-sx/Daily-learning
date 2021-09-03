//被观察者
class Subject {
  constructor(name) {
    this.name = name
    //被观察者状态
    this.state = '笑'
    this.observers = []
  }
  //关联观察者
  attach(o) {
    this.observers.push(o)
  }
  //状态改变
  setState(newState) {
    this.state = newState
    //通知观察者状态改变了
    this.observers.forEach((o) => {
      o.updata(this.name, newState)
    })
  }
}

//观察者
class Observer {
  updata(name, newState) {
    console.log(name + newState + '了')
  }
}

//创建被观察者
let baby = new Subject('宝宝')
//创建观察者
let mother = new Observer()
let father = new Observer()

//关联观察者
baby.attach(mother)
baby.attach(father)
//改变状态
baby.setState('哭')
baby.setState('闹')
