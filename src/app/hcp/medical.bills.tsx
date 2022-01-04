import React from 'react';
import {View,ToastAndroid,StyleSheet,TouchableOpacity, PermissionsAndroid,Platform, Alert,BackHandler, Image,Dimensions,FlatList,ScrollView} from 'react-native'
import {H1,Container,Header,Left, Body, Title, Fab,Text, Icon, H2,ListItem, Right, H3, Button,List,Textarea} from 'native-base'
import Colors from '../../configs/styles/index'
import {toggleSideMenu} from './navigations.actions';
import Geolocation from "react-native-geolocation-service";
import { Navigation } from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib'
import helperFuncs  from '../utils/utils'
import {connect} from 'react-redux';
import {User,Dependent} from '../utils/types'
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app'
import fbStore from '@react-native-firebase/firestore';
import Modal from 'react-native-modalbox';
import SpinKit from 'react-native-spinkit'
const firebaseStorage = storage();
const firestore = fbStore();
const {width,height} = Dimensions.get("window")
type Props = {

    componentId :string;
    user : User;

}





const mapStateToProps = (store:any)=>({

})

const mapDispatchToProps = (dispatch:any)=>({

})

 class MedicalBill extends React.Component<Props> {

    state = {
        latitude:0,
        longitude:0,
        bills:[],
        modalVisible:false,
        image : "",
        desc : "",
        uploadedCount:"",
        uploading:false,
        totalPercentage:0,

        modalVisible2:false,
        image2:"",
        mediaLoading:false, 
        pageLoading:false
    }


    ref =  firestore.collection("MedicalBill").limit(500).where("enrolee_id","==",this.props.user.enrolee_id)
 
    refSave =  firestore.collection("MedicalBill");

    renderFullImage(){
        if(!this.state.image2) return;
        return (
            <Modal  isOpen={this.state.modalVisible2}  onClosed={()=>this.setState({modalVisible2:false})} backButtonClose swipeArea={20}>
                
                 <View style={{backgroundColor:"#333",flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    
                     <TouchableOpacity onPress={()=>this.setState({modalVisible2:false})} style={{position:'absolute',top:0,zIndex:100000,right:0,padding:20}}>
                        <Icon style={{color:"#fff"}} name="close"/>
                     </TouchableOpacity>
                     {
                       this.state.mediaLoading &&
                       <SpinKit type="Circle" color={Colors.Brand.brandColor} style={{zIndex:10000000,position:"absolute",top:height/2,bottom:0,left:0,right:0}} size={100}/>
                       
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
                       source={{uri:this.state.image2}} 
                       style={{width:width,height:height}}
                       />
                      
                     
              

                </View>
              
                
                
            </Modal>
        )
    }

    
    componentDidMount(){
        this.setState({pageLoading:true})
        this.ref.get().then((item)=>{
            
            if(!item.empty){
                let doc:any[] = [];
                item.forEach((data)=>{
                    doc.push(data.data())
                })
                this.setState({bills:doc,pageLoading:false})
            }else{
                this.setState({pageLoading:false,bills:[]})
            }
        
        }).catch((e)=>{
            this.setState({pageLoading:false})
        })
        BackHandler.addEventListener("hardwareBackPress",this.onBackButtonPressed)
     }

 
     onBackButtonPressed(){
         helperFuncs.reconcileRouteHistoryForSidemenu("stack.hcp.medicalBills")
         return false;
     }

     back(){
          helperFuncs.reconcileRouteHistoryForSidemenu("stack.hcp.medicalBills")
          Navigation.pop(this.props.componentId);
     }
     
     componentWillUnmount(){
       BackHandler.removeEventListener("hardwareBackPress",this.onBackButtonPressed)
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
    
    upload(media:string){


        let _item = new Date().getTime();
        this.setState({uploading:true})
        
       let task = firebaseStorage.ref("/report/medias/").child("Img"+_item).putFile(media)  
 
       task.on("state_changed",(task)=>{
         let percentageUploaded = (task.bytesTransferred/task.totalBytes )* 100;
         console.log(percentageUploaded+"%")
         this.setState({totalPercentage:percentageUploaded})
       })
 
       task.then((completed)=>{
            task.snapshot?.ref.getDownloadURL().then((url)=>{
             let report = {
                 images:url,
                 hcp_id : this.props.user.hcp,
                 enrolee_id : this.props.user.enrolee_id,
                 desc : this.state.desc,
                 createdAt : firebase.firestore.FieldValue.serverTimestamp(),
               }
             
                let reports:any[] = this.state.bills;
                reports.push(report);
                this.refSave.add(report).then(()=>{
                  this.setState({modalVisible:false,uploading:false,report:reports})
                })
            })
       })
     
  
 }
     
 
     async openCamera(){
          helperFuncs.takeSnapShot().then((url)=>{
              this.upload(url as string)
          })
     }
 
     renderNewReport(){
         return (
             <Modal onClosed={()=>this.setState({modalVisible:false})} backButtonClose swipeArea={20} swipeToClose  isOpen={this.state.modalVisible}  style={[styles.modal,styles.modal4]} position={"bottom"} ref={"modal6"}>
                 <ScrollView style={[{width:width,marginTop:10},{backgroundColor:"transparent"}]}>
                 <Button onPress={()=>this.setState({modalVisible:false},()=>{
                       this.upload(this.state.image)
                 })} rounded disabled={!this.state.desc} style={{alignSelf:"flex-end",marginRight:10}}>
                             <Text uppercase={false}>Save Bill</Text>
              </Button>
                        <Textarea
                            value={this.state.desc}
                            style={{marginTop:30,borderRadius:10,marginHorizontal:10,marginBottom:5}} 
                            rowSpan={5} 
                            onChangeText={(text:string)=>this.setState({desc:text})}
                            placeholderTextColor="#999"
                            bordered placeholder="Comment and recommendation" />
                       <View style={{width:width,height:200}}>
                         
                         <Image resizeMethod="resize" resizeMode="cover" style={{flex:1,borderRadius:10,width:null,marginHorizontal:10,marginBottom:10}} source={{uri:this.state.image}}/>
                         </View>
 
                        
 
                         
                     
                 </ScrollView>
                 
                 
             </Modal>
         )
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
                               

                     <Header hasTabs  androidStatusBarColor={Colors.Brand.brandColor} style={styles.header}>
                        <Left style={{maxWidth:60}}>
                            <View>
                                <TouchableOpacity onPress={()=>this.back()}  style={styles.btnMenu}>
                                    <Icon style={{color:Colors.Brand.brandColor}} name="arrow-back"/>
                                    
                                </TouchableOpacity>
                            </View>
                        </Left>
                        
                        <Body>
                           <Title style={{color:"#444",fontWeight:"400"}}>Medical Bills</Title>
                        </Body>
                    
                    </Header>
                    {this.state.uploading && (
                         <View style={{flexDirection:"row",marginLeft:20,alignItems:'center',backgroundColor:"#f4f4f4",height:20,marginRight:20,borderRadius:10,}}>
                         <Text style={{color:Colors.Brand.brandColor,fontWeight:'bold',marginRight:10}}>
                             {this.state.totalPercentage.toFixed(2)+"%"}
                         </Text>
                         <Text style={{fontWeight:'bold',marginRight:10}}>Uploading</Text>
                         <SpinKit type="Circle" color={Colors.Brand.brandColor} size={20}/>
                     </View>
                    )}
                    {this.renderNewReport()}
                    {this.renderFullImage()}

                    {
                      this.state.pageLoading &&(
                         <View style={{alignItems:'center',alignContent:'center',marginTop:200}}>
                             <SpinKit type="Circle" style={{marginVertical:20}} color={Colors.Brand.brandColor}/>
                             <Text>Getting bills ... </Text>
                         </View>
                      )
                    }

                    <FlatList
                ListEmptyComponent={()=> !this.state.pageLoading ? (
                    <Text style={{alignSelf:'center',fontWeight:"500",color:Colors.Brand.brandColor,marginTop:200,fontSize:30,fontFamily:"sans-serif-thin"}}>No Bills</Text>
                ):<Text></Text>}
                data={this.state.bills as any[]}
                numColumns={2}
                renderItem={({item,index})=>
              
                <TouchableOpacity onPress={()=>this.setState({modalVisible2:true,image2:item.images})} style={{width:(width/2) - 4 ,margin:2}}>
                <View style={{height:200,backgroundColor:"#f4f4f4",borderRadius:10}}>
               <Image resizeMethod="resize" resizeMode="cover" style={{flex:1,borderRadius:10,width:null}} source={{uri:item.images}}/>
               </View>
               <Text note numberOfLines={2} ellipsizeMode="tail">
                   {item.desc}
               </Text>
               </TouchableOpacity>
                                
            
               }
              />
                   

              
                   {
                    !this.state.modalVisible2 &&

                    <Fab
                    active={true}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.openCamera()}>
                    <Icon name="add" />
                   
                </Fab>
                }
               

            </Container>
        )
    }
}


const styles = StyleSheet.create({
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
        marginTop:50,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor:"#f4f4f4",
        width:width
      },
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

export default connect(mapStateToProps,mapDispatchToProps) (MedicalBill)