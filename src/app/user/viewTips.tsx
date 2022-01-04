import React from 'react';
import {View,StyleSheet,BackHandler,TouchableOpacity,FlatList,ScrollView,Dimensions,Image} from 'react-native'
import {Icon,Header,Right,Left,Body,Container, Title,Text, H1,H3, ListItem, Item} from 'native-base'
import Colors from '../../configs/styles/index';
import {TabBar} from 'react-native-ui-lib';
import helperFuncs from '../utils/utils';
import { Navigation } from 'react-native-navigation';
import HealthTips from './healthTips.data'
import { Avatar } from 'react-native-ui-lib';
import Modal from 'react-native-modalbox';
const {width,height} = Dimensions.get("window")

type Props = {
    componentId:string;
    tips:{
        text:string;
        image : any;
        title:string;
    }
}

export default class TipsView extends React.Component<Props>{
    state = {
        
    }

    back(){
        Navigation.pop(this.props.componentId)
    }

    render(){
        return (
            <Container>
                  
                  <Header hasTabs style={styles.header}>
                      <Left style={{maxWidth:50}}>
                          <TouchableOpacity onPress={()=>this.back()} style={styles.avatarContainer}>
                         
                             <Icon style={{color:Colors.Brand.brandColor}} name="arrow-back"/>

                          </TouchableOpacity>
                      </Left>
                      <Body>
                          <Title style={{color:"#000"}}>
                              {this.props.tips.title}
                          </Title>
                          
                      </Body>
                  </Header>
                  
                   <ScrollView>
                        <View style={{width:width,height:200}}>
                        <Image resizeMethod="resize" resizeMode="cover" style={{flex:1,borderRadius:10,width:null,marginHorizontal:10}} source={this.props.tips.image}/>
                        </View>

                        <Text style={{color:"#555",marginTop:10,marginHorizontal:10,lineHeight:25}}>
                            {this.props.tips.text}
                        </Text>
                   </ScrollView>


            </Container>
        )
    }
}

const styles = StyleSheet.create({
    
    selectedStyle:{
        color:Colors.Brand.brandColor,
        fontWeight:'bold'
    },
    header:{
        backgroundColor:"#fff",
    },
    avatarContainer:{
        width:40,
        height:40,
        maxWidth:50,
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    label:{
        color:Colors.Brand.brandColor 
    },
    notificationContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:"center",
        alignContent:'center'
    }
})