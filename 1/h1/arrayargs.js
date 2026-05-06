let sum=function(arr){
  let sum=0;
  for(let i=0;i<arr.length;i++){
    sum+=arr[i];
  }
  return sum;
}
let b=[10,30,28,25];
console.log(sum(b));