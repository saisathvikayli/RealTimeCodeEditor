const marks=[78,92,35,88,40,67]

let passMarks=marks.filter(marks=>marks>=40)

console.log("Passed  Marks: ",passMarks)

let add5Each=marks.map(marks=>marks+5)

console.log("After adding 5 grace marks to each Student: ",add5Each)

let highMark=marks.reduce((acc,mark)=>{
  if(acc<mark){
    acc=mark
  }
  return acc;
})
console.log("Highest Marks: ",highMark)

let below40=marks.find(mark=>mark<40)
console.log("first mark below 40 :",below40)

let Index92=marks.findIndex(mark=>mark===92)
console.log("Index of 92 : ",Index92)