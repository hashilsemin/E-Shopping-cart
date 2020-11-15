var db=require('../config/connection')
var collection=require('../config/collection');
const { response } = require('express');

var objectId=require('mongodb').ObjectID
module.exports={
    addProduct:(product,callback)=>{
        product.Price=parseInt(product.Price)
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data);
            callback(data.ops[0]._id)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            
            
            db.get().collection(collection.PRODUCT_COLLECTIONS).removeOne({_id:objectId(prodId)}).then((response)=>{
                //console.log(response)
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        proDetails.Price=parseInt(proDetails.Price)
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    category:proDetails.category,
                    Specification:proDetails.Specification,
                    Video:proDetails.Video
                }
            }).then((response)=>{
                resolve()
            })

        })
    },
    getSmartphone:()=>{
        return new Promise(async(resolve,reject)=>{
            let smartPhone=await db.get().collection(collection.PRODUCT_COLLECTIONS).find({category:'Smart phone'}).toArray()
            console.log(smartPhone);
            resolve(smartPhone)
        })
    },
    getLaptop :()=>{
        return new Promise(async(resolve,reject)=>{
            let laptop=await db.get().collection(collection.PRODUCT_COLLECTIONS).find({category:'Laptop'}).toArray()
         
            resolve(laptop)
        })
    },
    getHearphone :()=>{
        return new Promise(async(resolve,reject)=>{
            let Hearphone=await db.get().collection(collection.PRODUCT_COLLECTIONS).find({category:'Hearphone'}).toArray()
         
            resolve(Hearphone)
        })
    },

}