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
  Image,
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
    locations: [],
    loading: 'default',
    addNewLocation: false,
    description: '',
    locationName: '',
    searchResult: [],
  };

  locationRef = firebase
    .firestore()
    .collection('Ordered-Items')
    .doc(this.props.user.enrolee_id)
    .collection('list');
  watchlocationRef: any;

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

  navigate(name: string, props: any) {
    Navigation.push(this.props.componentId, {
      component: {
        id: name,
        name: name,
        passProps: {
          ...props,
        },
      },
    });
  }

  componentDidMount() {
    Splashscreen.hide();

    this.watchlocationRef = this.locationRef.onSnapshot((snapshot) => {
      let docs: any[] = [];
      snapshot.forEach((d) => {
        docs.push({...d.data(), id: d.id});
      });
      this.setState({locations: docs}, () => {
        this.search('');
      });
    });
  }

  componentWillUnmount() {
    if (this.watchlocationRef) {
      this.watchlocationRef();
    }
  }

  delete(id: string) {
    const doc = this.locationRef.doc(id);
    doc.delete();
  }

  confirmDelete(id: string) {
    Alert.alert('', 'Are you sure you have picked up drug ?', [
      {onPress: () => '', text: 'No'},
      {onPress: () => this.delete(id), text: 'Yes'},
    ]);
  }
  addLocation() {
    const {locationName, description} = this.state;
    if (locationName.trim().length > 1 && description.trim().length > 1) {
      this.locationRef.add({
        locationName,
        description,
      });
      this.setState({
        addNewLocation: false,
        loading: false,
        locationName: '',
        description: '',
      });
    } else {
      ToastAndroid.show('Please enter valid location name or description');
    }
  }

  logout() {
    Alert.alert('Log Out', 'Are you sure you want to log out ? ', [
      {onPress: () => this.props.logout(), text: 'Confirm'},
      {onPress: () => '', text: 'cancel'},
    ]);
  }

  search(searchStr: string) {
    let text = searchStr;

    let collection = this.state.locations;

    var data = collection;
    if (text && text.trim() != '') {
      data = collection;
      let data1 = data.filter((item) => {
        return item.locationName.toLowerCase().indexOf(text.toLowerCase()) == 0;
      });

      data = collection;
      let data2 = data.filter((item) => {
        return item.locationName.toLowerCase().indexOf(text.toLowerCase()) > 0;
      });

      data = data1.concat(data2);
    } else {
      data = collection;
    }

    this.setState({searchResult: data});
  }

  render() {
    const {success, failed, started} = this.getResourceStatus(
      this.props.enroleesStatus,
    );

    if (this.state.addNewLocation) {
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
                Add New Location
              </Title>
            </Body>
            <Right style={{maxWidth: 50}}></Right>
          </Header>
          <View style={{width: width, marginTop: 50}}>
            <TextInput
              onChangeText={(text: string) =>
                this.setState({locationName: text})
              }
              style={styles.search}
              value={this.state.locationName}
              placeholder="Location Name"
              placeholderTextColor="#666"
            />
          </View>
          <View style={{width: width, marginVertical: 10}}>
            <TextInput
              onChangeText={(text: string) =>
                this.setState({description: text})
              }
              style={styles.search}
              value={this.state.description}
              placeholder="Location description"
              placeholderTextColor="#666"
            />
          </View>

          <Button
            onPress={() => this.addLocation()}
            rounded
            block
            style={{marginHorizontal: 20}}>
            <Text>Add Location</Text>
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
                Drugs on Delivery
              </Title>
            </Body>
            <Right style={{maxWidth: 50}}></Right>
          </Header>

          <View style={{flex: 1}}>
            {success && this.props.enrolees.length == 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <H3 style={{marginTop: 20, fontFamily: 'sans-serif-thin'}}>
                  No Locations found
                </H3>
              </View>
            )}

            {
              <FlatList
                data={this.state.searchResult}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      marginTop: 100,
                      alignItems: 'center',
                    }}>
                    <Text>No Orders Yet</Text>
                  </View>
                )}
                keyExtractor={(item) => item._id}
                renderItem={({item, index}) => (
                  <ListItem
                    style={styles.items}
                    onPress={() =>
                      this.navigate('stack.user.beneficiaries', {
                        ...this.props,
                        location: item,
                      })
                    }
                    key={index}
                    noIndent
                    noBorder>
                    <View style={{width: 50, maxWidth: 50}}>
                      <Icon name="van-utility" type="MaterialCommunityIcons" />
                    </View>
                    <Body>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text note style={styles.label}>
                          Delivery Location :
                        </Text>
                        <Text note style={{fontSize: 10}}>
                          {item.location.locationName}
                          {', '}
                          {item.location.description}
                        </Text>
                      </View>
                      <Text note style={styles.listBodyText}>
                        Drugs: {item.drugs.map((val) => val.drugName + ',')}
                      </Text>
                      <Button
                        onPress={() => this.confirmDelete(item.id)}
                        rounded
                        block
                        style={{backgroundColor: 'dodgerblue', marginTop: 10}}>
                        <Text uppercase={false}>Confirm Delivery</Text>
                      </Button>
                    </Body>
                  </ListItem>
                )}
              />
            }
          </View>
        </View>
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
    fontSize: 13,
    color: '#555',
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
