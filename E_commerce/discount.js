  // Available coupons
    const coupons = {
   'WELCOME10': { type: 'percentage', value: 10, minAmount: 1000 },
    'FLAT500': { type: 'flat', value: 500, minAmount: 5000 },
    'ELECTRONICS20': { type: 'percentage', value: 20, minAmount: 10000, category: 'electronics' }
     };
                          
     // TODO: Implement these functions
                          
   export function validateCoupon(couponCode, cartTotal, cartItems) {

  // 1. Check if coupon exists
  let coupon = coupons[couponCode];

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  // 2. Check minimum amount requirement
  if (cartTotal < coupon.minAmount) {
    return { valid: false, message: "Cart total is less than minimum required amount" };
  }

  // 3. Check category requirement (if any)
  if (coupon.category) {
    let hasCategory = cartItems.some(item => item.category === coupon.category);

    if (!hasCategory) {
      return { valid: false, message: "Coupon not applicable for this category" };
    }
  }

  // Coupon valid
  return { valid: true, message: "Coupon applied successfully" };
}
                          
  export function calculateDiscount(couponCode, cartTotal) {
  // Calculate discount amount based on coupon type
  let discount=0;
  if(couponCode==='WELCOME10'){
    return discount=cartTotal*0.1;
  }
  else if(couponCode==='FLAT500'){
    return discount=500;
  }
  else if(couponCode==='ELECTRONICS20'){
    return discount=cartTotal*0.2;
  }
  else{
    return discount=0;
  }
  // Return discount amount
   }
                          
   export function applyDiscount(cartTotal, couponCode, cartItems) {

  let discount = 0;

  // 1. Validate coupon
  let validation = validateCoupon(couponCode, cartTotal, cartItems);

  // 2. If invalid
  if (!validation.valid) {
    return {
      originalTotal: cartTotal,
      discount: 0,
      finalTotal: cartTotal,
      message: validation.message
    };
  }

  // 3. Calculate discount
  discount = calculateDiscount(couponCode, cartTotal);

  // 4. Return final result
  return {
    originalTotal: cartTotal,
    discount: discount,
    finalTotal: cartTotal - discount,
    message: "Discount applied successfully"
  };
}

