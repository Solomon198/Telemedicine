import realm from 'realm';
import Schema from './userSchema';
import {User,HealthCareProvider} from './types';
import mongoose from 'mongoose';
let app:realm;

function getApp(){
   if(!app){
       app = new realm({schema:[Schema.UserSchema,Schema.HcpSchema],schemaVersion:4})
       return app;
   }
   return app;
}

// getApp().write(()=>{
//     getApp().deleteModel(Schema.name)
// });

function saveUsers(users:User[]){

    let app = getApp();
    app.write(()=>{
        let obj = app.objects(Schema.UserSchema.name);

        
            app.delete(obj);
            users.forEach((user)=>{
                user._id = mongoose.Types.ObjectId();
                app.create(Schema.UserSchema.name,user);
            })
        

    })
}

function getUsers(){
    let app = getApp();
    let users = app.objects(Schema.UserSchema.name);
    let results:User[] = [];
    users.forEach((user)=>{
        let obj = user.toJSON();
        obj._id = obj._id.toHexString();
        results.push(obj);
    })
    return results
}

function searchUsers(searchQuery:string){
     let app = getApp();
     let query =
          'family_name CONTAINS[c] $0 || other_name CONTAINS[c] $0 || enrolee_id CONTAINS[c] $0 || email_address CONTAINS[c] $0 || address CONTAINS[c] $0 || phone CONTAINS[c] $0';
  
          let users:realm.Results<realm.Object> = app
          .objects(Schema.UserSchema.name)
          .filtered(query, searchQuery);
    let result:User[] = [];

    users.forEach((val)=>{
         let _obj = val.toJSON();
         _obj._id = _obj._id.toHexString();
         result.push(_obj)
    })

    return result;

}


function saveHcps(hcps:HealthCareProvider[]){

    let app = getApp();
    app.write(()=>{
        let obj = app.objects(Schema.HcpSchema.name);

            app.delete(obj);
            hcps.forEach((hcp)=>{
                hcp._id = mongoose.Types.ObjectId();
                app.create(Schema.HcpSchema.name,hcp);
            })
        

    })
}

function getHcps(){
    let app = getApp();
    let hcps = app.objects(Schema.HcpSchema.name);
    let results:HealthCareProvider[] = [];
    hcps.forEach((user)=>{
        let obj = user.toJSON();
        obj._id = obj._id.toHexString();
        results.push(obj);
    })
    return results
}

function searchHcps(searchQuery:string){
     let app = getApp();
     let query =
      'hcp_code CONTAINS[c] $0 || hcp_code CONTAINS[c] $0 || nhis_no CONTAINS[c] $0 || email CONTAINS[c]  $0';
  
          let users:realm.Results<realm.Object> = app
          .objects(Schema.HcpSchema.name)
          .filtered(query, searchQuery);
    let result:HealthCareProvider[] = [];

    users.forEach((val)=>{
         let _obj = val.toJSON();
         _obj._id = _obj._id.toHexString();
         result.push(_obj)
    })

    return result;

}

export default {
    saveUsers,
    searchUsers,
    getUsers,
    getHcps,
    searchHcps,
    saveHcps
}