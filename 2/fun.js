function test(){
  return 100
}
console.log(test())//know the value
let result=test();//Access the value

//function expression
let test1=function(){
  return 100
}
let result1=test1()
console.log(result1);


let test2=function(){
  return function(){
    return 100
  }
}
let result2=test2()
console.log(result2());//function returns a function 


