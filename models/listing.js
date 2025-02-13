const mongoose =require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema= new Schema({
    title: {
        type:String,
        required : true,
    },
    description:String,
    image: {
        type: String,
        default:
            "https://i0.wp.com/picjumbo.com/wp-content/uploads/luxury-villa-in-bali-above-a-flowing-river-and-waterfall-free-photo.jpeg?w=600&quality=80",
        set: (v)=> v ==="" ? "https://i0.wp.com/picjumbo.com/wp-content/uploads/luxury-villa-in-bali-above-a-flowing-river-and-waterfall-free-photo.jpeg?w=600&quality=80" : v,
    },
    price : Number,
    location : String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review",
        },
    ],
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{ $in: listing.reviews}});
    }
})
 const Listing = mongoose.model("Listing",listingSchema);
 module.exports= Listing;