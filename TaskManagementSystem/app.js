import {addTask,getAllTasks} from './task.js'

addTask("Eating","high",'2024-12-12')
let task2=addTask("Sleeping","high",'2027-12-12')
console.log(task2);
let rs=getAllTasks()
console.log(rs);