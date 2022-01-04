import React from 'react';
import {Modal,View,ScrollView,StyleSheet,StatusBar} from 'react-native'
import {PricingCard} from 'react-native-elements'
import {plan} from '../utils/types';
import {H1,H2,Text,Icon,Header,Body,Left, Button} from 'native-base';
import planFeatures,{featureType,AllPlans} from '../data/planSummary'
import Colors from '../../configs/styles/index'
import planSummary from '../data/planSummary';

type Props = {
    showModal:boolean,
    plan : plan,
    closeModal : ()=>void
}



const styles = StyleSheet.create({
    mainContainer:{
       flex:1,
       backgroundColor:"#f0f0f0"
    },
    containers : {
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    pricingContainer:{
        paddingVertical:15,
    },

    featureContainer:{
        paddingHorizontal:10,
        flex:1,
    },
    genText:{
        textAlign:'center',
        marginVertical:5
    },
    header :{
        fontWeight:"bold",
        color:Colors.Brand.getBrandColorByOpacity(0.9)
    },

    featureHeader:{
         fontWeight:"bold",
         fontSize:15,
         color:Colors.Brand.brandColor,
         marginVertical:10,
         backgroundColor:Colors.Brand.getBrandColorByOpacity(0.1),
         paddingVertical:10,
         marginHorizontal:100,
         borderRadius:50
    },

    featureText:{
        backgroundColor:"#f5f5f5",
        borderRadius:15,
        marginHorizontal:10,
        paddingVertical:15,
        color:"#444",
        fontWeight:"500",
        paddingHorizontal:10,
        borderWidth:1,
        borderColor:"#e9e9e9"
    }
})

function getPlanStyle(feature:string){
    switch(feature){
        case featureType.HEADER : {
            return styles.featureHeader
        }
        case featureType.TEXT : {
            return styles.featureText
        }
    }
 }
 

 function getFeatures(planName:string){
     switch(planName){
         case AllPlans.TOPAZ : {
             let plans = Object.assign([],planSummary.TOPAZ)
             plans.splice(0,1);
             return plans;
         }

         case AllPlans.DIAMOND : {
            return planSummary.DIAMOND;
        }

        case AllPlans.SAPPHIRE : {
            return planSummary.SAPPHIRE;
        }

        case AllPlans.RUBY : {
            return planSummary.RUBY;
        }

        case AllPlans.EMERALD : {
            return planSummary.EMERALD;
        }

        default : {
            return []
        }
     }
 }


 const Plans = (props:Props) => (
        <Modal  
          visible={props.showModal} onRequestClose={()=>props.closeModal()} >
           <Header 
               hasTabs
               androidStatusBarColor={Colors.Brand.brandColor}
               style={{backgroundColor:"#f0f0f0"}}>
               <Left>
                 <Button onPress={()=>props.closeModal()} transparent>
                     <Icon style={{color:Colors.Brand.brandColor}} name="arrow-back"/>
                 </Button>
               </Left>
               <Body></Body>
           </Header>
           <View style={styles.mainContainer}>
                <View style={[styles.containers,styles.pricingContainer]}>
                        <H1 style={styles.header}>
                            {props.plan.name}
                        </H1>

                        <Text style={styles.header}>
                        ₦ {props.plan.plan_price}
                        </Text>
                    </View>

                    <View style={styles.featureContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {getFeatures(props.plan.name).map((feature,index)=>
                                <Text style={[styles.genText,getPlanStyle(feature.type)]}>
                                {featureType.HEADER == feature.type ? "+ ":""}{feature.text}
                                </Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            

             
        </Modal>
   )

export default Plans
