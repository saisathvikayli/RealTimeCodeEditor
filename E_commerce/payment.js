import { reduceStock } from './product.js';
import { getCartItems, getCartTotal, clearCart } from './cart.js';
import { applyDiscount } from './discount.js';
                          
// TODO: Implement these functions
                          
export function processPayment(paymentMethod, couponCode = null) {

  // 1. Get cart items and total
  let items = getCartItems();
  let subtotal = getCartTotal();

  let discount = 0;
  let total = subtotal;

  // 2. Apply discount if coupon provided
  if (couponCode) {
    let result = applyDiscount(subtotal, couponCode, items);
    discount = result.discount;
    total = result.finalTotal;
  }

  // 3. Validate payment method
  if (!validatePaymentMethod(paymentMethod)) {
    return {
      status: "failed",
      message: "Invalid payment method"
    };
  }

  // 4. Process payment (simulation)
  let paymentStatus = "success";

  // 5. Reduce stock
  for (let item of items) {
  reduceStock(item.productId, items.quantity);
 }
  // 6. Clear cart
  clearCart();

  // 7. Generate order summary
  return {
    orderId: "ORD" + Date.now(),
    items: items,
    subtotal: subtotal,
    discount: discount,
    total: total,
    paymentMethod: paymentMethod,
    status: paymentStatus,
    message: "Payment successful"
  };
}
                          
export function validatePaymentMethod(method) {
  if(!method){
     return "Invalid Payment"
  }
  else{
    if(method==='card'){
      return true;
    }
    else if(method==='upi'){
      return true;
    }
    else if(method==='cod'){
      return true
    }
  }
// Check if method is valid (card/upi/cod)
}
                          
function generateOrderId() {
 // Generate random order ID
  return 'ORD' + Date.now();
}

