var sanitizer       = require("express-sanitizer"),
methodOverride      = require("method-override"),
bodyParser          = require("body-parser"),
mongoose            = require("mongoose"),
express             = require("express"),
app                 = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/whereNextApp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sanitizer());

//MONGOOSE MODEL CONFIG
var nextSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    location: String,
    keywords: String,
    created: {type: Date, default: Date.now}
});

var Next = mongoose.model("next", nextSchema);

// Seed data
// Next.create({
//     title: "testEntry",
//     image: "https://images.unsplash.com/photo-1532944037243-de78d53bdfbe?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=afdf05592bc69c52d9a500c12f513b76&auto=format&fit=crop&w=500&q=60",
//     body:   "here's somewhere to go"
// });

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/posts", function(req, res){
    Next.find({}, function(err, nexts){
        if(err){
            console.log("error!");
        } else {
            res.render("index", {nexts: nexts});
        }
    });
});
// NEW ROUTE
app.get("/posts/new", function(req, res){
    res.render("new");
}); 
// CREATE ROUTE
app.post("/posts", function(req, res){
    req.body.next.body = req.sanitize(req.post.blog.post );
    Next.create(req.body.post, function(err, newPost){
        if(err){
            res.render("new");
        } else {
            //then redirect to the index
            res.redirect("/posts");
        }
    });
});
// SHOW ROUTE
app.get("/posts/:id", function(req, res) {
   Next.findById(req.params.id, function(err, foundPost){
       if(err){
           res.redirect("/posts");
       } else {
           res.render("show", {next: foundPost});
       }
   }); 
});

// EDIT ROUTE
app.get("/posts/:id/edit", function(req, res) {
    Next.findById(req.params.id, function(err, foundPost){
           if(err){
           res.redirect("/posts");
       } else {
           res.render("edit", {next: foundPost});
       }
    });
});
// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body );
    Next.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
       if(err){
           res.redirect("/posts");
       } else {
           res.redirect("/posts/" + req.params.id);
       }
   });
});
// DELETE ROUTE
app.delete("/posts/:id", function(req, res){
    Next.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("server is running");
});