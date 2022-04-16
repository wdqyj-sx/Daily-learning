(function($){
    var modulea = 'module_a'
    function method1(){
        console.log(modulea)
    }
    function method2(){
        console.log('sx'+modulea)
    }
    window.moduleA = {
        method1:method1,
        method2:method2
    }
})(jQuery)