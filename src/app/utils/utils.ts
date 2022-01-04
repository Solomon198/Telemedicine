import MMKVStorage from 'react-native-mmkv-storage'
import {ToastAndroid,PermissionsAndroid,Alert,Platform} from 'react-native'
import {User,HealthCareProvider} from './types'
import ImagePicker from 'react-native-image-crop-picker';

const storage = new MMKVStorage.Loader().initialize();

async function requestPersmission(){

  try{
      if(Platform.OS === "android"){

      
            let permission =   await PermissionsAndroid.request("android.permission.CAMERA");
            let permission2 =   await PermissionsAndroid.request("android.permission.READ_EXTERNAL_STORAGE");

            let permission3 =   await PermissionsAndroid.request("android.permission.WRITE_EXTERNAL_STORAGE");

            if(permission === "granted" && permission2 === "granted"&& permission3 === "granted"){
                //granted
            }else{
                Alert.alert("Permission !!!!","App needs permission to function correctly");
            }
             
         }else{
          //  requestAuthorization();
         }
  }catch(e){
      return e
  }

}

async function getImageFromGallery(){

  await requestPersmission();
    const takePicture = await ImagePicker.openPicker({
      mediaType: "photo",
    })
    return takePicture.path;
 
}



async function takeSnapShot(){

    await requestPersmission();

    const takePicture = await ImagePicker.openCamera({
      mediaType: "photo",
    })

    return takePicture.path;
  
}

function reconcileRouteHistoryForSidemenu(currentRoute:string){

  storage.getItem("sidemenu").then((routes)=>{
    let _routes:string[] = JSON.parse(routes) as string[];
    let deleteIndex = _routes.indexOf(currentRoute);
    _routes.splice(deleteIndex,1);
    let wrapRoutes = JSON.stringify(_routes);
    storage.setItem("sidemenu",wrapRoutes)

 })

}


function getUserDefaultProfilePhoto(user:User){

  const male = require("../../../assets/media/gender/male.jpg");
  const female = require("../../../assets/media/gender/female.png");

  if(user.enrollee_mobile_photo_url){
    return {uri:user.enrollee_mobile_photo_url}
  }else{
      if(user.gender == "Male"){
        return male
      }else{
        return female;
      }
  }
}

function getHcpDefaultProfilePhoto(hcp:HealthCareProvider){

  const hcp_default = require("../../../assets/dashboard/hcp.png");
  
  if(hcp.hcp_mobile_photo_url){
    return {uri:hcp.hcp_mobile_photo_url}
  }else{
     return hcp_default;
  }
}

export function matchStatus(status:number){

  if(
     status === 400 ||
     status === 500 ||
     status === 409 ||
     status === 403
  ){
      return true;
  }else{
      return false;
  }

}

export default {
    reconcileRouteHistoryForSidemenu,
    getHcpDefaultProfilePhoto,
    getUserDefaultProfilePhoto,
    getImageFromGallery,
    takeSnapShot,
    matchStatus
}