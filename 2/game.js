/*A function can 
*Store in a variable;
*Passed as a arg;
*returns a function 
let createGame=function(nameOfPlayer){
   return function(level){
  console.log(`Hello ${nameOfPlayer}, You are at level ${level}`)
}
}
let createLevel=createGame("Ravi")
createLevel(1)
createLevel(2)
createLevel(3)
//reusing of createLevel multiple times

let test=function(a){
  console.log(a());
}
test(function(){
  console.log("helllooo")
})
//function can also pass as an argument

let makePayment = function(amount,paymentType){
console.log(`Payment of ${amount} started`)
paymentType()
}
let UPIPayment=function(){
  console.log("UPI payment done")
}
let cardPayment=function(){
  console.log("Card payment done")
}
makePayment(2000,UPIPayment);
makePayment(3000,cardPayment);
//callback function is a function that passed as an arg to another function

let sum=function(x){
  return function(y){
    return x+y;
  }
}
let x=sum(10);
console.log(x(20));//closure property (x can be stored temporary in heap )
//Every Javascript function as closure as default because of this closure property the variables of outside scope will be maintained temporarily even the outside function execution completes.

//Collections(pack of data)
//-Array(pack of homogenous elements)
let marks=[20,35,29,49,17]
let names=['Lokesh','Ritesh','Nagesh']
for(let v of marks){
  console.log(v);
}//names is a reference not a name of array;
// Object(pack of heterogenous properties)
let Student={
  sid:100,
  sname:"Lokesh",
  sage:19,
  course:"B.tech"
}
console.log(Student.sid);
console.log(Student['sname']);
for(let v in Student){
  console.log(v,"is",Student[v])//it returns only the attributes(keys ,not values).(OR) console.log(`${v} is ${student[v]}`)
}
// Array of objects
let emps=[
  {eno:1,name:"Bhanu"},
  {eno:2,name:"Lokesh"},
  {eno:3,name:"Sathish"}
];
for(let v of emps){
 console.log(`ename is ${v.eno} and name is ${v.name}`)
}
let student={
  rollNo:1,
  firstName:"Lokesh",
  lastName:"Vakiti",
  marks:[90,60,40,30,40],
  address:{
    city:"Hyd",
    pincode:508256
  },
  getFullName:function(){
    return this.firstName+" "+this.lastName;
  },
  averageMarks:function(){
  let sum=0;
  for(let i=0;i<this.marks.length;i++){
    sum+=this.marks[i];
  }
  return sum/this.marks.length;
  }
};
console.log(student.getFullName());
console.log(student.averageMarks());
*/
let testArray=[10,20,30];
//Dynamic insertion
//insert at end push() method
testArray.push(40);
//insert at beginning unshift() method
testArray.unshift(1);
//insert in between based on index
testArray.splice(4,0,456);
console.log(testArray);

//Dynamic deletion
//delete at beginning shift()
let res=testArray.shift();
//delete at end using pop()
let res1=testArray.pop();
//delete in between using splice()
let res2=testArray.splice(2,3);
console.log(testArray);

//update
let res4=testArray.splice(2,1,33);



