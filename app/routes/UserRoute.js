/**
 * Created by Santhosh on 5/31/14.
 */

var User = require("../models/User").User;
var _ = require("lodash");
var moment = require("moment");

exports.createUser = function(req, res){

    console.log('Create User Started:'+JSON.stringify(req.body.user));
    var jsonObj = req.body.user;
    //var user = req.session.user_profile;

    User.findOne({username : jsonObj.username}, function (err, user) {
        if(err){
            return res.json(500, {statusMsg:'User registration failed - '+err});
        }
        if(!user){
            saveUser();
        }else{
            console.log("User already exists and force fail registration: "+JSON.stringify(user));
            return res.json(500, {statusMsg:'Username already exists'});
        }
    });

    function saveUser(){
        var user = new User({
            username: jsonObj.username,
            //email: jsonObj.username,
            password: jsonObj.password,
            display_name : jsonObj.display_name,
            user_type : jsonObj.user_type,
            user_information : {
                first_name: jsonObj.first_name,
                last_name: jsonObj.last_name,
                company_name: jsonObj.company_name,
                address : {
                    line1 : jsonObj.line1,
                    line2 : jsonObj.line2,
                    line3 : jsonObj.line3,
                    city : jsonObj.city,
                    state : jsonObj.state,
                    //country : jsonObj.country,
                    pincode : jsonObj.pincode
                },
                contact : [jsonObj.contactno]
            },
            //accessToken: { type: String }, // Used for Remember Me
            //type:{type: String,required: true},
            status : "Active",
            encrypt : false
        });

        console.log('User to be loaded: '+JSON.stringify(user));
        user.save(subSaveUser);
    }

    function subSaveUser(err1){
        if(err1){
            console.log('USer save failed - '+err1);
            res.json(500, {statusMsg:'User save failed - '+err1});
        }else{
            res.json(200, {statusMsg:'User save Success'});
        }
    }
};

