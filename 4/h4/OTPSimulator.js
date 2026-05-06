console.log("OTP sent succesfully");
let i=10;
console.log("Count down started")
let timer=setInterval(()=>{
 console.log(i)
 i--;
 if(i==-1){
  console.log("Resend OTP")
  clearInterval(timer);
 }
},1000)
