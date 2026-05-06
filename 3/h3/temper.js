const temperatures = [32,35,28,40,38,30,42];
let tempabove35=temperatures.filter((temperature=>temperature>35))
console.log("Temperatures above 35 are : ",tempabove35);

let tempFahren=temperatures.map((temperature) => temperature*(9/5)+32)
console.log("After converting celsius to fahrenheit :",tempFahren);

let tempAvg=temperatures.reduce((accumulator,temperature)=>(accumulator+temperature))
console.log("Average temperature : ",tempAvg/temperatures.length);

let tempFirst=temperatures.find(temperature => temperature>40)
console.log("First temperature : ",tempFirst);

let tempIndex28=temperatures.findIndex(temperature => temperature===28)
console.log("Temperature of 28 at index : ",tempIndex28);

