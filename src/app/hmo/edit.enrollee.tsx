import React from 'react';
import {View,StyleSheet,TouchableOpacity, PermissionsAndroid,Platform, Alert,BackHandler, ImageBackground,ScrollView,Dimensions} from 'react-native'
import {H1,Container,Header,Left, Body, Content, Spinner,Text, Icon, H2,ListItem, Right, H3, Button} from 'native-base'
import Colors from '../../configs/styles/index'
import Geolocation from "react-native-geolocation-service";
import { Navigation } from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib'
import helperFuncs  from '../utils/utils'
import {connect} from 'react-redux'
import {User,plan,HealthCareProvider,Company,CountryState} from '../utils/types'
import userSaga from './user.saga';
import Modal from 'react-native-modalbox';
import call from 'react-native-phone-call'
import firestore from '@react-native-firebase/firestore'
import { Rating, AirbnbRating } from 'react-native-elements';
import Plan from '../components/plans'
const {width,height} = Dimensions.get("window")

type Props = {

    componentId :string;
    user : User;
    plan:plan;
    hcp:HealthCareProvider;
    userState : CountryState;
    company:Company;
    modalVisible: boolean;

    hcpStatus: string;
    planStatus: string;
    companyStatus: string;
    stateStatus : string;

    getHcp : (payload:any)=> void;
    getPlan : (payload:any)=> void;
    getUserState : (payload:any)=> void;
    getCompany : (payload:any)=> void;
    toggleModal : ()=>void,
    clearInfo:()=>void
}



const mapStateToProps = (store:any)=>({
   plan : store.Hmo.plan,
   hcp : store.Hmo.hcp,
   userState : store.Hmo.state,
   company : store.Hmo.company,

   hcpStatus: store.Hmo.hcpStatus,
   planStatus: store.Hmo.planStatus,
   companyStatus: store.Hmo.companyStatus,
   stateStatus : store.Hmo.stateStatus,
   modalVisible: store.Hmo.modalVisible
})

const mapDispatchToProps = (dispatch:any)=>({
   getHcp : (payload:any)=> dispatch({type:"DO-GET-HCP-HMO",payload}),
   getPlan : (payload:any)=> dispatch({type:"DO-GET-PLAN-INFO-HMO",payload:payload}),
   getUserState : (payload:any)=> dispatch({type:"DO-GET-ENROLEE-STATE-HMO",payload:payload}),
   getCompany : (payload:any)=> dispatch({type:"DO-GET-COMPANY-HMO",payload:payload}),
   toggleModal : ()=> dispatch({type:"DO-TOGGLE-MODAL-HMO"}),
   clearInfo:()=>dispatch({type:"DO-CLEAR-INFO"})
})

 class Dashboard extends React.Component<Props> {


    state = {
        latitude:0,
        longitude:0,
        rating:1,
        comment:"",
        modalVisible:false,
        showModal : false,
        plan : {}
    }

    ref = firestore().collection("Rating").doc(this.props.user.enrolee_id);


    getPlan(){
        try{
            if(this.props.plan.ukey.toString() === this.props.user.plan.toString()) return false
        }catch(e){}
        this.props.getPlan({plan_id:this.props.user.plan});
    }

    getHcp(){
         try{
            if(this.props.user.hcp.toString() === this.props.hcp.ukey.toString()) return false;
         }catch(e){}
         this.props.getHcp({hcp_id:this.props.user.hcp});
     }

     getUserState(){
         try{
            if(this.props.user.state.toString() === this.props.userState.ukey.toString()) return false;
         }catch(e){}
         this.props.getUserState({state_id:this.props.user.state});
     }

     getCompany(){
         try{
            if(this.props.user.company.toString() === this.props.company.ukey.toString()) return false;
         }catch(e){}
         this.props.getCompany({company_id:this.props.user.company});
     }

    componentDidMount(){
        // this.getCompany();
        this.ref.get().then((data)=>{
            if(data.exists){
                let doc:any = data.data();
                this.setState({comment:doc.comment,rating:doc.rating})
            }
        })
        this.getUserState();
        this.getHcp();
        this.getPlan();
        BackHandler.addEventListener("hardwareBackPress",this.onBackButtonPressed);

     }

 
     onBackButtonPressed(){
         helperFuncs.reconcileRouteHistoryForSidemenu("stack.hmo.erollee")
         return false;
     }

     back(){
          helperFuncs.reconcileRouteHistoryForSidemenu("stack.hmo.erollee")
          Navigation.pop(this.props.componentId);
     }
     
     componentWillUnmount(){
       this.props.clearInfo();
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

    call(phone_number:string){
        const args = {
         number: phone_number, // Use commas to add time between digits.
         prompt: false
       }
       
       call(args).catch(console.error)
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

    

    renderHcpInfo(){
        if(!this.props.hcp.account_no) return;
        return (
            <Modal onClosed={()=>this.setState({modalVisible:false})} backButtonClose swipeArea={20} swipeToClose  isOpen={this.state.modalVisible}  style={[styles.modal,styles.modal4]} position={"bottom"} ref={"modal6"}>
                <Container style={[{width:width,marginTop:10,marginBottom:150},{backgroundColor:"transparent"}]}>
                <H3 style={{marginLeft:30,fontSize:18,marginBottom:10,fontWeight:"bold"}}>Health Care Provider Information</H3>
                <ScrollView>
                       <ListItem  noBorder style={styles.listItem}>
                        <Body>
                            <Text uppercase note style={styles.label}>Healcare Provider Name</Text>
                            <Text style={styles.listBodyText}>
                                {this.props.hcp.hcp_name}
                            </Text>
                        </Body>
                        <Icon style={styles.iconLeft} name="medical"/>
                    </ListItem>

                    <ListItem  noBorder style={styles.listItem}>
                        <Body>
                            <Text uppercase note style={styles.label}>Healcare Provider Name</Text>
                            <Text style={styles.listBodyText}>
                                {this.props.hcp.address}
                            </Text>
                        </Body>
                        <Icon style={styles.iconLeft} name="address" type="Entypo"/>
                    </ListItem>

                    <ListItem  noBorder style={styles.listItem}>
                        <Body>
                            <Text uppercase note style={styles.label}>Desk Officer</Text>
                            <Text style={styles.listBodyText}>
                                {this.props.hcp.desk_officer}
                            </Text>
                        </Body>
                        <Icon style={styles.iconLeft} name="person"/>
                    </ListItem>

                    <ListItem  noBorder style={styles.listItem}>
                        <Body>
                            <Text uppercase note style={styles.label}>Desk officer Phone number</Text>
                            <Text style={styles.listBodyText}>
                                {this.props.hcp.desk_officer_phone}
                            </Text>
                        </Body>
                        <TouchableOpacity onPress={()=>this.call(this.props.hcp.desk_officer_phone)}>
                           <Icon style={styles.iconLeft} name="call"/>
                        </TouchableOpacity>
                    </ListItem>

                    <ListItem   noBorder style={styles.listItem}>
                        <Body>
                            <Text uppercase note style={styles.label}>Phone Number</Text>
                            <Text style={styles.listBodyText}>
                                {this.props.hcp.phone}
                            </Text>
                        </Body>
                        <TouchableOpacity onPress={()=>this.call(this.props.hcp.phone)}>
                           <Icon style={styles.iconLeft} name="call"/>
                        </TouchableOpacity>
                    </ListItem>

                    <ListItem  noBorder style={styles.listItem}>
                        <Body>
                            <Text uppercase note style={styles.label}>Email</Text>
                            <Text style={styles.listBodyText}>
                                {this.props.hcp.email}
                            </Text>
                           
                        </Body>
                        <Icon style={styles.iconLeft} name="email" type="Entypo"/>
                    </ListItem>

                    <ListItem  noBorder style={styles.listItem}>
                        <Body>
                            <Text uppercase note style={styles.label}>NHIS number</Text>
                            <Text style={styles.listBodyText}>
                                {this.props.hcp.nhis_no}
                            </Text>
                           
                        </Body>
                        <Icon style={styles.iconLeft} name="format-list-numbered" type="MaterialCommunityIcons"/>
                    </ListItem>

                   


                </ScrollView>
               
                </Container>
               
                
            </Modal>
        )
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

    render(){

        const {email,family_name,address,phone,nin_no,occupation,mstatus,enrolee_id} = this.props.user;

        const {planStatus,companyStatus,stateStatus,hcpStatus} = this.props;

        const _planStatus = this.getResourceStatus(planStatus);
        const _companyStatus = this.getResourceStatus(companyStatus);
        const _stateStatus = this.getResourceStatus(stateStatus);
        const _hcpStatus = this.getResourceStatus(hcpStatus);
 
        return (
            <Container style={styles.mainContainer}>

                        {this.renderHcpInfo()}         

                <ImageBackground  source={require("../../../assets/media/images/sidemenu.jpg")} style={{height:150}}>
                    <Header hasTabs  androidStatusBarColor={Colors.Brand.brandColor} style={styles.header}>
                        <Left>
                            <View>
                                <TouchableOpacity onPress={()=>this.back()}  style={styles.btnMenu}>
                                    <Icon style={{color:"#fff"}} name="arrow-back"/>
                                    
                                </TouchableOpacity>
                            </View>
                        </Left>
                        
                        <Body>
                        
                        </Body>
                        <Right style={{maxWidth:50}}>
                        
                                
                        </Right>
                    </Header>
                 </ImageBackground>

                <View style={{flexDirection:"row"}}>
                   <Avatar 
                      imageStyle={{alignSelf:"center",}}  
                      containerStyle={{marginTop:-40,marginLeft:20}}
                      size={80} 
                      source={helperFuncs.getUserDefaultProfilePhoto(this.props.user)}/>
                    
                       <View style={{padding:10}}>
                            <H3 style={{
                                fontWeight:'bold',
                                color:"#555",
                                marginRight:20,
                                textTransform:"capitalize"
                            }}>
                                {this.props.user.other_name + " " + this.props.user.family_name}
                            </H3>
                            
                        <Text style={{fontSize:12,color:"#555"}}>
                            {this.props.user.email}
                        </Text>  
                        <Button onPress={()=>this.navigate("stack.hmo.dependents",this.props.user)} style={{marginTop:5,backgroundColor:"#fff",padding:10,height:40}} iconLeft dark small transparent rounded>
                            <Icon style={{color:Colors.Brand.brandColor}} name="users" type="FontAwesome"/>
                            <Text style={{color:Colors.Brand.brandColor}} uppercase={false}> See dependents</Text>
                        </Button>
                        <Button 
                            small
                            onPress={()=> !_planStatus.failed ? this.setState({showModal:true,plan:this.props.plan}):this.getPlan() }
                            iconLeft style={{marginRight:20,marginTop:10}} success bordered rounded >
                                
                                {
                                    _planStatus.failed && (
                                        <>
                                            <Icon name="reload-circle-outline"/>
                                            <Text uppercase={false}>Get plan</Text>
                                        </>
                                    )
                                }
                                {
                                    _planStatus.success && (
                                        <>
                                            <Icon name="check-circle" type="FontAwesome"/>
                                            <Text uppercase={false}>
                                            {this.props.plan.name}
                                            </Text>
                                            <Text  uppercase={false}>
                                            ₦ {this.props.plan.plan_price}
                                            </Text>
                                        </>
                                    )
                                }
                                {
                                _planStatus.started && (
                                    <>
                                    <Text>Getting Plan </Text>
                                    <Spinner size={20}/>
                                    </>
                                )
                                }
                            </Button>
                    </View>
                   
                </View>
            
                <ScrollView showsVerticalScrollIndicator={false}>


                <ListItem  noBorder style={styles.listItem}>
                      <Body>
                        <Text uppercase note style={styles.label}>Health care provider</Text>
                        {
                            _hcpStatus.success && (
                                <>
                                   <Text style={styles.listBodyText}>
                                     {this.props.hcp.hcp_name}
                                    </Text>
                                    <Button onPress={()=>this.showInfo(this.props.hcp)}   style={styles.retry} small rounded >
                                        <Text uppercase={false}>View Provider profile</Text>
                                    </Button>
                                </>
                            )
                        }
                        {
                            _hcpStatus.started && (
                                <Text>
                                    ... loading health care providers
                                </Text>
                            )
                        }

                        {
                            _hcpStatus.failed && (

                                <>

                                    <Text>
                                        Could not get hcp
                                    </Text>
                                    <Button style={styles.retry} danger bordered onPress={()=>this.getHcp()} small rounded >
                                        <Text uppercase={false}>Retry</Text>
                                    </Button>

                                </>

                            )
                        }
                      </Body>
                      {
                          _hcpStatus.started &&(<Spinner/>)
                      }
                      {
                          !_hcpStatus.started && (<Icon style={styles.iconLeft} name="medical"/>)
                      }
                      
                  </ListItem>
                  <ListItem noBorder style={styles.listItem}>
                      <Body>
                        <Text uppercase note style={styles.label}>Rating and Comment</Text>
                        <View style={{width:120}}>
                        <AirbnbRating
                            selectedColor={Colors.Brand.brandColor}
                            count={4}
                            isDisabled={true}
                            showRating={false}
                            reviews={["Very bad","Poor","Good","Exellent"]}
                            defaultRating={this.state.rating || 1}
                            size={20}
                        />
                        </View>
                        <Text>
                            {this.state.comment}
                        </Text>
                      </Body>
                      <Icon style={styles.iconLeft} name="star-rate" type="MaterialIcons"/>
                  </ListItem>    
                  <ListItem noBorder style={styles.listItem}>
                      <Body>
                        <Text uppercase note style={styles.label}>Enrollee Id</Text>
                        <Text style={styles.listBodyText}>
                            {enrolee_id}
                        </Text>
                      </Body>
                      <Icon style={styles.iconLeft} name="idcard" type="AntDesign"/>
                  </ListItem>
                  <ListItem noBorder style={styles.listItem}>
                      <Body>
                        <Text uppercase note style={styles.label}>phone number</Text>
                        <Text style={styles.listBodyText}>
                            {phone}
                        </Text>
                      </Body>
                      <Icon style={styles.iconLeft} name="phone" type="Entypo"/>
                  </ListItem>
                  <ListItem noBorder style={styles.listItem}> 
                      <Body>
                        <Text uppercase note style={styles.label}>NIN number</Text>
                        <Text style={styles.listBodyText}>
                            {nin_no}
                        </Text>
                      </Body>
                      <Icon style={styles.iconLeft} name="how-to-reg" type="MaterialIcons"/>
                  </ListItem>
                  <ListItem noBorder style={styles.listItem}>
                      <Body>
                        <Text uppercase note style={styles.label}>
                            Occupation
                        </Text>
                        <Text style={styles.listBodyText}>
                            {occupation}
                        </Text>
                      </Body>
                      <Icon style={styles.iconLeft} name="briefcase" type="Entypo"/>
                  </ListItem>

                  <ListItem noBorder style={styles.listItem}>
                      <Body>
                        <Text uppercase note style={styles.label}>
                            Address
                        </Text>
                        <Text style={styles.listBodyText}>
                            {address}
                        </Text>
                      </Body>
                      <Icon style={styles.iconLeft} name="address-book" type="FontAwesome"/>
                  </ListItem>


                  <ListItem noBorder style={styles.listItem}>
                      <Body>
                        <Text uppercase note style={styles.label}>
                            Enrolee State
                        </Text>
                        {
                            _stateStatus.success && (
                                <>
                                   <Text style={styles.listBodyText}>
                                     {this.props.userState.name}
                                    </Text>
                                
                                </>
                            )
                        }
                        {
                            _stateStatus.started && (
                                <Text>
                                    ... loading user state
                                </Text>
                            )
                        }

                        {
                            _stateStatus.failed && (

                                <>

                                    <Text>
                                        Could not get state
                                    </Text>
                                    <Button style={styles.retry} danger bordered onPress={()=>this.getUserState()} small rounded >
                                        <Text uppercase={false}>Retry</Text>
                                    </Button>

                                </>

                            )
                        }
                      </Body>
                      {
                          _stateStatus.started &&(<Spinner/>)
                      }
                      {
                          !_stateStatus.started && (
                            <Icon style={styles.iconLeft} name="location-pin" type="Entypo"/>
                          )
                      }
                  </ListItem>

                  <ListItem noBorder style={styles.listItem}>
                      <Body>
                        <Text uppercase note style={styles.label}>
                            Marital Status
                        </Text>
                        <Text style={styles.listBodyText}>
                            {mstatus}
                        </Text>
                      </Body>
                      <Icon style={styles.iconLeft} name="users" type="FontAwesome5"/>
                  </ListItem>
                  
                  
                </ScrollView>
            
                        
              {<Plan plan={this.state.plan as plan} showModal={this.state.showModal} closeModal={()=>this.setState({showModal:false})}/>}

                    
                    
                       
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
        marginTop:100,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        backgroundColor:"#f4f4f4",
        width:width
      },
    retry :{
        marginLeft:10
    },
    label:{
        color:Colors.Brand.brandColor,
        fontWeight:'bold',
        fontSize:12,
        textTransform:"capitalize"
    },
    iconLeft:{
        color:Colors.Brand.brandColor
    },
    listBodyText:{
      fontSize:14
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
        backgroundColor:"transparent",
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

    listItem:{
      backgroundColor:"#ffffff",
      marginVertical:5,
      marginHorizontal:20,
      borderRadius:15
    }
})


export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)

