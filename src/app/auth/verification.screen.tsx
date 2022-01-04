import React from 'react';
import {SafeAreaView,StyleSheet,TextInput,ImageBackground,Platform,TouchableOpacity, View, Alert} from 'react-native'
import {Button,Text,H1,Icon,Header, Container, Body, Right,Radio} from 'native-base';
import StylesConfig from '../../configs/styles/index';
import {Navigation } from 'react-native-navigation'
import Colors from  "../../configs/styles/index"
import CountDown from 'react-native-countdown-component';
import {connect} from 'react-redux';
import SpinKit from 'react-native-spinkit'

type Props = {
    componentId :string,
    verificationPin : string,
    timerElapse : boolean,
    countdownComponentId:string,
    resetPhoneNumber : string;
    verificationStatus:string;
    errorVerification:string;
    verifyingCode:string;
    verificationToken:string;
    sendVerification:(payload:any)=>void;

    setVerificationPin : (pin:string)=>void,
    setTimerElapse : ()=>void,
    resendCode : (payload:any)=>void,
    verifyCodeSent:(payload:any)=>void;

} 


const mapStateToProps = (store:any)=>({
    verificationPin : store.Auth.verificationPin,
    timerElapse     : store.Auth.timerElapse,
    countdownComponentId : store.Auth.countdownComponentId,
    resetPhoneNumber : store.Auth.resetPhoneNumber,
    errorVerification : store.Auth.errorVerification,
    verificationStatus: store.Auth.verification,
    verifyingCode:store.Auth.verifyingCode,
    verificationToken:store.Auth.verificationToken
})

const mapDispatchStateToProps = (dispatch:any)=>({
   setVerificationPin : (pin:string)=> dispatch({type:"DO-SET-VERIFICATION-PIN",payload:pin}),
   setTimerElapse : ()=> dispatch({type:"DO-SET-TIMER-ELAPSE"}),
   sendVerification : (payload:any)=>dispatch({type:"DO-SEND-VERIFICATION-CODE",payload:payload}),
   verifyCodeSent:(payload:any)=>dispatch({type:"DO-VERIFY-VERIFICATION-CODE",payload:payload})
})


class Verification extends React.Component<Props> {


     resetTimer(){
         this.setState({time:10,showOptions:false})
     }

     sendVoiceCall(){
        this.props.resendCode({});
     }

     sendSMSCall(){
        this.props.sendVerification({
            enrolee_id: this.props.resetPhoneNumber
        })
     }


     verifyCode(){
         this.props.verifyCodeSent({
             token:this.props.verificationToken,
             pin:this.props.verificationPin
         })
     }


     componentDidMount(){

     }


    render(){

        const isLoading = this.props.verificationStatus == "VERIFICATION-STARTED";
        const isLoading2 = this.props.verifyingCode == "VERIFICATION-STARTED";

        return(
            <SafeAreaView style={styles.mainContainer}>
                {
                     this.props.errorVerification ? (
                        <View style={{backgroundColor:"#f4f4f4",width:300,padding:10,borderRadius:10,alignSelf:'center'}}>
                            <Text style={{color:"red",textAlign:'center'}}>
                                {this.props.errorVerification}
                            </Text>
                         </View>
                     ):null
                 }
                 
                 {
                     this.props.verificationStatus == 
                     "VERIFICATION-SUCCESS" && !this.props.errorVerification ? (
                        <View style={{backgroundColor:"#f4f4f4",width:300,padding:10,borderRadius:10,alignSelf:'center'}}>
                            <Text style={{color:"forestgreen",textAlign:'center'}}>
                                Verification code sent successfully
                            </Text>
                         </View>
                     ):null
                 }

                <H1 style={styles.headerText}> <H1 style={[styles.headerText,{color:Colors.Brand.brandColor}]}>Verify</H1> Phone Number</H1>
               
                <TextInput 
                    placeholderTextColor={Colors.Brand.brandColor} 
                    placeholder="- - - -" 
                    style={styles.input}
                    maxLength={4}
                    keyboardType="number-pad"
                    value={this.props.verificationPin}
                    onChangeText={(text)=>this.props.setVerificationPin(text)}
                    />
             
                <Button onPress={()=>this.verifyCode()} disabled={isLoading2} block large  style={styles.verifyBtn}>
                    <Text style={styles.text} uppercase={false}>
                        Verify Code
                    </Text>
                    {
                                isLoading2 &&(
                                    <SpinKit color="#fff" type="Circle"/>
                                )
                            }
                </Button>

                <Text style={styles.verificationText}>A verification code have been sent to your phone number, enter the verification code to verify your phone number</Text>
                {
                    !this.props.timerElapse?
                    <CountDown
                            id = {this.props.countdownComponentId}
                            until={3 * 60}
                            size={30}
                            onFinish={() => this.props.setTimerElapse()}
                            digitStyle={{backgroundColor: Colors.Brand.brandColor}}
                            digitTxtStyle={{color: '#fff'}}
                            timeToShow={['H','M', 'S']}
                            timeLabels={{m: 'minutes', s: 'seconds',h:"hour"}}
                        />
                    :
                    <View style={{marginHorizontal:20}}>
                         <Button 
                         disabled={isLoading}
                         onPress={()=> this.sendSMSCall()} iconLeft block style={styles.options}>
                             <Icon type="FontAwesome5" name="sms"/>
                             <Text>
                                Send SMS Code
                             </Text>
                             {
                                isLoading &&(
                                    <SpinKit color="#fff" type="Circle"/>
                                )
                            }
                         </Button>
                        
                    </View>
                }
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

export default connect(mapStateToProps,mapDispatchStateToProps)(Verification);