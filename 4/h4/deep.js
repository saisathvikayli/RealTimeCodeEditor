 const order = {
                  orderId: "ORD1001",
                  customer: {
                    name: "Anita",
                    address: {
                      city: "Hyderabad",
                      pincode: 500085
                    }
                  },
                  items: [
                    { product: "Laptop", price: 70000 }
                  ]
                };
  let CopyOrder=structuredClone(order);
  CopyOrder.customer.address.city="Chennai";
  CopyOrder.items[0].price="100000";
  console.log(order)
  console.log(CopyOrder)
  //here the original object remains unchanged