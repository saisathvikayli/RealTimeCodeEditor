function validatetitle(title){
if(!title){
  return "title required"
}
if(title.length<3){
  return "Min 3 char required"
}
return true;
}
function validatePriority(priority){
const priorities=['high','low','medium']
let result=priorities.find(prior=>prior==priority)
if(result==false){
  return false;
}
  return true

}
function validateDueDate(date){
 let dat=new Date();
 let dueDate=new Date(date);
 if(dat>=dueDate){
   return true;
 }
 else{
  return false;
 }
}
export {validatetitle,validatePriority,validateDueDate}