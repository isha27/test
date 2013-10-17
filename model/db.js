var mongoose= require('mongoose');
//var db =mongoose.createConnection('localhost' , 'test');
var dbUri= 'mongodb://localhost:27017/isha';
mongoose.connect(dbUri) ;

var agentSchema = new mongoose.Schema({
  
   name : String,
   email : String , 
   phone : {type: Number  , trim :true } ,
   pass : String ,
   ag_status:String ,
  
 });


var campaignSchema = new mongoose.Schema({
  
   client_id : String ,
   campname : String ,
   campuid : String ,
   created : Date ,
   scrub_ndnc : Boolean  ,
   enabled : Date 

});


var pbschema = new mongoose.Schema({
   
    campaign : String,
    pb_name : String , 
    enabled : Date ,
    created : Date ,
    scrub : Boolean , 
});

module.exports = mongoose.model('campaign' , campaignSchema );
module.exports= mongoose.model('Phonebook', pbschema );   
module.exports= mongoose.model('agent_s' , agentSchema );


