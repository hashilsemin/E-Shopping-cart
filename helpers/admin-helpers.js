var db=require('../config/connection')
var collection=require('../config/collection');
const { response } = require('express');
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID
module.exports={
registerAdmin:(admin)=>{
    return new Promise(async(resolve,reject)=>{
        admin.Password=await bcrypt.hash(admin.Password,10)
        db.get().collection(collection.ADMIN_COLLECTION).insertOne(admin).then((data)=>{
            resolve(data.ops[0])
        })
    })
},
doLogin: (adminData) => {
    return new Promise(async (resolve, reject) => {
        let status = false
        let response = {}
        let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
        if (admin) {
            bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                if (status) {
                    console.log('login sucess');
                    response.admin = admin

                    response.status = true
                    resolve(response)

                } else {
                    console.log('login failed');
                    resolve({ status: false })
                }


            })
        } else {
            console.log('login failed');
            resolve({ status: false })

        }
    })
},
 secondAdmin:()=>{
    return new Promise(async(resolve,reject)=>{
       
     let number= await db.get().collection(collection.ADMIN_COLLECTION).count().then((number)=>{
       if(number<=0){
           let count=true
           resolve(count)
       }else{
           let count=false
           resolve(count)
       }
         
    })
    })
   
  }
  
}
