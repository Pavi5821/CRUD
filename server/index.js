const express =require("express");
const cors=require("cors");
const users=require("./sample.json");
const fs=require("fs");

const app=express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
    origin:"http://localhost:5176",
    methods:["GET","POST","PATCH","DELETE"],
}));
const port=8000;

//Display All Users
app.get("/users",(req,res)=>{
  return res.json(users);
});

//Delete User Detail
app.delete("/users/:id",(req,res)=>{
    let id=Number(req.params.id);
    let filterdUsers=users.filter((user)=>user.id!==id);
    fs.writeFile("./sample.json",JSON.stringify(filterdUsers),(err,data)=>{
        return res.json(filterdUsers);
    });
});

//Add new User

app.post("/users",(req,res)=>{
    let {name,age,city}=req.body;
    if(!name || !age || !city){
        res.status(400).send({message:"All Fields Required"});
    }
    let id=Date.now();
    users.push({id,name,age,city});

    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
         return res.json({"message":"User Detail added success"});
    });
})

//Update User

app.patch("/users/:id",(req,res)=>{
    let id=Number(req.params.id);
    let {name,age,city}=req.body;
    if(!name || !age || !city){
        res.status(400).send({message:"All Fields Required"});
    }
    
    let index=users.findIndex((user)=>user.id==id);

    users.splice(index,1,{...req.body});

    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
         return res.json({"message":"User Detail updated success"});
    });
})



app.listen(port,(err)=>{
    console.log(`App is running in port ${port}`)

});
