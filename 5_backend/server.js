//create HTTP server
import express from 'express'
const app=express()

//use body parser 
app.use(express.json())

//set a port number
const port=3000

//assign port number to HTTP server
app.listen(port,()=>console.log(`server running on port  ${port}...`))
/*
//test data (replace this test data with DB)
let users=[]

//Create API(REST API -Representational State Transfer)
   //Route to handle GET req of Client(http://localhost:3000/users)

   app.get('/users',(req,res)=>{
    res.json({message:"all users",payload:users})
   })

   //Route to handle POST req of Client
   app.post('/users',(req,res)=>{

    const newUser=req.body
    users.push(newUser)
    res.json({message:"user created."})
   })

   //Route to handle PUT req of Client
   app.put('/users',(req,res)=>{
    
      //get modified user from client
      let modifiedUser=req.body
      //get index of existing user in users array
      let index=users.find(userObj=>userObj.id===modifiedUser.id)
      //user not found
      if(index){
         return res.json({message:"user not found"})
      }
      //update user with index
      users.splice(index,1,modifiedUser)
      //send res
      res.json({message:"User updated."})

   })

   //Route to handle DELETE req of Client
   app.delete('/users/:id',(req,res)=>{

      //get id of user from url parameter
      let idOfUrl=Number(req.params.id)
      //find index of user
      let index=users.findIndex(userObj=>userObj.id===idOfUrl)
      //if user not found
      if(index===-1){
         return res.json({message:"user not found"})
      }
      //delete user by index
      users.splice(index,1)

    res.json({message:"user deleted"})
   })
//route to handle user by id
app.get('/users/:id',(req,res)=>{
    //get user if from url param
    let idOfUrl=Number(req.params.id)
    //find user
    let user=users.find(userObj=>userObj.id===idOfUrl)
    ///if user not found
    if(user===undefined){
      return res.json({message:"user not found"})
    }
    //send res
    res.json({message:"a user",payload:user})

   })*/
   
   




   let products=[]
   //read all products
   app.get('/products',(req,res)=>{
      res.json({message:"All products",payload:products})
   })

   //create a new product
   app.post('/products',(req,res)=>{
      const product=req.body
      products.push(product)
      res.json({message:"product added"})
   })

   //read all product by brand 
   app.get('/products/:brand',(req,res)=>{
      let brandOfUrl=req.params.brand

      let product=products.find(productObj=>productObj.brand===brandOfUrl)

      if(product===undefined){
         return res.json({message:"product not found"})
      }

      res.json({message:"By brand",payload:product})
   })

   //update a product
   app.put('/products',(req,res)=>{
      let newProduct=req.body

      let index=products.findIndex(productObj=>productObj.id===newProduct.id)

      if(index===-1){
         return res.json({message:"product not found"})
      }

      products.splice(index,1,newProduct)

      res.json({message:"product updated."})
   })

   //delete a product by id
   app.delete('/products/:productId',(req,res)=>{
      let idOfUrl=Number(req.params.productId)

      let index=products.findIndex(productObj=>productObj.productId===idOfUrl)

      if (index)
      {
         return res.json({message:"product not found"})
      }

      products.splice(index,1)

      res.json({
         message:"product deleted"
      })
   })