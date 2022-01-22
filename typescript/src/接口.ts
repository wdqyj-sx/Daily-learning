export {}
interface Post {
    title:string,
    subtitle?:string,
  readonly  summary:string
}

const hello:Post = {
    title:'sx',
    summary:'hhaa'
}

// hello.summary = 'xx' //不可修改

//动态属性
interface Cache {
    [key:string]:string
}

const cache:Cache = {

}

cache['sx'] = 'sx'