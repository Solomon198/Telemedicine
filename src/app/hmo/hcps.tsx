import React from 'react';
import {View,StyleSheet,TextInput, PermissionsAndroid,Platform, Alert,FlatList, TouchableNativeFeedback,Dimensions,TouchableOpacity,ScrollView} from 'react-native'
import {H1,Container,Header,Left, Body, Title, ListItem,Spinner,Text, Icon, H2,Button, Right, H3} from 'native-base'
import Colors from '../../configs/styles/index'
import {toggleSideMenu} from './navigations.actions';
import MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from "react-native-geolocation-service";
import { Navigation } from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib'
import {connect} from 'react-redux'
import helperFuncs from '../utils/utils'
import {User,HealthCareProvider} from '../utils/types'
import MMKVStorage from 'react-native-mmkv-storage'
import SpinKit from 'react-native-spinkit'
import Splashscreen from "react-native-splash-screen"
import realm from 'realm'
import Modal from 'react-native-modalbox';


const {width,height} = Dimensions.get("window")
const storage = new MMKVStorage.Loader().initialize();

type Props = {
    componentId :string;
    user : User,
    hcps : HealthCareProvider[],
    hcpsStatus:string;
    logout:()=>void;
    getHcps:()=>void;
    searchHcps:(payload:string)=>void;
}



const mapStateToProps = (store:any)=>({
   user : store.Auth.user,
   hcps : store.Hmo.hcps,
   hcpsStatus : store.Hmo.hcpsStatus
})

const mapDispatchToProps = (dispatch:any)=>({
   searchHcps:(payload:string)=>dispatch({type:"DO-SEARCH-HCPS",payload:payload}),
   logout :()=>dispatch({type:"DO-LOGOUT"}),
   getHcps:()=>dispatch({type:"DO-GET-HCPS-HMO"}),

})


 class Hcps extends React.Component<Props> {


    state = {
        latitude:0,
        longitude:0,
        rating:1,
        comment:"",
        modalVisible:false,
        showModal : false,
        plan : {},
        hcp:{
            hcp_name: "",
            phone: "",
            email: "",
            desk_officer: "",
            desk_officer_phone:"",
            location: "",
            address: "",
            nhis_no: "",
            account_no:""
        }
    }

    getResourceStatus(statusCheck:string){

        let status = {
            success:false,
            failed:false,
            started: false
        }

        let started =  statusCheck.indexOf("STARTED");
        let failed  = statusCheck.indexOf("FAILED");
        let success = statusCheck.indexOf("SUCCESS");

        if(started >= 0){
            status.started = true;
        }

        if(failed >= 0){
            status.failed = true;
        }

        if(success >= 0 ){
            status.success = true;
        }

        return status;


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

  

    navigate(name:string,user:any){
        Navigation.push(this.props.componentId,{
            component:{
                id : name,
                name: name,
                passProps:{
                    user : user
                }
            }
        })
    }


     componentDidMount(){
        Splashscreen.hide();
       
            this.props.getHcps();

           
        
    }


  
    
   showInfo(hcp:HealthCareProvider){
       Navigation.showModal({
           component:{
               name : "stack.user.information",
               id:"stack.user.information",
               passProps:{
                   hcp:hcp
               }
           }
       })
   }


    logout(){
        Alert.alert("Log Out","Are you sure you want to log out ? ",[
            {onPress:()=>this.props.logout(),text:"Confirm"},
            {onPress:()=>"",text:"cancel"}
        ])
    }
    


    render(){
         
        
        const {success,failed,started} = this.getResourceStatus(this.props.hcpsStatus || "")
        return (
            <Container style={styles.mainContainer}>
                <View style={styles.container}>
                <Header hasTabs  androidStatusBarColor={Colors.Brand.brandColor} style={styles.header}>
                    <Left style={{maxWidth:50}}>
                        <View>
                            <TouchableNativeFeedback onPress={()=>Navigation.pop(this.props.componentId)}>
                                <Icon style={{color:Colors.Brand.brandColor}} name="arrow-back"/>
                                
                            </TouchableNativeFeedback>
                        </View>
                    </Left>
                    
                    <Body>
                       <Title style={{color:Colors.Brand.brandColor,fontWeight:"bold"}}>Hcps</Title>
                    </Body>
                    <Right style={{maxWidth:50}}>
                   
                    </Right>
                </Header>
                <View style={{width:width}}>
                    <TextInput 
                    onChangeText={(text:string)=> this.props.searchHcps(text)}
                    style={styles.search} placeholder="Search hcps" placeholderTextColor="#666"/>
                </View>
                        
              

                   
                       
                    
                    <View style={{flex:1}}>
                         
               {
                   started && (
                       <SpinKit type="Circle" color={Colors.Brand.brandColor} style={{alignSelf:'center',marginVertical:10}}/>
                   )
               }

               {
                   failed && (
                       <Button onPress={()=>this.props.getHcps()} rounded  style={{alignSelf:'center'}}>
                            <Icon name="reload-circle-outline"/>
                           <Text uppercase={false}>Retry</Text>
                       </Button>
                   )
               }

               {
                   success && this.props.hcps.length == 0 && (
                       <View style={{flex:1,justifyContent:'center',alignContent:"center",alignItems:'center'}}>
                           <H3 style={{marginTop:20, fontFamily:"sans-serif-thin"}}>Hcps not found</H3>
                       </View>
                   )
               }
                


              {
                 
                  <FlatList
                   data={this.props.hcps}
                   keyExtractor={(item)=>item._id}
                   renderItem={({item,index})=>

                      <ListItem onPress={()=> this.showInfo(item)} style={styles.items} key={index} noIndent noBorder >
                          <Avatar 
                          imageStyle={{alignSelf:"center"}}  
                          size={50} source={helperFuncs.getHcpDefaultProfilePhoto(item)}/>
                          <Body>
                              <Text note style={styles.label}>
                                  {item.hcp_name}
                              </Text>
                              <Text note style={styles.listBodyText}>
                                  {item.phone}
                              </Text>
                          </Body>
                          <Right>
                              <Button transparent>
                                  <Icon style={{color:Colors.Brand.getBrandColorByOpacity(0.3)}} type="EvilIcons" name="chevron-right" />
                              </Button>
                          </Right>
                      </ListItem>
                                
            
               }
              />
              }
                    </View>

                    
                  
                    

                       
               </View>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    search:{
        marginHorizontal:20,
        backgroundColor:"#fff",
        borderRadius:15,
        borderWidth:1,
        borderColor:"#f0f0f0",
        fontSize:16,
        paddingHorizontal:10
    },
    items:{
      backgroundColor:"#fff",
      marginVertical:8,
      marginHorizontal:15,
      borderRadius:15
    },
    listBodyText:{
        fontSize:14,
        color:"#555"
      },
    label:{
        color:"#111",
        fontWeight:'900',
        fontSize:16,
        textTransform:"capitalize",
    },
    mainContainer : {
        flex: 1,
        backgroundColor:"#f7f7f7"
    },
    icoContainer:{
        height:50,
        backgroundColor:StyleConfig.Brand.brandColor,
        width:50,
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
        backgroundColor:"#f7f7f7",
        zIndex:2000,
    },
    btnMenu :{
        backgroundColor:Colors.Brand.brandColor,
        width:50,
        height:50,
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center'
    },
    container: {
  
        flex:1,
      },
      map: {
       flex:1,
       zIndex: -10
    },
    ico:{
        color:"#fff"
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
      },
    
      modal2: {
        height: 230,
        backgroundColor: "#3B5998"
      },
    
      modal3: {
        height: 300,
        width: 300
      },
    
      modal4: {
        height: height,
        marginTop:100,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor:"#f4f4f4",
        width:width
      },
      iconLeft:{
        color:Colors.Brand.brandColor
      },
      listItem:{
        backgroundColor:"#ffffff",
        marginVertical:5,
        marginHorizontal:20,
        borderRadius:15
      }
})

export default connect(mapStateToProps,mapDispatchToProps)(Hcps)