var express = require("express");
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var jimp = require("jimp");
var mongoose = require('mongoose');
var request = require('request');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine","ejs");


app.get("/",function(req,res){
    res.render("welcome");
});


app.get("/db",function(req,res){
     var obj={};
   var text=req.query.searchtext;
    //console.log(text);
    var url="https://www.google.co.in/search?q="+text+"&source=lnms&tbm=isch";
    //var y=";
   
    // database connection code
    
 var connection=   mongoose.connect('mongodb://localhost/img_scrap');
    console.log("connection successsful");
 
    
    var imgSchema = new mongoose.Schema({
    src:String
    
});
    var image=mongoose.model(text,imgSchema);
    
    request(url,function(err,respose,body){
        if(!err&&respose.statusCode==200){
            //console.log(body);
            
            //var data=JSON.parse(body);
            //console.log(data);
            $=cheerio.load(body);
            $('img').each(function(index,images){
                //console.log(images.attribs.src);
                var scrap_url=images.attribs.src;
                image.create({
                    src: scrap_url
                },function(err,result){
                    if(err){
                        console.log(err);
                        
                    }
                
                else{
                    //console.log(image);
                 // console.log("data added successfully");
                
                    
                }
                
                
                
                });
           // console.log(scrap_url);
                
            });
        
        // res.r("success",{text:text});
        
        }
    
    
    
    });   
   image.find({},function(err,result){
       if(err){
           console.log(err);
       }
       else{
        obj=Object.assign({},result);
       }
   });
   mongoose.connection.on('open', function () {
    mongoose.connection.db.listCollections().toArray(function (err, names) {
      if (err) {
        console.log(err);
      } else {
           console.log(obj);
          
          res.render("success",{list:names,text:text,result:obj});
      }

     mongoose.connection.close();
    });
});
         
});




app.listen(3000,function(){
    console.log("Scrapper app ready");
});