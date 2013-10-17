var MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server;
var expressValidator = require("express-validator");
var fs=require('fs');
var Converter=require("csvtojson").core.Converter;
var url= require('url');
var ObjectId = require('mongodb').ObjectID;

var mongoose = require('mongoose') , 
agent = mongoose.model('agent_s') ;

var camp= mongoose.model('campaign') , 
pb = mongoose.model('Phonebook');

exports.home = function(req, res){
    res.render('home', { title: 'Ninja Store'});
    // if user is logged in already, take them straight to the items list
};



exports.agent = function(req,res){
    res.render('agent',{title: "FlexyTab"});
};
  
exports.camp_populate = function(req,res) {
   
    camp.find({}).exec(function(err , data) {
     if(data) 
       console.log(data) ;
       res.render('camprender' , {title:'FLEXYTAB' , data : data }) ;
  });

}






exports.camp_create = function(req , res) {
  var campname = req.body.campname , campuid = req.body.campuid , create = req.body.created , enable = req.body.enabled , scrub = req.body.scrub ;

  console.log(campname+campuid+create+enable+scrub);
    
   var camp1 = new camp({ campname : campname , campuid  : campuid , created: create , scrub_ndnc : scrub , enabled : enable });

    camp1.save(function (err ) {
     if(err)
        console.log(err);
   //  else
       // console.log("no error");

       camp.find({}).exec(function(err , data) {
        console.log(data) ;  
        res.render('camprender' , {title:'FLEXYTAB' , data : data }) ;
  });
});
   
}


exports.camp_edit= function(req,res) {

      var url = req.query.id ;
      console.log("url :"+ url);
      camp.find({_id : url }).exec( function(err , data) {
        if(data!=null)
      res.render('camp_edit', { title : 'FLEXYTAB' , data : data, url : url  });

     });
}


exports.camp_update = function(req,res) {
     
     var url = req.body.url_id;
     var campname= req.body.updatecamp, campuid= req.body.updateuid, enable = req.body.enable , scrub = req.body.scrub ;
     console.log(url);

     camp.findOneAndUpdate({_id: url} , { campname : campname , campuid : campuid , enabled : enable , scrub_ndnc : scrub } , function(err) {
    if(!err) {
     camp.find({}).exec(function(err,data) {
       res.render('camprender' , { title : 'FLEXYTAB' , data : data}); });
      }

      });
}


exports.camp_delete = function(req,res) {

    var name= req.body.delid;
     console.log("to be deleted " + name );
     camp.remove({_id : name } , function(err) {
         // console.log("deleted");
        if(!err) {
            camp.find({}).exec(function(err , data ) {
                  res.render('camprender' , {title :'FLEXYTAB' , data : data }); });
            }
   });

}


exports.camp_update = function(req,res) {
     var url = req.body.url_id;
     var name= req.body.updatecamp, pb= req.body.updatepb , scrub = req.body.scrub , enable = req.body.enabled;
     console.log(url);

     camp.findOneAndUpdate({_id: url} , { campaign : name , pb_name :pb , scrub:scrub , enabled : enable} , function(err) {
    if(!err) {
     camp.find({}).exec(function(err,data) {
       res.render('camprender' , { title : 'FLEXYTAB' , data : data}); });
      }

   });

}


exports.camp_dropdown = function( req,res,next) {
    

       camp.find({},{"campuid" : true}).exec(function(err, data) {
        if(data) console.log(data);
    
       for(var i=0;i<data.length;i++)
       { 
            console.log(data[i].campuid);
        }
     res.render("csv" , { data : data});
    
     });
      

}
  
    

exports.upload = function(req,res) {

  var name = req.body.pbname , camp =req.body.camp , scrub = req.body.scrub , enable = req.body.enabled , created = req.body.dateCreate ;
   console.log(name+camp+scrub+enable+created);

   var  pb1 = new pb({campaign : camp ,pb_name : name , enabled : enable , created : created , scrub : scrub });
   pb1.save(function(err) {
      if(err)
        console.log(err) ;
      else 
        console.log("no error");
    });

    console.log(req.files);

   var oldpath = req.files.thumb.path
   var csvFileName = req.files.thumb.path
   var csvConverter = new Converter();
   csvConverter.on("end_parsed",function(jsonObj){
    console.log(jsonObj);


   MongoClient.connect("mongodb://localhost:27017/test", function(err,db) {
       if(!err)
       console.log("connected");
     for(var i=0;i<jsonObj["csvRows"].length;i++) {
      var ob=jsonObj["csvRows"][i];
       console.log(ob);
       var collection = db.collection('omg');
       collection.insert(ob, function(err ,result) { if(err) console.log(" HI ,,  i am error"); });
      }
    });
   });
   

     csvConverter.from(csvFileName);   
     pb.find({}).exec(function(err,data){
        console.log(data);
/*
    for(var i=0 ; i<data.length ; i++)
 {
       console.log(i);
        console.log(data[i].campaign);
}*/

        res.render("pbrender" ,{title : 'FLEXYTAB', data : data});
     });
  
}



exports.pb_populate = function(req,res) {

    pb.find({}).exec(function(err , data) {
     if(data)
       console.log(data) ;
       res.render('pbrender' , {title:'FLEXYTAB' , data : data }) ;
  });

}

exports.page_populate = function(req,res){


        agent.find({}).exec(function(err , data) { 
         if(data)  
           res.render('agenrender',{title : 'FLEXYTAB' , data : data});    
       
     });
}


exports.pb_edit= function(req,res) {

      var url = req.query.id ;
      console.log("url :"+ url);
      pb.find({_id : url }).exec( function(err , data) {
        if(data!=null)
         camp.find({},{"campuid" : true}).exec(function(err, drop) {
        if(data) console.log(drop);

      res.render('pb_edit', { title : 'FLEXYTAB' , data : data, url : url , drop:drop  });
       });
   });
}

exports.pb_delete = function(req,res) {

    var name= req.body.delhere;
     console.log("to be deleted " + name );
     pb.remove({_id : name } , function(err) {
         // console.log("deleted");
        if(!err) {
            pb.find({}).exec(function(err , data ) {
                  res.render('pbrender' , {title :'FLEXYTAB' , data : data }); });
            }
   });

}


exports.agent_delete = function(req,res) {
   
    var name= req.body.delhere;
     console.log("to be deleted " + name );

     agent.remove({_id : name } , function(err) { 
        if(!err) {
            agent.find({}).exec(function(err , data ) {
                  res.render('agenrender' , {title :'FLEXYTAB' , data : data }); });
            }

   });
     
}
     
exports.agent_edit= function(req,res) {
   
   var url = req.query.id;
    
   console.log("url :"+ url);

      agent.find({_id : url }).exec( function(err , data) {
        if(data!=null) 
      res.render('edit_agent', { title : 'FLEXYTAB' , data : data, url : url  });
     
     });    
}



exports.agent_update = function(req,res) {
     var url = req.body.url_id;
     var agentname= req.body.updateagent, agentemail= req.body.updateemail , agentphone = req.body.updatephone;
     console.log(url);
     console.log(Aname);
       
     agent.findOneAndUpdate({_id: url} , { name : agentname , email : agentemail , phone : agentphone } , function(err) {
    if(!err) {   
     agent.find({}).exec(function(err,data) {
       res.render('agenrender' , { title : 'FLEXYTAB' , data : data}); });
      }
   
      });

}

exports.agent_create = function(req, res) {


  var  user = req.body.agentname , pass = req.body.pass,  confirmpass=req.body.confirmpass, phone= req.body.phone,  email= req.body.email;
   
  
   if(pass!=confirmpass)
   {
      res.render('agent_create',{title :'FLEXYTAB' ,  comment : 'Passwords do not match ,Enter again'});
   }    
   

  else if(user && (pass==confirmpass) && pass!='' && confirmpass!=''){

    console.log(user+pass+phone+email);
     
    var ag1 = new agent({ name : user , pass : pass , phone : phone , email : email });

    ag1.save(function (err ) {
    if(err)
      console.log(err);
   else
     console.log("no error");
});
 
    agent.find({}).exec(function(err , data) {
      if(data)
       console.log(data);
        res.render('agenrender' , {title:'FLEXYTAB' , data : data }) ;
  });
      
}

    else
    res.render('agent_create',{ title : 'FLEXYTAB' , comment : 'Agent Name and Password cannot be blank'});

};
