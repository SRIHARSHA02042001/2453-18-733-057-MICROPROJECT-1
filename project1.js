var express=require('express');
var app=express();
const bodyparser=require('body-parser')
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
let server=require('./project1_server');
let project1_config=require('./project1_config');
let project1_middleware=require('./project1_middleware');
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalmgnt';
let db
MongoClient.connect(url,{ useUnifiedTopology:true },(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`connected to the database: ${url}`);
    console.log(`Database: ${dbName}`);
});
app.post('/createhosp',project1_middleware.checkToken,(req,res)=>{
    var hn=req.body.hn;
    var hid=req.body.hid;
    var hloc=req.body.hloc;
    var haddr=req.body.haddr;
    var hcont=req.body.hcont;
    var data=db.collection("hospital").insertOne({"hospitalname":hn,"hospitalid":hid, "hospitallocation":hloc, "hospitaladdress":haddr, "hospitalcontact":hcont});
    res.send(hn+" "+hid+" "+hloc+" "+haddr+" "+hcont+"inserted into hospital details");
});
app.post('/createvent',project1_middleware.checkToken,(req,res)=>{
    var hid=req.body.hid;
    var vtid=req.body.vtid;
    var vs=req.body.vs;
    var hn=req.body.hn;
    var data=db.collection("ventilator").insertOne({"hospitalid":hid, "ventilatorid":vtid, "ventilatorstatus": vs, "hospitalname":hn});
    res.send(vtid+" "+hid+" "+hn+" "+vs+"inserted into ventilator details");
});

app.get('/hospdet',project1_middleware.checkToken,(function(req,res){
    if(req.query.hid==undefined && req.query.hn==undefined && req.query.hloc==undefined && req.query.hcont==undefined)
    {
    db.collection("hospital").find().toArray(function(err,result){
        if(err) throw err;
        res.send(result);
        });
    }
    else if(req.query.hn==undefined && req.query.hloc==undefined && req.query.hcont==undefined)
    {
        var hid=req.query.hid;
        db.collection("hospital").find({"hospitalid":hid}).toArray(function(err,result){
            if(err) throw err;
            res.json(result);
        });
    }
    else if(req.query.hid==undefined && req.query.hloc==undefined && req.query.hcont==undefined)
    {
        var hn=req.query.hn;
        db.collection("hospital").find({"hospitalname":new RegExp(hn,'i')}).toArray(function(err,result){
            if(err) throw err;
            res.send(result);
        });
    }
    else if(req.query.hn==undefined && req.query.hid==undefined && req.query.hcont==undefined)
    {
        var hloc=req.query.hloc;
        db.collection("hospital").find({"hospitallocation":new RegExp(hloc,'i')}).toArray(function(err,result){
            if(err) throw err;
            res.send(result);
        });
    }
    /*else if(req.query.hid==undefined && req.query.hcont==undefined)
    {
        db.collection("hospital").find().toArray(function(err,result){
            if(err) throw err;
            res.send(result);
            var ans="";
            var hn=req.query.hn;
            var hloc=req.query.hloc;
            for(var i=0;i<result.length;i++)
            {
                var obj=result[i];
                if(obj.hospname==hn && obj.hosplocation==hloc){
                ans+="hospital name:"+obj.hospname+"<br>hospital ID:"+obj.hospid+"<br>Location:"+obj.hosplocation+"<br>Address:"+obj.hospaddress+"<br>Contact Info.:"+obj.hospcontact+"<br>-----------------------------<br>";
            }}
            res.send(ans);
            });
    }*/
    else if(req.query.hcont!=undefined)
    {
        var hn=req.query.hn;
        db.collection("hospital").find({"hospitalcontact":hcont}).toArray(function(err,result){
            if(err) throw err;
            res.send(result);
        });
    }
}));
app.get('/ventdet',project1_middleware.checkToken,function(req,res){
    if(req.query.vtid==undefined && req.query.vs==undefined && req.query.hn==undefined)
    {
    db.collection("ventilator").find().toArray(function(err,result){
        if(err) throw err;
        res.send(result);
        });
    }
    else if(req.query.vs==undefined && req.query.hn==undefined)
    {
        var vtid=req.query.vtid;
        db.collection("ventilator").find({"ventilatorid":vtid}).toArray(function(err,result){
            if(err) throw err;
            res.send(result);
        });

    }
    else if(req.query.vtid==undefined && req.query.hn==undefined)
    {
        var vs=req.query.vs;
        db.collection("ventilator").find({"ventilatorstatus":vs}).toArray(function(err,result){
            if(err) throw err;
            res.send(result);
        });
    }
    else if(req.query.vtid==undefined && req.query.vs==undefined)
    {
        var hn=req.query.hn;
        db.collection("ventilator").find({"hospitalname":new RegExp(hloc,'i')}).toArray(function(err,result){
            if(err) throw err;
            res.send(result);
        });
    }
    /*else if(req.query.vtid==undefined)
    {
        db.collection("ventilator").find().toArray(function(err,result){
            if(err) throw err;
            //res.send(result);
            var ans="";
            var vs=req.query.vs;
            var hn=req.query.hn;
            for(var i=0;i<result.length;i++)
            {
                var obj=result[i];
                if(obj.ventstat==vs && obj.hospname==hn){
                ans+="hospital ID:"+obj.hospid+"<br>Ventilator ID:"+obj.ventid+"<br>Ventilator Status:"+obj.ventstat+"<br>Hospital Name:"+obj.hospname+"<br>-----------------------------<br>";
            }}
            res.send(ans);
            });
    }*/
});

app.delete('/delvent',project1_middleware.checkToken,(req,res)=>{
    var vtid=req.query.vtid;
    try{
        db.collection("ventilator").deleteMany({"ventilatorid":vtid});
    }
    catch(e){console.log(e)}
    res.send("Details of Ventilator(s) having ventilator ID as "+vtid+" has been succesfully deleted");
});

app.put('/updatevent',project1_middleware.checkToken,(req,res)=>{
    if(req.query.vtid==undefined && req.query.hn!=undefined)
    {
        db.collection("ventilator").updateMany({"hospitalname":req.query.hn},[{$set:{"ventilatorstatus":req.query.vs}}]);
    }
    else if(req.query.vtid!=undefined)
    {
        db.collection("ventilator").updateMany({"ventilatorid":req.query.vtid},[{$set:{"ventilatorstatus":req.query.vs}}]);
    }
    res.send("Details of Ventilator(s) has been succesfully Updated");
});

app.listen(3000);