import { getProductById, checkStock } from './product.js';
                          
  let cartItems = [];
                          
  // TODO: Implement these functions
                          
  export function addToCart(productId, quantity) {

  // 1. Get product details
  let productDetails = getProductById(productId);

  // 2. Check stock
  if (!productDetails || !checkStock(productId, quantity)) {
    return "Not enough stock";
  }

  // 3. Check if product already in cart
  let index = cartItems.findIndex(item => item.productId === productId);

  if (index !== -1) {
    // Product already in cart → update quantity
    cartItems[index].quantity += quantity;
  } else {
    // Add new item
    cartItems.push({
      productId: productId,
      name: productDetails.name,
      price: productDetails.price,
      quantity: quantity
    });
  }

  // 4. Success message
  return "Product added to cart";
}
                          
  export function removeFromCart(productId) {
  // Remove product from cart
  let index = cartItems.findIndex(item => item.productId === productId);
  if(!index===-1){
  cartItems.splice(index,1)
  return "removed product from cart"
   }
   return "product not found in cart"
  }
                          
  export function updateQuantity(productId, newQuantity) {

  // Get product
  let product = getProductById(productId);

  // Check if product exists
  if (!product) {
    return "Product not found";
  }

  // Check stock availability
  if (!checkStock(productId, newQuantity)) {
    return "Not enough stock";
  }

  // Find item in cart
  let index = cartItems.findIndex(item => item.productId === productId);

  if (index === -1) {
    return "Product not in cart";
  }

  // Update quantity
  cartItems[index].quantity = newQuantity;

  return "Quantity updated successfully";
}
                          
  export function getCartItems() {
  // Return all cart items with product details
  return cartItems;
  }
                          
  export function getCartTotal() {
  // Calculate total price of all items in cart
  let total=cartItems.reduce((acc,item)=>acc+(item.quantity*item.price),0)
  return total;
  // Return total
  }
                          
  export function clearCart() {
  // Empty the cart
  cartItems.length=0;
   }

