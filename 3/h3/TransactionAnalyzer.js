
const transactions = [
  { id: 1, type: "credit", amount: 5000 },
  { id: 2, type: "debit", amount: 2000 },
  { id: 3, type: "credit", amount: 10000 },
  { id: 4, type: "debit", amount: 3000 }
];

let credit=transactions.filter(transact=>transact.type==='credit')
console.log("credit transactions : ",credit)

let transact=transactions.map(transact=>transact.amount)
console.log("Only transactions amounts : ",transact)

let accBalance=transactions.reduce((acc,transaction)=>{
  if(transaction.type==='credit'){
    return acc+transaction.amount
  }
  else{
    return acc-transaction.amount
  }
},0)
console.log("account balance : ",accBalance)

let debit=transactions.find(transaction=>transaction.type==='debit')
console.log("first debit transaction : ",debit)

let transactIndex=transactions.findIndex(transaction=>transaction.amount===10000)
console.log("index of transaction 10000 : ",transactIndex)