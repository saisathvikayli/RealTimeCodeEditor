const students = [
  { id: 1, name: "Ravi", marks: 78 },
  { id: 2, name: "Anjali", marks: 92 },
  { id: 3, name: "Kiran", marks: 35 },
  { id: 4, name: "Sneha", marks: 88 },
  { id: 5, name: "Arjun", marks: 40 }
];
let passed=students.filter(student=>student.marks>=40)
console.log("students passed",passed)

let grade=students.map(student=>{
 if(student.marks>=90){
  return 'A'
 }else if(student.marks>=75){
  return 'B'
 }
 else if(student.marks>=60){
  return 'C'
 }
 else{
  return 'D'
 }
})
console.log("Grades : ",grade)

let avgMarks=students.reduce((acc,student)=>acc+student.marks,0)
console.log("Average Marks : ",avgMarks/students.length)

let Score=students.find(student=>student.marks===92)
console.log("student who scored 92: ",Score)

let Index=students.findIndex(student=>student.name==='Kiran')
console.log("Index of Kiran : ",Index)