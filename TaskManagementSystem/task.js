import {validatetitle,validatePriority,validateDueDate} from './validator.js'
let tasks=[]
function addTask(title,priority,dueDate){
    if(validatetitle(title)&&validatePriority(priority)&&validateDueDate(dueDate)){
    tasks.push({title,priority,dueDate})
      return true;
    }
    else{
      return "Invalid task"
    }
}
function getAllTasks(){
  return tasks;
}
export {addTask,getAllTasks};