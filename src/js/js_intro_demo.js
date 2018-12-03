//write a function with weakly typed with a loop and if/else and a timeout

function foo(options) {
    if(!options) {
        console.log("no options, bye ... ");
        return;
    }
    if(options.loop) {
        for(var i=0; i < options.loop; i++){
            console.log("Loop iteration #" + (i + 1));
        }
    }
    if(loop.delay) {
        setTimeout(function() {
            console.log("Hello after " + options.delay + " sec");
        }, options.delay * 1000);
    } else {
        console.log("Hello from foo :)");
    }
}
