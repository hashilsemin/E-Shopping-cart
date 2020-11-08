const { response } = require('express');
var express = require('express');
const { render } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{admin:true,products}  );
  })
  
  
});
router.get('/add-product',function(req,res){
  res.render('admin/add-products')
})
router.post('/add-products',(req,res)=>{
console.log(req.body)
console.log(req.files.Image);

productHelpers.addProduct(req.body,(id)=>{
  
  let image=req.files.Image
  image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
    if(!err){
      res.render('admin/add-products')
    }
    else{
      console.log(err);
    }
  }  )
  res.render("admin/add-products")
})

})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})
router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  console.log(req.params.id);
   productHelpers.updateProduct(req.params.id,req.body).then(()=>{
     res.redirect('/admin')
     if(req.files.Image){
       let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')

     }
   })
})
router.get('/register',(req,res)=>{
res.render('admin/register')
})
router.post('/register',)
module.exports = router;
