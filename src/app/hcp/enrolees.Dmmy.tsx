import React from 'react';
import {View,StyleSheet,TouchableOpacity, PermissionsAndroid,Platform, Alert,FlatList} from 'react-native'
import {H1,Container,Header,Left, Body, Title, ListItem,Spinner,Text, Icon, H2,Button, Right, H3} from 'native-base'
import Colors from '../../configs/styles/index'
import {toggleSideMenu} from './navigations.actions';
import MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from "react-native-geolocation-service";
import { Navigation } from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib'
import call from 'react-native-phone-call'
import {connect} from 'react-redux'
import {User} from '../utils/types'
import MMKVStorage from 'react-native-mmkv-storage'
import Splashscreen from "react-native-splash-screen"

const storage = new MMKVStorage.Loader().initialize();

type Props = {
    componentId :string;
    user : User,
    enrolees : User[],
    enroleesStatus:string;
    logout:()=>void;
    getEnrolees:(payload:any)=>void;
}



const mapStateToProps = (store:any)=>({
   user : store.Auth.user,
   enrolees : store.Hcp.enrolees,
   enroleesStatus : store.Hcp.enroleesStatus
})

const mapDispatchToProps = (dispatch:any)=>({
   getEnrolees:(payload:any)=>dispatch({type:"DO-GET-ENROLEES-HCP",payload:payload}),
   logout :()=>dispatch({type:"DO-LOGOUT"})
})


 class Dashboard extends React.Component<Props> {


    state = {
        latitude:0,
        longitude:0,
        
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
        this.props.getEnrolees({hcp_id:this.props.user.id});
            
    }
    

    call(){
           const args = {
            number: '09050709444', // Use commas to add time between digits.
            prompt: false
          }
          
          call(args).catch(console.error)
    }


    logout(){
        Alert.alert("Log Out","Are you sure you want to log out ? ",[
            {onPress:()=>this.props.logout(),text:"Confirm"},
            {onPress:()=>"",text:"cancel"}
        ])
    }
    


    render(){
        const profilePhoto = require("../../../assets/media/images/default.png");
        const {success,failed,started} = this.getResourceStatus(this.props.enroleesStatus)
        return (
            <Container style={styles.mainContainer}>
               
                <View style={styles.container}>
                <Header  androidStatusBarColor={Colors.Brand.brandColor} style={styles.header}>
                    <Left style={{maxWidth:50}}>
                        <View>
                            <TouchableOpacity onPress={()=>toggleSideMenu(true,this.props.componentId)}  style={styles.btnMenu}>
                                <Icon style={{color:"#f3f3f3"}} name="menu"/>
                                
                            </TouchableOpacity>
                        </View>
                    </Left>
                    
                    <Body>
                       <Title style={{alignSelf:'center'}}>
                          Enrolees
                       </Title>
                    </Body>
                    <Right style={{maxWidth:50}}>
                       <Button onPress={()=>this.logout()} transparent>
                           <Icon type="AntDesign" name="logout"/>
                       </Button>
                    </Right>
                </Header>
                        
              

                   
                       
                    
                    <View style={{flex:1}}>
                         
               {
                   started && (
                       <Spinner color={Colors.Brand.brandColor} style={{alignSelf:'center'}}/>
                   )
               }

               {
                   failed && (
                       <Button onPress={()=> this.props.getEnrolees({hcp_id:this.props.user.id})} bordered style={{alignSelf:'center'}}>
                            <Icon name="reload-circle-outline"/>
                           <Text uppercase={false}>Retry</Text>
                       </Button>
                   )
               }

               {
                   success && this.props.enrolees.length == 0 && (
                       <View style={{flex:1,justifyContent:'center',alignContent:"center",alignItems:'center'}}>
                           <Icon style={{fontSize:120,color:Colors.Brand.brandColor}} name="users" type="FontAwesome"/>
                           <H3 style={{marginTop:20}}>Enrolee have no Dependents</H3>
                       </View>
                   )
               }
                


              {
                  this.props.enrolees.length > 0 ?
                  <FlatList
                data={this.props.enrolees}
                renderItem={({item,index})=>
                      item.family_name && item.other_name?
                      <ListItem onPress={()=>this.navigate("stack.hmo.enrolee",item)} key={index} noIndent noBorder >
                          <Avatar 
                          imageStyle={{alignSelf:"center"}}  
                          size={50} source={require("../../../assets/media/images/default.png")}/>
                          <Body>
                              <Text note style={styles.label}>
                                  {item.family_name + " " + item.other_name}
                              </Text>
                              <Text note style={styles.listBodyText}>
                                  {item.enrolee_id}
                              </Text>
                          </Body>
                     </ListItem>
                     :null
                                
            
               }
              />:null
              }
                    </View>

                    
                          
                    <View style={{flexDirection:"row",justifyContent:'center',alignContent:'center',alignItems:'center',marginVertical:20}}>
                                 
                                
                    
                                   
                                   <TouchableOpacity  style={{alignContent:'center',alignItems:'center'}}>
                                       <View style={styles.icoContainer}>
                                        <Icon style={styles.ico} type="FontAwesome"  name="whatsapp" />
                                       </View>
                                       <Text style={styles.labelList} note>Chat</Text>
                                   </TouchableOpacity>

                                   <TouchableOpacity onPress={()=>this.navigate("stack.user.bmi",{})} style={{alignContent:'center',alignItems:'center'}}>
                                       <View style={styles.icoContainer}>
                                        <Icon style={styles.ico} type="MaterialIcons" name="calculate" />
                                       </View>
                                       <Text style={styles.labelList} note>BMI</Text>
                                   </TouchableOpacity>

                        </View>
                    

                       
               </View>
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    listBodyText:{
        fontSize:14,
        color:"#555"
      },
    label:{
        color:Colors.Brand.brandColor,
        fontWeight:'900',
        fontSize:16
    },
    mainContainer : {
        flex: 1
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
        backgroundColor:Colors.Brand.brandColor,
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
})

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)