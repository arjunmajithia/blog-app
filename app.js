var express = require("express"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");
    
var app = express();

mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());            // should come after body-parser
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Blog Post",
//     image: "https://images.unsplash.com/photo-1530177245316-034d99cd7b4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "This is the content of the blog post"
// }, function(err, blog){
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log(blog);
//     }
// });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

// this is the index page which will show all blogs
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index", {blogs: blogs});
        }
    });
});

// this is the form page where we can enter data to create a new blog
app.get("/blogs/new", function(req, res){
    res.render("new");
});


//this will make a POST request to the index page
app.post("/blogs", function(req, res){
    
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
        {
            res.render("/blogs/new");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

// this will show a particular blog
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show", {blog: foundBlog});
        }
    });
});

// this will edit the blog
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("edit", {blog: foundBlog});
        }
    });
    
});

// this will update the blog
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// this will delete the post
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server running!");
});