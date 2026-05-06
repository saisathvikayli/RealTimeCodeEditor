class Employee{
  //private members
  #eno;
  #name;

  //constructor
  constructor( eno, name){
    this.#eno=eno;
    this.#name=name;

  }
  getData(){
    console.log(`eno is ${this.#eno} and name is ${this.#name}`)
  }
}
let e1 = new Employee(1,'Lokesh')
console.log(e1.getData())