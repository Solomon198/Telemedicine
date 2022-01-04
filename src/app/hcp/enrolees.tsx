import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  PermissionsAndroid,
  Platform,
  Alert,
  FlatList,
  TouchableNativeFeedback,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {
  H1,
  Container,
  Header,
  Left,
  Body,
  Title,
  ListItem,
  Spinner,
  Text,
  Icon,
  H2,
  Button,
  Right,
  H3,
  Fab,
} from 'native-base';
import Colors from '../../configs/styles/index';
import {toggleSideMenu} from './navigations.actions';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from 'react-native-geolocation-service';
import {Navigation} from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib';
import {connect} from 'react-redux';
import {User} from '../utils/types';
import MMKVStorage from 'react-native-mmkv-storage';
import helperFuncs from '../utils/utils';
import SpinKit from 'react-native-spinkit';
import Splashscreen from 'react-native-splash-screen';
import realm from 'realm';
import {firebase} from '@react-native-firebase/storage';

const {width} = Dimensions.get('window');
const storage = new MMKVStorage.Loader().initialize();

type Props = {
  componentId: string;
  user: User;
  enrolees: User[];
  enroleesStatus: string;
  logout: () => void;
  getEnrolees: (payload: any) => void;
  searchEnrolees: (payload: string) => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
  enrolees: store.Hcp.enrolees,
  enroleesStatus: store.Hcp.enroleesStatus,
});

const mapDispatchToProps = (dispatch: any) => ({
  getEnrolees: (payload: any) =>
    dispatch({type: 'DO-GET-ENROLEES-HCP', payload: payload}),
  logout: () => dispatch({type: 'DO-LOGOUT'}),
  searchEnrolees: (payload: string) =>
    dispatch({type: 'DO-SEARCH-ENROLEE-HCP', payload: payload}),
});

class Enrolees extends React.Component<Props> {
  state = {
    latitude: 0,
    longitude: 0,
    drugs: [],
    loading: 'default',
    addNewDrug: false,
    description: '',
    drugName: '',
  };

  drugsRef = firebase.firestore().collection('Drugs');
  watchDrugsRef: any;

  getResourceStatus(statusCheck: string) {
    let status = {
      success: false,
      failed: false,
      started: false,
    };

    let started = statusCheck.indexOf('STARTED');
    let failed = statusCheck.indexOf('FAILED');
    let success = statusCheck.indexOf('SUCCESS');

    if (started >= 0) {
      status.started = true;
    }

    if (failed >= 0) {
      status.failed = true;
    }

    if (success >= 0) {
      status.success = true;
    }

    return status;
  }

  async requestPersmission() {
    try {
      if (Platform.OS === 'android') {
        let permission = await PermissionsAndroid.request(
          'android.permission.ACCESS_FINE_LOCATION',
        );
        let permission2 = await PermissionsAndroid.request(
          'android.permission.ACCESS_COARSE_LOCATION',
        );

        if (permission === 'granted' && permission2 === 'granted') {
          //granted
        } else {
          Alert.alert(
            'Permission !!!!',
            'App needs permission to function correctly',
          );
        }
      } else {
        //  requestAuthorization();
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  getCurrentPosition() {
    Geolocation.watchPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        this.setState({latitude, longitude});
      },
      (error) => {
        this.getCurrentPosition();
      },
      {enableHighAccuracy: true},
    );
  }

  navigate(name: string, user: any) {
    Navigation.push(this.props.componentId, {
      component: {
        id: name,
        name: name,
        passProps: {
          user: user,
        },
      },
    });
  }

  componentDidMount() {
    Splashscreen.hide();

    this.watchDrugsRef = this.drugsRef.onSnapshot((snapshot) => {
      let docs: any[] = [];
      snapshot.forEach((d) => {
        docs.push({...d.data(), id: d.id});
      });
      this.setState({drugs: docs});
    });
  }

  componentWillUnmount() {
    if (this.watchDrugsRef) {
      this.watchDrugsRef();
    }
  }

  delete(id: string) {
    const doc = this.drugsRef.doc(id);
    doc.delete();
  }

  confirmDelete(id: string) {
    Alert.alert('', 'Are you sure you want to delete drug ?', [
      {onPress: () => '', text: 'No'},
      {onPress: () => this.delete(id), text: 'Yes'},
    ]);
  }
  addDrugs() {
    const {drugName, description} = this.state;
    if (drugName.trim().length > 1 && description) {
      this.drugsRef.add({
        drugName,
        description,
      });
      this.setState({
        addNewDrug: false,
        loading: false,
        drugName: '',
        description: '',
      });
    } else {
      ToastAndroid.show('Please enter valid drug name or description');
    }
  }

  logout() {
    Alert.alert('Log Out', 'Are you sure you want to log out ? ', [
      {onPress: () => this.props.logout(), text: 'Confirm'},
      {onPress: () => '', text: 'cancel'},
    ]);
  }

  render() {
    const {success, failed, started} = this.getResourceStatus(
      this.props.enroleesStatus,
    );

    if (this.state.addNewDrug) {
      return (
        <View style={styles.container}>
          <Header
            hasTabs
            androidStatusBarColor={Colors.Brand.brandColor}
            style={styles.header}>
            <Left style={{maxWidth: 50}}>
              <View>
                <TouchableNativeFeedback
                  onPress={() => Navigation.pop(this.props.componentId)}>
                  <Icon
                    style={{color: Colors.Brand.brandColor}}
                    name="arrow-back"
                  />
                </TouchableNativeFeedback>
              </View>
            </Left>

            <Body>
              <Title
                style={{color: Colors.Brand.brandColor, fontWeight: 'bold'}}>
                Add New Drug
              </Title>
            </Body>
            <Right style={{maxWidth: 50}}></Right>
          </Header>
          <View style={{width: width, marginTop: 50}}>
            <TextInput
              onChangeText={(text: string) => this.setState({drugName: text})}
              style={styles.search}
              value={this.state.drugName}
              placeholder="Drug Name"
              placeholderTextColor="#666"
            />
          </View>
          <View style={{width: width, marginVertical: 10}}>
            <TextInput
              onChangeText={(text: string) =>
                this.setState({description: text})
              }
              keyboardType="number-pad"
              style={styles.search}
              value={this.state.description}
              placeholder="Drug Price"
              placeholderTextColor="#666"
            />
          </View>

          <Button
            onPress={() => this.addDrugs()}
            rounded
            block
            style={{marginHorizontal: 20}}>
            <Text>Add Drug</Text>
          </Button>
        </View>
      );
    }
    return (
      <Container style={styles.mainContainer}>
        <View style={styles.container}>
          <Header
            hasTabs
            androidStatusBarColor={Colors.Brand.brandColor}
            style={styles.header}>
            <Left style={{maxWidth: 50}}>
              <View>
                <TouchableNativeFeedback
                  onPress={() => Navigation.pop(this.props.componentId)}>
                  <Icon
                    style={{color: Colors.Brand.brandColor}}
                    name="arrow-back"
                  />
                </TouchableNativeFeedback>
              </View>
            </Left>

            <Body>
              <Title
                style={{color: Colors.Brand.brandColor, fontWeight: 'bold'}}>
                Manage drugs
              </Title>
            </Body>
            <Right style={{maxWidth: 50}}></Right>
          </Header>

          <View style={{flex: 1}}>
            {/* {failed && (
              <Button
                onPress={() =>
                  this.props.getEnrolees({hcp_id: this.props.user.hcp})
                }
                rounded
                style={{alignSelf: 'center'}}>
                <Icon name="reload-circle-outline" />
                <Text uppercase={false}>Retry</Text>
              </Button>
            )} */}

            {success && this.props.enrolees.length == 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <H3 style={{marginTop: 20, fontFamily: 'sans-serif-thin'}}>
                  No Enrollees found
                </H3>
              </View>
            )}

            {
              <FlatList
                data={this.state.drugs}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      marginTop: 100,
                      alignItems: 'center',
                    }}>
                    <Text>No Drugs Available</Text>
                  </View>
                )}
                keyExtractor={(item) => item._id}
                renderItem={({item, index}) => (
                  <ListItem
                    style={styles.items}
                    // onPress={() => this.navigate('stack.hmo.enrolee', item)}
                    key={index}
                    noIndent
                    noBorder>
                    <Avatar
                      imageStyle={{alignSelf: 'center'}}
                      size={50}
                      source={require('../../../assets/media/images/im.jpg')}
                    />
                    <Body>
                      <Text note style={styles.label}>
                        {item.drugName}
                      </Text>
                      <Text note style={styles.listBodyText}>
                        ₦{item.description}
                      </Text>
                    </Body>
                    <Right>
                      <Button
                        onPress={() => this.confirmDelete(item.id)}
                        transparent>
                        <Icon
                          style={{
                            color: Colors.Brand.getBrandColorByOpacity(0.3),
                          }}
                          type="Entypo"
                          name="trash"
                        />
                      </Button>
                    </Right>
                  </ListItem>
                )}
              />
            }
          </View>
        </View>
        <Fab
          direction="up"
          containerStyle={{}}
          style={{backgroundColor: '#5067FF'}}
          position="bottomRight"
          onPress={() => this.setState({addNewDrug: true})}>
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  search: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  items: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 15,
  },
  listBodyText: {
    fontSize: 14,
    color: '#555',
    marginTop: 1,
  },
  label: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  icoContainer: {
    height: 50,
    backgroundColor: StyleConfig.Brand.brandColor,
    width: 50,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: StyleConfig.Brand.getBrandColorByOpacity(0.3),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  labelList: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: 'bold',
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#f7f7f7',
    zIndex: 2000,
  },
  btnMenu: {
    backgroundColor: Colors.Brand.brandColor,
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    zIndex: -10,
  },
  ico: {
    color: '#fff',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Enrolees);
