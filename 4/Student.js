/*//inheritance == is a relation
//ex : Student is a Person
class Person{}
class Student extends Person{}

//Car has a engine it is called as Compositon (has a ==compostion)

class Engine()
class Car{
  Engine e;
}


//object literal
let emp1={
  eno: 100,
  name: "Ravi",
  adress: {
    city:"Hyd",
    pincode:99999
  }
}

let emp2={
  eno: 200,
  name: "Bhanu",
  adress: {         //here the address of two employees have same.
    city:"Hyd",
    pincode:99999
  }
}
//Optional chaining 
let r={
  name:"Lokesh",
  eno:44
}
console.log(r.name)
console.log(r.eno)
console.log(r.marks)//undefined
console.log(r.marks?.length)//undefined
console.log(r.marks?.length??"Mark not avaialble")//Mark not available


//spread operator  {...objname} used to create copies of arrays & objects shallow copy (it does not change the nested objects or arrays)
let originalUser={
  name:"Alice",
  age:45,
  email:"anuj@gmail.com"
}

let newUser = {...originalUser};
//make change to original user
originalUser.name="Lokesh"
console.log(originalUser)
console.log(newUser)

//deep copy uses a function called structuredClone(original obj);
let person={
  name:"Lokesh",
  address:{
    city:'Hyd',
    pincode:99999
  }
}
let copyPerson=structuredClone(person)
//let copyPerson={...person}
person.address.city='chennai';
person.address.pincode=888888;
console.log(person)
console.log(copyPerson)

//Add elements/ properties while copying 
let a=[1,2,3,4]
let cpa=[...a,10,20]
console.log(a)
console.log(cpa)

//Merge
let ar=[1,2,3]
let b=[4,5,6]
let mege=[...ar,...b]
console.log(mege);

//rest parameter
//write a function that receives any no of args and return their sum
function Sum(...a){
  let sum=0;
  for(let v of a){
    sum+=v;
  }
  return sum;
}
let result=Sum(10,20,4,5,6,6,77)
console.log(result);

//using reduce()
function Sum(...a){
  return a.reduce((p,n)=>p+n)
}
let result1=Sum(10,20,4,5,6,6,77)
console.log(result1);

//Destructing(unpacking)
let arr=[1,2,3,4]
let [a,c,v,b]=arr
console.log(a,c,v,b)

//Asynchronous Javascript
setTimeout(()=>{
  console.log("Hi")
},5000)

setInterval(()=>{
  console.log("Hello")
},2000)*/

//Promise
//promise producer and promise consumer
//I'll send 10000 rupees tommorrow
console.log("Promise: I'll send 10000 rupees tommarrow")
fulfill=true
let futureCondition=true
let prom=new Promise((fulfill,reject)=>{
  setTimeout(()=>{
    if(fulfill===true){
    fulfill("I received money...");
  }else{
    reject("Ignored");
  }
  },10000)
  
})
prom.then((msg)=>console.log("messsge in then :",msg)).catch((error)=>console.log("error is :",error))


//Examples of Promises
    //Make API request
    //Hash a password
    //Creating tokens
    //Database / HTTP Libraries
    //File & Stream APIs
fetch('https://jsonplaceholder.typicode.com/users')
.then(res=>res.json())
.then(userData=>console.log(userData))
.catch()

    