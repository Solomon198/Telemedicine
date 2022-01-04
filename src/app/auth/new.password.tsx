import React from 'react';
import {SafeAreaView,StyleSheet,TextInput,ImageBackground,Platform,TouchableOpacity, View, Alert} from 'react-native'
import {Button,Text,H1,Icon,Header, Container, Body, Right,Radio} from 'native-base';
import StylesConfig from '../../configs/styles/index';
import {Navigation } from 'react-native-navigation'
import Colors from  "../../configs/styles/index"
import SpinKit from 'react-native-spinkit'
import {connect} from 'react-redux'
type Props = {
    newPassword : string,
    confirmNewPassword : string,
    componentId : string,
    accessToken : string;
    ressetPasswordStatus:string;
    ressetError:string;
    setNewPassword : (password:string)=>void,
    setConfirmNewPassword : (password:string)=>void,
    ressetPassword:(payload:any)=>void

}


const mapStateToProps = (store:any)=>({
    newPassword : store.Auth.newPassword,
    confirmNewPassword : store.Auth.confirmNewPassword,
    accessToken : store.Auth.accessToken,
    ressetPasswordStatus:store.Auth.ressetPasswordStatus,
    ressetError : store.Auth.ressetError
})

const mapDispatchStateToProps = (dispatch:any)=>({
   ressetPassword:(payload:any)=>dispatch({type:"DO-RESSET-PASSWORD",payload}),
   setNewPassword : (password:string)=> dispatch({type:"DO-SET-NEW-PASSWORD",payload:password}),
   setConfirmNewPassword : (password:string)=> dispatch({type:"DO-SET-CONFIRM-NEW-PASSWORD",payload:password}),
})


class NewPassword extends React.Component<Props> {


    ressetPassword(){
        if(this.props.newPassword === this.props.confirmNewPassword){
            this.props.ressetPassword({
                password:this.props.newPassword,
                accessToken:this.props.accessToken
            })
        }else{
            Alert.alert("","Password don't match please check password and try again!!")
        }
    }


    render(){
        const isLoading = this.props.ressetPasswordStatus == "RESSET-STARTED";

        return(
            <SafeAreaView style={styles.mainContainer}>
            
                <H1 style={styles.headerText}> <H1 style={[styles.headerText,{color:Colors.Brand.brandColor}]}>Enter</H1> New Password</H1>
               
                 {
                     this.props.ressetError ? (
                        <View style={{backgroundColor:"#f4f4f4",width:300,padding:10,borderRadius:10,alignSelf:'center'}}>
                            <Text style={{color:"red",textAlign:'center'}}>
                                {this.props.ressetError}
                            </Text>
                         </View>
                     ):null
                 }
                <TextInput 
                    placeholderTextColor={"#555"} 
                    placeholder="Enter new password" 
                    style={styles.input}
                    secureTextEntry
                    editable={!isLoading}
                    value={this.props.newPassword}
                    onChangeText={(text)=>this.props.setNewPassword(text)}
                 />


                 <TextInput 
                    placeholderTextColor={"#555"} 
                    placeholder="Confirm new password" 
                    style={styles.input}
                    secureTextEntry
                    editable={!isLoading}
                    value={this.props.confirmNewPassword}
                    onChangeText={(text)=>this.props.setConfirmNewPassword(text)}
                 />
             
             
                <Button onPress={()=>this.ressetPassword()} disabled={isLoading} block large  style={styles.verifyBtn}>
                    <Text style={styles.text} uppercase={false}>
                        Reset Password
                    </Text>
                    {
                                isLoading &&(
                                    <SpinKit color="#fff" type="Circle"/>
                                )
                      }
                </Button>

               
                
            </SafeAreaView>
            
        )
    }
}

const styles = StyleSheet.create({
    options:{
        backgroundColor:Colors.Brand.brandColor,
        marginTop:15,
        borderRadius:5
    },
    verificationText:{
        color:"#444",
        marginHorizontal:20,
        marginTop:10,
        fontSize:14,
        marginBottom:30
    },
    text : {
       fontSize:18,
       fontWeight:'800'
    },
    mainContainer:{
        backgroundColor:"#fff",
        flex:1,
        paddingHorizontal:5,
        justifyContent:'center'

    },
    headerText:{
        fontWeight:'bold',
        color:"#666",
        textAlign:'center',
        marginTop:30,
        marginBottom:10
    },
    input:{
      backgroundColor:"#f8f8f8",
      borderColor:Colors.Brand.getBrandColorByOpacity(0.4),
      borderWidth:1,
      borderRadius:5,
      marginBottom:10,
      marginTop:20,
      fontWeight:"500",
      marginHorizontal:20,
      color:"#555",
      paddingVertical:20,
      fontSize:17

    },

    verifyBtn:{
        marginHorizontal:20,
        borderRadius:5,
        backgroundColor:Colors.Brand.brandColor,
        marginTop:20
    }
   

})

export default connect(mapStateToProps,mapDispatchStateToProps)(NewPassword);