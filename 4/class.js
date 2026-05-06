//object literals don't need of classes
class Student{
  //properties
  #sno;
  name;
  email;
  //constructor
  constructor( sno, name, email){
    this.#sno = sno;
    this.name = name;
    this.email = email;
  }
  //methods
  getStudentName(){
    return this.name;
  }
}
//create an objects
let s1=new Student(33,'Lokesh','vakitilokesh33@gmail.com')
console.log(s1.sno)
//to make any variable private it is denoted by '#',ex:  #sno;

