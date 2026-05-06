let big3=function(x,y,z){
  if(x>y&&x>z){
    return x;
  }
  else if(y>z){
    return y;
  }
  else{
    return z;
  }
}
console.log(big3(10,50,25));