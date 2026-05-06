const courses =["javascript","react","node","mongodb","express"];
let courseLength5=courses.filter(course=> course.length>5)
console.log("Courses with name length > 5: ",courseLength5);
let courseUpper=courses.map(course=>course.toUpperCase())
console.log("After converting courses to Uppercase: ",courseUpper)
let courseSingle=courses.reduce((acc,course)=>(acc+" | "+course).toUpperCase())
console.log("Single String : ",courseSingle)
let courseReact=courses.find(course=>course==="react")
console.log("Course : ",courseReact)
let courseNodeIndex=courses.findIndex(course=>course==="node")
console.log("Index of Node : ",courseNodeIndex);