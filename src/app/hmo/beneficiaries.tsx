import React from 'react';
import {View,StyleSheet,TouchableOpacity, PermissionsAndroid,Platform, Alert,BackHandler, ImageBackground,FlatList} from 'react-native'
import {H1,Container,Header,Left, Body, Title, Fab,Text, Icon, H2,ListItem, Right, H3, Button,List,Spinner} from 'native-base'
import Colors from '../../configs/styles/index'
import {toggleSideMenu} from './navigations.actions';
import Geolocation from "react-native-geolocation-service";
import { Navigation } from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib'
import helperFuncs  from '../utils/utils'
import {connect} from 'react-redux';
import {User,Dependent} from '../utils/types'

type Props = {

    componentId :string;
    user : User;
    dependents:Dependent[];
    dependentsStatus : string;

    getDependents:(payload:any)=>void
}





const mapStateToProps = (store:any)=>({
    dependents: store.Hmo.dependents,
    dependentsStatus : store.Hmo.dependentsStatus
})

const mapDispatchToProps = (dispatch:any)=>({
   getDependents :(payload:any)=> dispatch({type:"DO-GET-DEPENDENTS-HMO",payload:payload})
})

 class Dashboard extends React.Component<Props> {


    state = {
        latitude:0,
        longitude:0
    }

    getDependents(){
        this.props.getDependents({principal_id:this.props.user.ukey})
    }

    componentDidMount(){
        this.getDependents();
        BackHandler.addEventListener("hardwareBackPress",this.onBackButtonPressed)
     }

 
     onBackButtonPressed(){
         helperFuncs.reconcileRouteHistoryForSidemenu("stack.hmo.beneficiaries")
         return false;
     }

     back(){
          helperFuncs.reconcileRouteHistoryForSidemenu("stack.hmo.beneficiaries")
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
    


    render(){
        const listStatus = this.getResourceStatus(this.props.dependentsStatus);
        console.log(this.props.dependents)
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
                           <Title style={{color:"#444",fontWeight:"400"}}>Dependents</Title>
                        </Body>
                    
                    </Header>

              
                   
               

               {
                   listStatus.started && (
                       <Spinner color={Colors.Brand.brandColor} style={{alignSelf:'center'}}/>
                   )
               }

               {
                   listStatus.failed && (
                       <Button onPress={()=>this.getDependents()} bordered style={{alignSelf:'center'}}>
                            <Icon name="reload-circle-outline"/>
                           <Text uppercase={false}>Retry</Text>
                       </Button>
                   )
               }

               {
                   listStatus.success && this.props.dependents.length == 0 && (
                       <View style={{flex:1,justifyContent:'center',alignContent:"center",alignItems:'center'}}>
                           <Icon style={{fontSize:120,color:Colors.Brand.brandColor}} name="users" type="FontAwesome"/>
                           <H3 style={{marginTop:20}}>Enrolee have no Dependents</H3>
                       </View>
                   )
               }
                


              {
                  this.props.dependents.length > 0 ?
                  <FlatList
                
                data={this.props.dependents}
                keyExtractor={(item)=>item.dependant_dob}
                renderItem={({item})=>
              
                      <ListItem noIndent noBorder style={styles.listItem} >
                          <Avatar 
                          imageStyle={{alignSelf:"center"}}  
                          size={50} source={require("../../../assets/media/images/default.png")}/>
                          <Body>
                              <Text note style={styles.label}>
                                  {item.dependant_name}
                              </Text>
                              <Text note style={styles.listBodyText}>
                                  {item.dependant_dob}
                              </Text>
                          </Body>
                     </ListItem>
                                
            
               }
              />:null
              }
          
                        
              

                    
                    
                       
            </Container>
        )
    }
}


const styles = StyleSheet.create({
    label:{
        color:Colors.Brand.brandColor,
        fontWeight:'900',
        fontSize:16,
    },
    iconLeft:{
        color:Colors.Brand.brandColor
    },
    listBodyText:{
      fontSize:14,
      color:"#555"
    },
    mainContainer : {
        flex: 1,
        backgroundColor:"#f7f7f7"
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
        zIndex:2000,
        backgroundColor:"#f7f7f7"

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
    listItem:{
        backgroundColor:"#ffffff",
        marginVertical:5,
        marginHorizontal:20,
        borderRadius:15
      }
})

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)