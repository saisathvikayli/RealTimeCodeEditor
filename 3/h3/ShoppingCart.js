const cart = [
  { id: 101, name: "Laptop", price: 60000, quantity: 1, inStock: true },
  { id: 102, name: "Mouse", price: 800, quantity: 2, inStock: true },
  { id: 103, name: "Keyboard", price: 1500, quantity: 1, inStock: false },
  { id: 104, name: "Monitor", price: 12000, quantity: 1, inStock: true }
];

let inStock = cart.filter(stock=>stock.inStock)
console.log("inStock Products are : ",inStock);

let newArray = cart.map((item) => ({
  name: item.name,
  totalPrice: item.price
}));
console.log("New Array with name and totalPrice: ", newArray);

let totalCartValue=cart.reduce((acc,cart)=>{
  return cart.quantity*cart.price},0)
console.log("Total Cart Value : ",totalCartValue)

let getDetailsMouse=cart.find((carts)=>carts.name==='Mouse')
 console.log("details of Mouse: ",getDetailsMouse)

 let findKeyboard=cart.findIndex(carts=>carts.name==='Keyboard')
 console.log("position of keyboard : ",findKeyboard)

