import React from 'react';
import {View,StyleSheet,TouchableOpacity, PermissionsAndroid,Platform, Alert,BackHandler, Image,Dimensions,FlatList} from 'react-native'
import {H1,Container,Header,Left, Body, Title, Fab,Text, Icon, H2,ListItem, Right, H3, Button,List,Spinner} from 'native-base'
import Colors from '../../configs/styles/index'
import {toggleSideMenu} from './navigations.actions';
import Geolocation from "react-native-geolocation-service";
import { Navigation } from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib'
import helperFuncs  from '../utils/utils'
import {connect} from 'react-redux';
import SpinKit from 'react-native-spinkit'
import {User,Dependent} from '../utils/types'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import Modal from 'react-native-modalbox';

const {width,height} = Dimensions.get("window")
type Props = {

    componentId :string;
    user : User;
    
}





const mapStateToProps = (store:any)=>({

})

const mapDispatchToProps = (dispatch:any)=>({

})




 class MedicalReport extends React.Component<Props> {


    state = {
        latitude:0,
        longitude:0,
        report:[],
        modalVisible:false,
        image:"",
        mediaLoading:false,
        pageLoading:false
    }


    ref =  firestore().collection("MedicalReports").limit(500).where("enrolee_id","==",this.props.user.enrolee_id)

   
    componentDidMount(){
        this.setState({pageLoading:true})
        this.ref.get().then((item)=>{
            
            if(!item.empty){
                let doc:any[] = [];
                item.forEach((data)=>{
                    doc.push(data.data())
                })
                this.setState({report:doc,pageLoading:false})
            }else{
                this.setState({pageLoading:false,report:[]})
            }
        
        }).catch((e)=>{
            this.setState({pageLoading:false})
        })
        BackHandler.addEventListener("hardwareBackPress",this.onBackButtonPressed)
     }


     renderFullImage(){
        if(!this.state.image) return;
        return (
            <Modal  isOpen={this.state.modalVisible}  onClosed={()=>this.setState({modalVisible:false})} backButtonClose swipeArea={20}>
                
                 <View style={{backgroundColor:"#333",flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    
                     <TouchableOpacity onPress={()=>this.setState({modalVisible:false})} style={{position:'absolute',top:0,zIndex:100000,right:0,padding:20}}>
                        <Icon style={{color:"#fff"}} name="close"/>
                     </TouchableOpacity>
                     {
                       this.state.mediaLoading &&
                       <Spinner style={{zIndex:10000000,position:"absolute",top:height/2,bottom:0,left:0,right:0}} size={100}/>
                       
                     }
                     
                       <Image
                       resizeMethod="resize"
                       resizeMode="contain"
                       onError={()=>{
                         Alert.alert("Could not load image");
                         this.setState({mediaLoading:false,showFiles:false})
                       }}
                       onLoad={()=>{this.setState({mediaLoading:false})}}
                       onLoadStart={()=>this.setState({mediaLoading:true})}
                       source={{uri:this.state.image}} 
                       style={{width:width,height:height}}
                       />
                      
                     
              

                </View>
              
                
                
            </Modal>
        )
    }

 
     onBackButtonPressed(){
         helperFuncs.reconcileRouteHistoryForSidemenu("stack.hmo.medicalBills")
         return false;
     }

     back(){
          helperFuncs.reconcileRouteHistoryForSidemenu("stack.hmo.medicalBills")
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
        return (
            <Container style={styles.mainContainer}>

                        {this.renderFullImage()} 

                     <Header hasTabs  androidStatusBarColor={Colors.Brand.brandColor} style={styles.header}>
                        <Left style={{maxWidth:60}}>
                            <View>
                                <TouchableOpacity onPress={()=>this.back()}  style={styles.btnMenu}>
                                    <Icon style={{color:Colors.Brand.brandColor}} name="arrow-back"/>
                                    
                                </TouchableOpacity>
                            </View>
                        </Left>
                        
                        <Body>
                           <Title style={{color:"#444",fontWeight:"400"}}>Medical Reports</Title>
                        </Body>
                    
                    </Header>

                    {
                      this.state.pageLoading &&(
                         <View style={{alignItems:'center',alignContent:'center',marginTop:70}}>
                              <SpinKit style={{marginVertical:30}} type="Circle" color={Colors.Brand.brandColor}/>
                             <Text>Getting reports ... </Text>
                         </View>
                      )
                    }

         <FlatList

          ListEmptyComponent={()=> !this.state.pageLoading ? (
           <Text style={{alignSelf:'center',color:Colors.Brand.brandColor,marginTop:200,fontSize:30,fontFamily:"sans-serif-thin"}}>No Reports</Text>
):<Text></Text>}
                numColumns={2}
                data={this.state.report as any[]}
                renderItem={({item,index})=>
              
                <TouchableOpacity onPress={()=>this.setState({modalVisible:true,image:item.images})} style={{width:(width/2) - 4 ,margin:2}}>
                <View style={{height:200,backgroundColor:"#f4f4f4",borderRadius:10}}>
               <Image resizeMethod="resize" resizeMode="cover" style={{flex:1,borderRadius:10,width:null}} source={{uri:item.images}}/>
               </View>
               <Text numberOfLines={2} ellipsizeMode="tail">
                   {item.desc}
               </Text>
            </TouchableOpacity>
                       
                                
            
               }
              />
                   
               

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

export default connect(mapStateToProps,mapDispatchToProps)(MedicalReport)