
const employees = [
  { id: 201, name: "Amit", salary: 45000, department: "IT" },
  { id: 202, name: "Neha", salary: 60000, department: "HR" },
  { id: 203, name: "Rahul", salary: 75000, department: "IT" },
  { id: 204, name: "Pooja", salary: 30000, department: "Sales" }
];

let ItDepart=employees.filter((employee=>employee.department==='IT'))
console.log("employees from IT department : ",ItDepart)

let salary1=employees.find(employee=>employee.salary===30000)
console.log("Employee salary with 30000 : ",salary1)

let salary=employees.map((employee)=>{
  return {salary:employee.salary+0.1*employee.salary}})
console.log("netSalary of employees: ",salary)

let totalSalary=employees.reduce((acc,employee)=>acc+employee.salary,0)
console.log("Total salary payout : ",totalSalary)

let emp=employees.findIndex(employee=>employee.name==='Neha')
console.log("employee Neha Index : ",emp)
