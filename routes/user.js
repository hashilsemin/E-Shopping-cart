var express = require('express');
const session = require('express-session');
const { response } = require('../app');
var router = express.Router();
const productHelper=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.userLoggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/',async function(req, res,next) {
  let user=req.session.user
  let cartCount=null
  if(req.session.user){
   cartCount= await userHelpers.getCartCount(req.session.user._id)
  }
  let smartPhone= await productHelper.getSmartphone()
  let laptop= await productHelper.getLaptop()
  let Hearphone= await productHelper.getHearphone()
  productHelper.getAllProducts().then((products)=>{
    console.log(cartCount);
    res.render('user/view-products',{laptop,Hearphone,products,user,cartCount,smartPhone,home:true}  );
  })
});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
    }else{
    res.render('user/login',{'loginErr':req.session.userLoginErr})
     req.session.userLoginErr=false
  }
    })
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  console.log(req.body)
  userHelpers.doSignup(req.body).then((response)=>{
    
    
    req.session.user=response
    req.session.userLoggedIn=true
    res.redirect('/')
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
   
      req.session.user=response.user
      console.log( req.session.user);
      req.session.userLoggedIn=true
      res.redirect('/')
    }else{
      req.session.userLoginErr=true
      res.redirect('/login')
    }
  })
 
  })
 router.get('/logout',(req,res)=>{
   req.session.user=null
   req.session.userLoggedIn=false
   res.redirect('/')
 } )
 router.get('/cart',verifyLogin,async(req,res)=>{
  
   let products=await userHelpers.getCartProducts(req.session.user._id)
  let totalValue=0
  if(products.length>0){
    totalValue=await userHelpers.getTotalAmount(req.session.user._id)
  }
    
  console.log(products);

   let user=req.session.user._id
   console.log(user);
   res.render('user/cart',{products,user,totalValue})
 })
 router.get('/add-to-cart/:id',(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
 })
 router.post('/change-product-quantity',(req,res,next)=>{
   console.log(req.body)
   userHelpers.changeProductQuantity(req.body).then(async(response)=>{
      response.total=await userHelpers.getTotalAmount(req.body.user)
     
     res.json(response)
   })
 })
 router.get('/product-remove/:id',(req,res)=>{
  let proId=req.params.id
  userId=req.session.user._id
 userHelpers.productRemove(proId,req.session.user._id).then(()=>{
  
   res.redirect('/cart')
 })
 })
 router.get('/place-order',verifyLogin, async(req,res)=>{
   let total=await userHelpers.getTotalAmount(req.session.user._id)
   res.render('user/place-order',{total,user:req.session.user}) 
 })
 router.post('/place-order',async(req,res)=>{
  let products=await userHelpers.getCartProductList(req.body.userId)
  let totalPrice=await userHelpers.getTotalAmount(req.body.userId) 
  userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
  
    if(req.body['payment-method']==='COD'){
      res.json({codSuccess:true})
    }else{
      userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
        res.json(response)
      })
    }
    
   })
   //console.log(req.body)
 })
 router.get('/order-placed',verifyLogin,(req,res)=>{
   res.render('user/order-placed',{user:req.session.user})
 })
 router.get('/orders',async(req,res)=>{
  let orders=await userHelpers.getOrders(req.session.user._id)
 
  res.render('user/orders',{user:req.session.user,orders})
 })
 router.get('/view-order-products/:id',async(req,res)=>{
   let products=await userHelpers.getOrdersProducts(req.params.id)
 
   res.render('user/view-order-products',{user:req.session.user,products})
 })
router.post('/verify-payment',(req,res)=>{
  userHelpers.verifyPayment(req.body).then(()=>{
    
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log('sucesssssssssss');
      res.json({status:true})

    })

  }).catch((err)=>{
    console.log('faileddddddddd');
    res.json({status:false,errMsg:''})
  })

})
router.get('/moreDetails/:id',async(req,res)=>{
  let details=await userHelpers.getDetails(req.params.id)
console.log(details);
    res.render('user/moreDetails',{details,user:req.session.user}) 

})
router.post('/order-cancel',async(req,res)=>{
  
  console.log(req.body['id']);
      userHelpers.OrderCancel(req.body['id']).then(()=>{
     
        res.json({status:true})
      })

 
})

module.exports = router;
