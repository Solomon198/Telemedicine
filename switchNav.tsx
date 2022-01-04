/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{Component} from 'react';
import {
  Alert,
  StatusBar,
  View,

} from 'react-native';
import {connect} from 'react-redux'
import {AuthNavigationSettingStack,User,HMO_Dashboard,HCP_Dashboard} from './nav.config/nav.stack';
import SplashScreen from 'react-native-splash-screen';
import { Navigation } from 'react-native-navigation';
type Props = {
  user : any;
  accessToken : string;
  account_type : string;
  test:()=>void;
  tourFinished: string;
}

const mapStateToProps = (store:any)=> ({
    user : store.Auth.user,
    accessToken: store.Auth.accessToken,
    account_type : store.Auth.account_type,
    tourFinished : store.Auth.tourFinish

})

const mapDispatchStateToProps = (dispatch:any)=>({
    test : ()=>Alert.alert("working"),
})


class App extends Component<Props> {




   componentDidMount(){
      let user = Object.keys(this.props.user);
      if(user.length == 0 ){
        if(!this.props.tourFinished){

         Navigation.showModal({component:{
          name : "stack.gen.tour",
          id:"stack.gen.tour",
         }})

        }else{
          AuthNavigationSettingStack();
        }
  
       }else{
        if( this.props.account_type === "Enrolee"){
          User();
       }else if( this.props.account_type === "HMO Admin"){
          HMO_Dashboard();
       }else if (this.props.account_type === "HCP Admin"){
           HCP_Dashboard();
       }
  
       }
  
 
     
     SplashScreen.hide();
     
  }


       

 

  
      render(){
        return (
          <View/>
      )
      }


}



export default connect(mapStateToProps,mapDispatchStateToProps)(App)
