//Advanced operations on Array => it only affect the original array.
//callback function is a function that was passed as argument of another function.
//syntax:   result=arr.method(callback function);
let testData=[90,45,-12,65,100];

//filter == Selection

let r=testData.filter((element) => element>30);
console.log(r);

let r1=testData.filter((element) => element>40 &&element<80);
console.log(r1);

//map   ==  Modification

let r2=testData.map(element => element+10)
console.log(r2);

let r3=testData.map((element)=>{
  if (element > 50){
    return element-20;
  }
  else{
    return element+10;
  }
})
console.log(r3);

//reduce == converting / reducing the array into a single value(two parameters are fixed)
// finding sum of elements.

let r4=testData.reduce((accumulator,element) =>accumulator+element)
                        //90      45     = 135
                        //135    -12     =123
console.log(r4);


//find small
 let r5=testData.reduce((accumulator,element) =>{
  if(accumulator>element){
    accumulator = element;
  }
   return accumulator;
  })
 console.log(r5)

//find big
let r6=testData.reduce((accumulator,element) =>{
  if(accumulator<element){
    accumulator =element ;
  }
  return accumulator;
  })
console.log(r6)

//find
let r7=testData.find((element) => element===90);
console.log("find(): ",r7);

//findIndex
let r8=testData.findIndex((element) => element===73);
console.log(r8);


//sort
let data = [9,10,8,4]
console.log(data.sort((a,b) => a-b));
console.log(data.toSorted((a,b) => a-b))//ascending order
console.log(data.sort((a,b) => b-a ))//descending order

//reverse
console.log(data.reverse());
