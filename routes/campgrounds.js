var express=require("express");
var router=express.Router({mergeParams: true});


var Campground=require("../models/campground");
var middleware=require("../middleware");

router.get("/", function(req, res){
    
    Campground.find({},function(err,allCampgrounds)
    {if(err)
    {
        console.log(err);
    }
    else
    {
         res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user,page: 'campgrounds'});
    }
        
    });
});

router.post("/",middleware.isLoggedIn, function(req, res){
   
    var name = req.body.name;
    var image = req.body.image;
    var price=req.body.price;
    var description=req.body.description;
    var author={
      id:req.user._id,
      username:req.user.username
    };
    var newCampground = {name: name,price:price ,image: image, description:description,author:author};
   Campground.create(newCampground,function(err,newlyCreated)
   {
    if(err)
    {
        console.log(err);
    }
    else
    {
         res.redirect("/campgrounds");
    }   
       
   });
    //redirect back to campgrounds page
   
});

router.get("/new",middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground)
        {
            req.flash("error","Campground not found");
            res.redirect("back");
            
        }
        else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

router.get("/:id/edit",middleware.checkCampgroundownership,function(req, res) {
    
    
        
        
         Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
       
        
    });

    
});

router.put("/:id",middleware.checkCampgroundownership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err)
       {
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds/"+req.params.id);
       }
       
   }) ;
    
});

router.delete("/:id",middleware.checkCampgroundownership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
           
       } else{
            res.redirect("/campgrounds");
       }
        
    });
    
});






module.exports=router;