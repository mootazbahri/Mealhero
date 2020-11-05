const oracledb = require('oracledb');
oracledb.autoCommit = true;

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('this route to test the app!');
};

exports.product_create = function (req, res) {
    product = new Product(null,req.body.name,req.body.price);
    console.log(product);
    //save_product(product);
    let connection;
    (async function(product,res) {
        try{
           connection = await oracledb.getConnection({
                user : 'mealhero',
                password : 'mealhero',
                connectString : 'localhost:1521/xe'
           });
           console.log("Successfully connected to Oracle!")
           await connection.execute(`INSERT INTO PRODUIT (ID, NAME, PRICE) VALUES (PRODUCT_S.NEXTVAL,:0, :1)`, [product.name,product.price],{ autoCommit: true });
           console.log("Successfully added product")
           res.send('product added successfully');
        } catch(err) {
            console.log("Error: ", err);
          } finally {
            if (connection) {
              try {
                await connection.close();
              } catch(err) {
                console.log("Error when closing the database connection: ", err);
              }
            }
          }
        })(product,res)
};
exports.product_getAll = function (req, res) {
    let connection;
    (async function(res) {
        try{
           connection = await oracledb.getConnection({
                user : 'mealhero',
                password : 'mealhero',
                connectString : 'localhost:1521/xe'
           });
           console.log("Successfully connected to Oracle!")
           result = await connection.execute(
            `SELECT *
             FROM PRODUIT`);
           console.log("Successfully get all the products")
           if (result.rows.length == 0) {
            //query return zero employees
            return res.send('query send no rows');
            } else {
            //send all employees
            return res.send(result.rows);
            }
        } catch(err) {
            console.log("Error: ", err);
          } finally {
            if (connection) {
              try {
                await connection.close();
              } catch(err) {
                console.log("Error when closing the database connection: ", err);
              }
            }
          }
        })(res)
};

exports.product_update = function (req, res) {
    product = new Product(req.body.id,req.body.name,req.body.price);
    console.log(product);
    let connection;
    (async function(product,res) {
        try{
           oracledb.autoCommit = true;
           connection = await oracledb.getConnection({
                user : 'mealhero',
                password : 'mealhero',
                connectString : 'localhost:1521/xe'
           });
           console.log("Successfully connected to Oracle!")
           try {
               let sql = "UPDATE PRODUIT SET NAME= :2,PRICE = :3 where ID = :1"
               const res = await connection.execute(sql, [product.id,product.name,product.price], {
                autoCommit: true
              })
            console.log(res)
            } catch (exception) {
                console.log(exception)
            }          
           console.log("Successfully update product!")
           return res.send('Successfully update product');
        } catch(err) {
            console.log("Error: ", err);
          } finally {
            if (connection) {
              try {
                await connection.close();
              } catch(err) {
                console.log("Error when closing the database connection: ", err);
              }
            }
          }
        })(product,res)
};

exports.product_delete = function (req, res) {
    product = new Product(req.body.id,null,null);
    //save_product(product);
    let connection;
    (async function(product,res) {
        try{
           oracledb.autoCommit = true;
           connection = await oracledb.getConnection({
                user : 'mealhero',
                password : 'mealhero',
                connectString : 'localhost:1521/xe'
           });
           console.log("Successfully connected to Oracle!")
           result = await connection.execute(
            "DELETE FROM PRODUIT where id = :1" ,[product.id], {
                autoCommit: true
              }); 
           console.log(result)
           console.log("Successfully delete product!")
           return res.send('Successfully delete product');
        } catch(err) {
            console.log("Error: ", err);
          } finally {
            if (connection) {
              try {
                await connection.close();
              } catch(err) {
                console.log("Error when closing the database connection: ", err);
              }
            }
          }
        })(product,res)
};

class Product {
    constructor(id,name, price) {
      this.id = id;
      this.name = name;
      this.price = price;
    }
}