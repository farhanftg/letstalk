
var UserSchema = new Schema({
    firstname   : String,
    lastname    : String,
    username    : String,
    password    : String,
    status     : Number,
    created_at  : Date,
    updated_at  : Date
});

var User = mongoose.model('User', UserSchema);

var getUserById = function(id, callback){ 
    User.findOne({_id:id}, function (err, user){
        if (!err) {
            callback(err,user);
        }else{
            callback(err);
            console.log(err);
        } 
    });
}

var getUserByUsername = function(username, callback){    
    User.findOne({username:username}, function (err, user){
        if (!err) {
            callback(err,user);
        }else{
            callback(err);
            console.log(err);
        } 
    });
}

var getUserByEmail = function(email, callback){    
    User.findOne({email:email}, function (err, user){
        if (!err) {
            callback(err,user);
        }else{
            callback(err);
            console.log(err);
        } 
    });
}

module.exports = {getUserById,getUserByUsername,getUserByEmail};
