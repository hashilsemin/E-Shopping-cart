const { response } = require('express');
const session = require('express-session');
var express = require('express');
const { render } = require('../app');
const adminHelpers = require('../helpers/admin-helpers');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers');
const { secondAdmin } = require('../helpers/admin-helpers');
const verifyAdminLogin=(req,res,next)=>{
  if(req.session.adminLoggedIn){
    next()
  }else{
    res.redirect('/admin/adminLogin')
  }
}

/* GET users listing. */
router.get('/',verifyAdminLogin, function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    
    res.render('admin/view-products',{admin:true,products}  );
  })
  
  
});
router.get('/add-product',function(req,res){
  res.render('admin/add-products',{admin:true})
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
router.get('/register',async(req,res)=>{
  let count=await adminHelpers.secondAdmin()
  if(count){
    res.render('admin/register',{admin:true})
  }else{
    res.redirect('/admin/adminLogin')
  }

})
router.post('/register',(req,res)=>{

  
  console.log(req.body)
  adminHelpers.registerAdmin(req.body).then((response)=>{
    req.session.admin=response
    req.session.adminLoggedIn=true
    res.redirect('/admin/')
   
  })
})
router.get('/logoutAdmin',(req,res)=>{
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin/adminLogin')
} )
router.get('/adminLogin',async(req,res)=>{
  
  if(req.session.admin){
    res.redirect('/admin/')
    }else{
     
      let count=await adminHelpers.secondAdmin()
       res.render('admin/login',{'loginErr':req.session.adminLoginErr,count})
       req.session.adminLoginErr=false
    
    }
  })
    router.post('/adminLogin',(req,res)=>{
      adminHelpers.doLogin(req.body).then((response)=>{
        if(response.status){
       
          req.session.admin=response.admin
          console.log( req.session.admin);
          req.session.adminLoggedIn=true
          res.redirect('/admin/')
        }else{
          req.session.adminLoginErr=true
          res.redirect('/admin/login')
        } 
      })
     
      })
router.get('/adminOrders',async(req,res)=>{
  let orders=await adminHelpers.getOrders()
    res.render('admin/orders',{orders,admin:true})
  
})
router.get('/view-order-products/:id',async(req,res)=>{
  let products=await adminHelpers.getOrdersProducts(req.params.id)

  res.render('admin/view-order-products',{admin:true,products})
})
router.post('/order-shipped',async(req,res)=>{
  
  console.log(req.body['id']);
      adminHelpers.OrderShipped(req.body['id']).then(()=>{
     
        res.json({status:true})
      })

 
})
router.get('/adminUsers',async(req,res)=>{
  let users=await adminHelpers.getUsers()
    res.render('admin/users',{users,admin:true})
  
})
module.exports = router;
