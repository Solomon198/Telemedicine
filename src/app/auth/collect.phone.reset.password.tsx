import React from 'react';
import {SafeAreaView,StyleSheet,TextInput,ImageBackground,Platform,TouchableOpacity, View, Alert} from 'react-native'
import {Button,Text,H1,Icon,Header, Container, Body, Right,Radio} from 'native-base';
import Colors from  "../../configs/styles/index"
import {connect} from 'react-redux'
import SpinKit from 'react-native-spinkit'


type Props = {
    componentId :string,
    resetPhoneNumber : string;
    verificationStatus:string;
    errorVerification:string;
    sendVerification:(payload:any)=>void;

    setResetPhoneNumber : (phoneNumber:string)=>void,


}

const mapStateToProps = (store:any)=>({
    resetPhoneNumber : store.Auth.resetPhoneNumber,
    errorVerification : store.Auth.errorVerification,
    verificationStatus: store.Auth.verification
    
})

const mapDispatchStateToProps = (dispatch:any)=>({
    setResetPhoneNumber :(phoneNumber:string)=>dispatch({type:"DO-SET-RESSET-PASSWORD-PHONE-NUMBER",payload:phoneNumber}),
    sendVerification : (payload:any)=>dispatch({type:"DO-SEND-VERIFICATION-CODE",payload:payload,confirmNumber:true})
})


class VerifyResetCreds extends React.Component<Props> {


    render(){
        const isLoading = this.props.verificationStatus == "VERIFICATION-STARTED";
        return(
            <SafeAreaView style={styles.mainContainer}>
                 {
                     this.props.errorVerification ? (
                        <View style={{backgroundColor:"#f4f4f4",width:300,padding:10,borderRadius:10}}>
                            <Text style={{color:"red",textAlign:'center'}}>
                                {this.props.errorVerification}
                            </Text>
                         </View>
                     ):null
                 }
                <H1 style={styles.headerText}> <H1 style={[styles.headerText,{color:Colors.Brand.brandColor}]}>Enter</H1> Enrolee Id</H1>


               
                <TextInput 
                    placeholderTextColor={Colors.Brand.brandColor} 
                    placeholder="- - - - - - - - - - - " 
                    style={styles.input}
                    keyboardType="number-pad"
                    editable={!isLoading}
                    value={this.props.resetPhoneNumber}
                    onChangeText={(text)=>this.props.setResetPhoneNumber(text)}
                    />
             
                <Button 
                disabled={isLoading}
                onPress={()=>this.props.sendVerification({enrolee_id:this.props.resetPhoneNumber})}
                block large  style={styles.verifyBtn}>

                    <Text style={styles.text} uppercase={false}>
                       Send Verification Code
                    </Text>
                    {
                        isLoading &&(
                            <SpinKit color="#fff" type="Circle"/>
                        )
                    }
                </Button>

                <Text style={styles.verificationText}>A verification code have been sent to your phone number, enter the verification code to verify your phone number before resetting your password</Text>
                 
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
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    headerText:{
        fontWeight:'bold',
        color:"#666",
        textAlign:'center',
        marginTop:30
    },
    input:{
      backgroundColor:"transparent",
      marginTop:20,
      textAlign:"center",
      fontSize:40,
      fontWeight:"bold",
      color:Colors.Brand.brandColor,

    },

    verifyBtn:{
        marginHorizontal:20,
        borderRadius:5,
        backgroundColor:Colors.Brand.brandColor
    }
   
})
export default connect(mapStateToProps,mapDispatchStateToProps)(VerifyResetCreds);