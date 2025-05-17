const express = require("express");
const app = express();
const port = 8080 ;
const path = require("path");
app.set("view engine" , "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));


var methodOverride = require('method-override') ;
app.use(methodOverride('_method'))


const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Mahla@5688'
});

let  getRandomUser = () =>  {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ]
};

// users = [] ;
// for(let i = 0 ; i <100 ; i++){
//   users.push(getRandomUser());
// }
// let q = "INSERT INTO user (id, username, email, password) VALUES ? " ;
// try {
//     connection.query(q , [ users ] ,(err,res)=> {
//         if(err) throw err ;
//         console.log(res);
        
// })

// } catch (error) {
//     console.log(`error: ${error}`);
    
// }




app.get("/" , (req,res)=> {
  let q = `SELECT COUNT(*) FROM user` ;
  try {
    connection.query(q ,(err,result)=> {
        if(err) throw err ;
        let count = (result[0]["COUNT(*)"]);
        res.render("home.ejs",{ count });
      }) 

  } catch (error) {
    console.log(`error: ${error}`);
    res.send("some server in error");
  }
});


app.get("/user",(req,res)=> {

  let q = `SELECT * FROM user` ;
  try {
    connection.query(q ,(err,result)=> {
        if(err) throw err ;
        let users = result ;
        res.render("user.ejs", { users }) ;
      }) 

  } catch (error) {
    console.log(`error: ${error}`);
    res.send("some server in error");
  }
});

app.get("/user/:id/edit", (req,res)=> {
  let { id } = req.params ;
  let q = `SELECT * FROM user WHERE id= '${ id }'  `;
  
  
  try {
    connection.query(q ,(err,result)=> {
        if(err) throw err ;
        let user = result[0] ;
        res.render("edit.ejs", { user }) ;
      }) 

  } catch (error) {
    console.log(`error: ${error}`);
    res.send("some server in error");
  }
});

app.patch("/user/:id",(req,res)=> {
  let { username } = req.body ;
  let {id } = req.params ;
  let { password } = req.body ;
  let q = `SELECT password FROM user WHERE ID = '${id}'`
  try {
    connection.query(q ,(err,result)=> {
        if(err) throw err ;
        let actual = (result[0].password );
        if(password == actual){
            let q = `UPDATE user SET username= '${username}' WHERE ID = '${id}' `;
            try {
            connection.query(q ,(err,result)=> {
                if(err) throw err ;
                res.redirect("/user");
              }) ;

            } catch (error) {
            console.log(`error: ${error}`);
            res.send("some server in error");
            }
        }
        else{
            res.send("Please enter the Correct Password");
          }
              }) ;
  } catch (error) {
    console.log(`error: ${error}`);
    res.send("some server in error");
  }
});



app.get("/user/new" , (req,res)=> {
  res.render("newuser.ejs"); 
})

app.post("/user/new", (req,res)=> {
    let { id , username , email , password} = req.body;
    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
    try {
        connection.query(q, (err,result)=> {
          if(err) throw err ;
          res.redirect("/user");
          }) ;

        } catch (error) {
            console.log(`error: ${error}`);
            res.send("some error in server ");
        }
});

app.delete("/user/:id" ,(req, res)=> {
  let { id } = req.params ;
  let q = `DELETE  FROM user WHERE id = '${id}'`;
  try {
    connection.query(q , (err,result)=> {
      if(err) throw err ;
      res.redirect("/user");
    })
  } catch (error) {
    console.log(`error: ${error}`);
    res.send("some error in server");
    
  }
}
); 


app.listen(port,()=> {
  console.log("app is listening to port ", port);
})

