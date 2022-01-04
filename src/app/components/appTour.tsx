/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React,{Component} from 'react';
 import {
   View,
   StyleSheet,
   Image
 } from 'react-native';
 import ViewPager from 'react-native-pager-view'
 import {Text,Button} from 'native-base'
 import StyleConfig from "../../configs/styles/index";
 import {PageControl,Avatar} from 'react-native-ui-lib';
 import healthTips from '../user/healthTips.data';
 import {connect} from 'react-redux'
import { Navigation } from 'react-native-navigation';
import { AuthNavigationSettingStack } from '../../../nav.config/nav.stack';
 
 type Props = {
    finishTour:()=>void;
 }
 
 const mapStateToProps = (store:any)=>({
 })

 const mapDispatchStateToProps = (dispatch:any)=>({
    finishTour : ()=>dispatch({type:"DO-TOUR-FINISH"})
 })


 class AppIntro extends Component<Props> {
 
   state = {
     active:0,
     pages :  [
       
        
         {
             icon:<Image style={{width:200,height:200}} resizeMethod="resize" resizeMode="contain" source={require("../../../assets/dashboard/chat.png")}/>,textDescription:"",
             title:"Instant messaging"
         },
 
         {
           icon:<Image style={{width:200,height:200}} resizeMethod="resize" resizeMode="contain" source={require("../../../assets/dashboard/bmi.png")}/>,textDescription:"",
           title:"Check your BMI"
       },
 
       {
        icon:<Image style={{width:200,height:200}} resizeMethod="resize" resizeMode="contain" source={require("../../../assets/dashboard/location.png")}/>,textDescription:"",
        title:"Search for Health Care providers near you"
       },


       {
        icon:<Image style={{width:200,height:200}} resizeMethod="resize" resizeMode="contain" source={require("../../../assets/dashboard/visit.png")}/>,textDescription:"",
        title:"Easy Access to Health Care Providers"
       },
    
    
 
    
     ],
 }
 
 
   
 
        
 
      
       finishedTours(){
      
         AuthNavigationSettingStack().then((v)=>{
          this.props.finishTour()
         })
 
       }
 
 
       setNewPage(n:number){
       this.setState({active:n})
       }
 
   
       render(){
         return (
                            <View style={{flex:1,backgroundColor:"#fff"}}>
                          
                         <ViewPager
                             initialPage={0}
                             style={{flex:1}}
                             onPageSelected={(e)=> this.setNewPage(e.nativeEvent.position)}
                         >
 
                                     
                                        
 
 
 
                             {
                                 this.state.pages.map((val,index)=>
                                     <View key= {(index+1)+""} 
                                       style={{
                                           flex:1,
                                           justifyContent:'center',
                                           alignContent:'center',
                                           alignItems:'center',
                                           backgroundColor:"#fff",
                                           
                                         }}
                                     >
     
                                      <View style={styles.iconContainer}>
                                        {val.icon}
                                       </View>
 
                                       <Text style={{color:StyleConfig.Brand.brandColor,marginVertical:3,fontSize:25,textAlign:'center',paddingHorizontal:10}}>
                                           {val.title}
                                       </Text>
                                      <Text numberOfLines={3} note style={{color:"#555",marginVertical:10,textAlign:'center',marginHorizontal:20}}>
                                          {val.textDescription}
                                       </Text>
                                             
 
                                      {
                                               index == this.state.pages.length - 1 ?
                                               <Button rounded onPress={()=>this.finishedTours()} style={{backgroundColor:StyleConfig.Brand.brandColor,marginTop:10,alignSelf:'center'}}>
                                                   <Text uppercase={false} style={{color:"#fff"}}>
                                                     Get Started
                                                   </Text>
                                               </Button>:null
                                           }
 
 
 
                                          
 
                                  
                                     </View>
                                 )
                             }
                                 
                               
                         </ViewPager>
 
                         <PageControl
                            containerStyle={{height:40}}
                            numOfPages={this.state.pages.length}
                            currentPage={this.state.active}
                            inactiveColor={"#777"}
                            spacing={10}
                            color={StyleConfig.Brand.brandColor}             
                         />
                         
              </View> 
       )
       }
 
 
 }
 
 
 const styles = StyleSheet.create({
   textColor:{
     color:"#555"
   },
   img:{
     height:300,
     borderRadius:50,
     marginHorizontal:10
   },
   icons:{
       fontSize:100,},
       iconContainer:{
       marginBottom:50,
       width:140,
       height:140,
       borderRadius:100,
       justifyContent:'center',
       alignContent:'center',
       alignSelf:'center',
       borderColor:"#f4f4f4",
       borderWidth:1,
       alignItems:'center',
       marginTop:-50}
     
 
 })
 
 
 export default connect(mapStateToProps,mapDispatchStateToProps) (AppIntro)