let search=function(key,a){
  for(let i=0;i<a.length;i++){
    if(a[i]===key){
      return i;
    }
  }
  return "not found";
}
let arr=[20,30,36,10,90];
let y=search(11,arr);
console.log(y);