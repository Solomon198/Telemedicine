import React,{Component} from 'react';
import {Container,H3,ListItem,Body,Text,Icon,Header,Left,Button} from 'native-base'
import {ScrollView,StyleSheet,Dimensions,TouchableOpacity} from 'react-native'
import Colors from '../../configs/styles/index'
import {HealthCareProvider} from '../utils/types'
import { Navigation } from 'react-native-navigation';
const {width,height} = Dimensions.get("window");
type Props = {
    hcp:HealthCareProvider
}
export default class HcpInformation extends Component<Props> {
           render(){
                return (
                    <Container style={[{width:width,marginTop:10},{backgroundColor:"transparent"}]}>
                    <Header hasTabs style={{backgroundColor:"transparent"}}>
                       <Left>
                         <Button transparent onPress={()=>Navigation.dismissAllModals()}>
                           <Icon name="arrow-back" style={{color:Colors.Brand.brandColor}}/>
                         </Button>
                       </Left>
                       <Body></Body>
                    </Header>
                    <H3 style={{marginLeft:30,fontSize:18,marginBottom:10,fontWeight:"bold",color:"#444"}}>Health Care Provider Information</H3>
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
                            <TouchableOpacity>
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
                            <TouchableOpacity>
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
        backgroundColor:Colors.Brand.brandColor,
        width:50,
        borderWidth:1,
        borderRadius:100,
        borderColor:Colors.Brand.getBrandColorByOpacity(0.3),
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
