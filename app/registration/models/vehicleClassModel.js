var validationHelper    = require(HELPER_PATH+'validationHelper');
var commonHelper        = require(HELPER_PATH+'commonHelper');

var VehicleClassSchema = new Schema({    
    vehicle_class               : {type:String},
    vehicle_category            : {type:String,default:''},
    status                      : {type:Number, default:1},   
    created_at                  : {type: Date},
    updated_at                  : {type: Date, default: Date.now}
},{collection:'vehicle_class'});

VehicleClassSchema.set('toJSON', {
    virtuals: true
});

var VehicleClass = mongoose.model('VehicleClass', VehicleClassSchema);

VehicleClass.getVehicleCategoryByVehicleClass = function(vehicleClass){
    return new Promise(async function(resolve, reject){
        VehicleClass.findOneAndUpdate({vehicle_class:vehicleClass},{status:0},(err,result) => {
            if(err){
                reject(err);
            }else if(result){
                resolve(result.vehicle_category);
            }else{
                resolve(null);
            }
        })
    });
}

module.exports = VehicleClass;
