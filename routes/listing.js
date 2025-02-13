const express=require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema}= require("../schema.js");

//server side validation (listing)from joi
const validateListing=(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        
        throw new ExpressError(400, error);
    }else{
        next();
    }

}

// 1..index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
})
);

//3..NEW route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//2..show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//3...create route
router.post("/", validateListing,wrapAsync(async (req, res, next) => {


    // let{title,description,image,location,price,country}=req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");

})
);

//4..edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// 4...update route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // {... spread operators}
    req.flash("success"," Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted");
    res.redirect("/listings");
}));

module.exports=router;