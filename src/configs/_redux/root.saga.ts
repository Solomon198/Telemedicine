import {all} from 'redux-saga/effects'
import AuthSaga from '../../app/auth/auth.saga';
import UserSaga from '../../app/user/user.saga';
import HmoSaga from '../../app/hmo/user.saga'
import HcpSaga from '../../app/hcp/user.saga'

export default function* rootSaga(){
     yield all([


        //user data
        UserSaga.watchGetHcp(),
        UserSaga.watchGetPlan(),
        UserSaga.watchGetCompany(),
        UserSaga.watchGetDependentType(),
        UserSaga.watchGetEnroleeDependents(),
        UserSaga.watchGetState(),
        UserSaga.watchCloseModal(),
        UserSaga.watchSetHeight(),
        UserSaga.watchSetWeight(),
        UserSaga.watchSetComment(),
        UserSaga.watchSetRating(),


        //hmo saga
         HmoSaga.watchGetHcp(),
         HmoSaga.watchGetHcps(),
         HmoSaga.watchGetPlan(),
         HmoSaga.watchGetCompany(),
         HmoSaga.watchGetDependentType(),
         HmoSaga.watchGetEnroleeDependents(),
         HmoSaga.watchGetState(),
         HmoSaga.watchCloseModal(),
         HmoSaga.watchGetEnrolees(),
         HmoSaga.watchClearInfo(),
         HmoSaga.watchSearchEnrolee(),
         HmoSaga.watchSearchEnrolee(),
         HmoSaga.watchSearchHcps(),
         HmoSaga.setHmoNotificationCount(),

          //Hcp saga
          HcpSaga.watchGetHcp(),
          HcpSaga.watchGetPlan(),
          HcpSaga.watchGetCompany(),
          HcpSaga.watchGetDependentType(),
          HcpSaga.watchGetEnroleeDependents(),
          HcpSaga.watchGetState(),
          HcpSaga.watchCloseModal(),
          HcpSaga.watchGetEnrolees(),
          HcpSaga.watchClearInfo(),
          HcpSaga.watchSearchEnrolee(),
     


   


     //update
     AuthSaga.watchSetHcpProfilePicture(),
     AuthSaga.watchSetUserProfilePicture(),
     AuthSaga.watchSendVerificationCode(),
     AuthSaga.watchVerifyPin(),
     AuthSaga.watchRessetPassword(),
  

        //signup
        AuthSaga.WatchSignUp(),
        AuthSaga.watchSetTourFinish(),

         //resetpassword 
         AuthSaga.watchSetNewpassword(),
         AuthSaga.watchSetConfirmNewpassword(),

         //confirm reset credentials
         AuthSaga.watchSetRessetPasswordPhoneNumber(),
         AuthSaga.watchConfirmPhoneNumber(),
         AuthSaga.watchResendCodeAuth(),
         

         //verification
         AuthSaga.watchSetVerificationPin(),
         AuthSaga.watchSetTimerElapse(),

         //authentication Sagas
         AuthSaga.watchLogout(),
         AuthSaga.WatchLogin(),
         AuthSaga.WatchSetLoginPhoneNumber(),
         AuthSaga.watchSetLoginPassword(),

         //signup
         AuthSaga.watchSetSignUpFirstName(),
         AuthSaga.watchSetSignUpLastName(),
         AuthSaga.watchSetSignUpPassword(),
         AuthSaga.watchSetSignUpPhoneNumber(),
         AuthSaga.watchSetGender(),




     ])
}