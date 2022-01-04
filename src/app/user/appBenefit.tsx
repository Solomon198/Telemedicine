import React from 'react';
import {View,StyleSheet,TouchableOpacity, PermissionsAndroid,Platform, Alert,BackHandler, ImageBackground,ScrollView} from 'react-native'
import {H1,Container,Header,Left, Body, Title, Fab,Text, Icon, H2,ListItem, Right, H3, Button,List,Content} from 'native-base'
import Colors from '../../configs/styles/index'
import {toggleSideMenu} from './navigations.actions';
import Geolocation from "react-native-geolocation-service";
import { Navigation } from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib'
import helperFuncs  from '../utils/utils'
import Accordion from 'react-native-collapsible/Accordion';

type Props = {
    componentId :string;
}

const benefits = [
    "Lower monthly premiums and generally lower out-of-pocket costs.",
    "Generally lower out-of-pocket costs for prescriptions.",
    "Claims won’t have to be filed as often since medical care you receive is typically in-network.",
    "Convenience of having a primary care doctor as your advocate to coordinate and manage your care."
]

const dataArray = [
    { title: "First Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
  ];

export default class Benefits extends React.Component<Props> {


    state = {
        latitude:0,
        longitude:0
    }

    componentDidMount(){
        BackHandler.addEventListener("hardwareBackPress",this.onBackButtonPressed)
     }

 
     onBackButtonPressed(){
         helperFuncs.reconcileRouteHistoryForSidemenu("stack.user.benefits")
         return false;
     }

     back(){
          helperFuncs.reconcileRouteHistoryForSidemenu("stack.user.benefits")
          Navigation.pop(this.props.componentId);
     }
     
     componentWillUnmount(){
       BackHandler.removeEventListener("hardwareBackPress",this.onBackButtonPressed)
     }


    async requestPersmission(){

        try{
            if(Platform.OS === "android"){

            
                  let permission =   await PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION");
                  let permission2 =   await PermissionsAndroid.request("android.permission.ACCESS_COARSE_LOCATION");

                  if(permission === "granted" && permission2 === "granted"){
                      //granted
                  }else{
                      Alert.alert("Permission !!!!","App needs permission to function correctly");
                  }
                   
               }else{
                //  requestAuthorization();
               }
        }catch(e){
            console.log(e)
            return e
        }

    }
 

    getCurrentPosition(){
        Geolocation.watchPosition((position)=>{
            const {latitude,longitude} = position.coords;
            this.setState({latitude,longitude})

            },(error)=>{
                this.getCurrentPosition();
          }, { enableHighAccuracy: true});

    }

  

    navigate(name:string){
        Navigation.push(this.props.componentId,{
            component:{
                name: name,
                passProps:{
                    longitude : this.state.longitude,
                    latitude : this.state.latitude
                }
            }
        })
    }
    
    


    render(){
        return (
            <Container style={styles.mainContainer}>
                               

                  <Header hasTabs  androidStatusBarColor={Colors.Brand.brandColor} style={styles.header}>
                        <Left style={{maxWidth:60}}>
                            <View>
                                <TouchableOpacity onPress={()=>this.back()}  style={styles.btnMenu}>
                                    <Icon style={{color:Colors.Brand.brandColor}} name="arrow-back"/>
                                    
                                </TouchableOpacity>
                            </View>
                        </Left>
                        
                        <Body>
                           <Title style={{color:"#444",fontWeight:"400"}}>Benefits</Title>
                        </Body>
                    
                    </Header>
                    <View style={{marginHorizontal:10}}>
                        <H1 style={{marginVertical:10}}>
                           What’s an HMO plan?
                        </H1>
                        <Text style={{color:"#333",fontSize:15}}>
                        An HMO plan is based on a network of hospitals, doctors, and other health care providers that agree to coordinate care within a network in return for a certain payment rate for their services. 
 
                        </Text>

                        <Text style={{color:Colors.Brand.brandColor,fontWeight:'bold',marginVertical:10,marginLeft:20}}>Benefits</Text>
                        <ScrollView>
                        {
                            benefits.map((val,index)=>
                               <ListItem noIndent>
                                   <View style={{width:50,height:50,backgroundColor:Colors.Brand.brandColor,justifyContent:'center',borderRadius:100,alignContent:'center',alignItems:'center'}}>
                                    <Text style={{color:"#fff"}}>{index+1}</Text>
                                    </View>
                                   <Body>
                                        <Text style={{marginVertical:5}}>
                                            {val}
                                        </Text>
                                   </Body>
                               </ListItem>
                             
                            )
                        }
                        </ScrollView>
                       
                    </View>

              
             


          
                        
              

                    
                    
                       
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    label:{
        color:Colors.Brand.brandColor,
        fontWeight:'900',
        fontSize:16
    },
    iconLeft:{
        color:Colors.Brand.brandColor
    },
    listBodyText:{
      fontSize:14,
      color:"#555"
    },
    mainContainer : {
        flex: 1
    },
    icoContainer:{
        height:60,
        backgroundColor:StyleConfig.Brand.brandColor,
        width:60,
        borderWidth:1,
        borderRadius:100,
        borderColor:StyleConfig.Brand.getBrandColorByOpacity(0.3),
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        marginHorizontal:25
     },
    labelList:{
        marginTop:10,
        fontSize:10,
        fontWeight:'bold'
     },
    subContainer : {
        flex:1,
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    header :{
        backgroundColor:"#fff",
        zIndex:2000,
    },
    btnMenu :{
        width:50,
        height:50,
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center'
    },
    container: {
  
      },
      map: {
       flex:1,
       zIndex: -10
    },
    ico:{
        color:"#fff"
    },
})

