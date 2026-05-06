const employees=[
  {
    eno:101,
    name:'Ravi',
    marks:[78,82,91],
  },
  {
    eno:102,
    name:'Bhanu',
    marks:[65,70,68],
  },
  {
    eno:103,
    name:'Sneha',
    marks:[88,92,95]
  },
  {
    eno:104,
    name:'Kiran',
    marks:[55,60,58],
  },
  {
    eno:105,
    name:'Anitha',
    marks:[90,85,87],
  },
];
employees.splice(1,0,{eno:202,name:'Lokesh',marks:[90,96,97]});//insert at 2nd position
for(v in employees){
    if(employees[v].name==='Kiran'){
      employees.splice(v,1);
    }
}
console.log(employees)//delete where name was 'Kiran'
for (v in employees) {
  if (employees[v].name === 'Sneha') {
    employees[v].marks.splice(employees[v].marks.length - 1, 1, 75);
  }
}
console.log(employees)//update where name is 'Sneha' and marks from 95 to 75;
