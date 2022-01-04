import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import {
  H1,
  Container,
  Header,
  Left,
  Body,
  Card,
  ListItem,
  Badge,
  Text,
  Icon,
  H2,
  Button,
  Right,
  H3,
} from 'native-base';
import Colors from '../../configs/styles/index';
import {toggleSideMenu} from './navigations.actions';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import Geolocation from 'react-native-geolocation-service';
import {Navigation} from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib';
import {connect} from 'react-redux';
import {User, hmo} from '../utils/types';
import MMKVStorage from 'react-native-mmkv-storage';
import Splashscreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';
const {width, height} = Dimensions.get('window');

const containerWidth = width / 2 - 10;

const storage = new MMKVStorage.Loader().initialize();

type Props = {
  componentId: string;
  user: hmo;
  enrolees: User[];
  enroleesStatus: string;
  notificationCount: number;
  logout: () => void;
  getEnrolees: () => void;
  setNotificationCount: (count: number, increement: number) => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
  enrolees: store.Hmo.enrolees,
  enroleesStatus: store.Hmo.enroleesStatus,
  notificationCount: store.Hmo.notificationCount,
});

const mapDispatchToProps = (dispatch: any) => ({
  getEnrolees: () => dispatch({type: 'DO-GET-ENROLEES-HMO'}),
  logout: () => dispatch({type: 'DO-LOGOUT'}),
  setNotificationCount: (count: number, increement: number) =>
    dispatch({
      type: 'DO-SET-NOTIFICATION-COUNT-HMO',
      payload: count,
      increement,
    }),
});

class Dashboard extends React.Component<Props> {
  state = {
    latitude: 0,
    longitude: 0,
    rating: 0,
  };

  dbRef = firestore().collection('Rating');
  ref = firestore().collection('ChatList').orderBy('createdAt', 'desc');
  watchChatList: any;
  watchRating: any;

  componentWillUnmount() {
    try {
      this.watchChatList();
      this.watchRating();
    } catch (e) {}
  }

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
    this.watchRating = this.dbRef.onSnapshot((snapShot) => {
      if (!snapShot.empty) {
        let doc: any[] = [];
        snapShot.forEach((snap) => {
          doc.push(snap.data());
        });
        let rating = doc.map((v) => v.rating);
        let totalRating = rating.reduce((prv: number, cr: number) => prv + cr);
        let average = totalRating / rating.length;
        this.setState({rating: average});
      }
    });

    this.watchChatList = this.ref.onSnapshot((snapshot) => {
      let count = 0;
      snapshot.forEach((user) => {
        let userD = user.data();
        count += userD.count;
      });

      this.props.setNotificationCount(count, 3);
    });

    Splashscreen.hide();
  }

  logout() {
    Alert.alert('Log Out', 'Are you sure you want to log out ? ', [
      {onPress: () => this.props.logout(), text: 'Confirm'},
      {onPress: () => '', text: 'cancel'},
    ]);
  }

  render() {
    return (
      <Container style={styles.mainContainer}>
        <View style={styles.container}>
          <Header
            hasTabs
            androidStatusBarColor={Colors.Brand.brandColor}
            style={styles.header}>
            <Left
              style={{
                maxWidth: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <TouchableNativeFeedback
                onPress={() => toggleSideMenu(true, this.props.componentId)}>
                <Icon style={{color: '#fff'}} name="menu" />
              </TouchableNativeFeedback> */}
            </Left>

            <Body></Body>
            <Right style={{maxWidth: 50}}>
              <Button onPress={() => this.logout()} transparent>
                <Icon style={{color: '#fff'}} type="AntDesign" name="logout" />
              </Button>
            </Right>
          </Header>
          <View style={styles.subHead}>
            <View>
              <H3
                style={[
                  {
                    color: '#fff',
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                  },
                  styles.textShadow,
                ]}>
                {this.props.user.user_name}
              </H3>
              <Text note style={{color: '#fff', fontSize: 10}}>
                {this.props.user.email_address}
              </Text>
            </View>
            <View>
              <Button
                style={{
                  backgroundColor: Colors.Brand.getBrandColorByOpacity(0.9),
                }}
                iconLeft
                rounded>
                <Icon
                  style={{color: '#FDCC0D'}}
                  name="star-rate"
                  type="MaterialIcons"
                />
                <Icon
                  style={{color: '#FDCC0D'}}
                  name="star-rate"
                  type="MaterialIcons"
                />

                <Text
                  style={[
                    {fontWeight: 'bold', fontSize: 30, color: '#FF9529'},
                    styles.textShadow,
                  ]}
                  uppercase={false}>
                  {this.state.rating.toFixed(1)}
                </Text>
              </Button>
            </View>
          </View>

          <View style={styles.subMainContainer}>
            <View style={styles.dashboardItems}>
              {/* <TouchableNativeFeedback
                onPress={() => this.navigate('stack.admin.enrolees', {})}>
                <View style={styles.dashboardContainers}>
                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={styles.img}
                    source={require('../../../assets/dashboard/patient.png')}
                  />
                  <H2 style={styles.label}>Enrolees</H2>
                </View>
              </TouchableNativeFeedback> */}

              {/* <TouchableNativeFeedback
                onPress={() => this.navigate('stack.admin.hcps', {})}>
                <View style={styles.dashboardContainers}>
                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={styles.img}
                    source={require('../../../assets/dashboard/hcp.png')}
                  />
                  <H2 style={styles.label}>Health care providers</H2>
                </View>
              </TouchableNativeFeedback> */}

              <TouchableNativeFeedback
                onPress={() => this.navigate('stack.hmo.chatlist', {})}>
                <View style={styles.dashboardContainers}>
                  {this.props.notificationCount > 0 && (
                    <Badge style={styles.badge}>
                      <Text>{this.props.notificationCount}</Text>
                    </Badge>
                  )}

                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={styles.img}
                    source={require('../../../assets/dashboard/chat.png')}
                  />
                  <H2 style={styles.label}>Live Chat</H2>
                </View>
              </TouchableNativeFeedback>

              {/* <TouchableNativeFeedback
                onPress={() =>
                  this.navigate('stack.hmo.enrolees.redirect', {
                    isMedicalBills: true,
                  })
                }>
                <View style={styles.dashboardContainers}>
                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={styles.img}
                    source={require('../../../assets/dashboard/bill.png')}
                  />
                  <H2 style={styles.label}>Medical bills</H2>
                </View>
              </TouchableNativeFeedback> */}

              {/* <TouchableNativeFeedback
                onPress={() => this.navigate('stack.user.bmi', {})}>
                <View style={styles.dashboardContainers}>
                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={styles.img}
                    source={require('../../../assets/dashboard/bmi.png')}
                  />
                  <H2 style={styles.label}>Bmi calculator</H2>
                </View>
              </TouchableNativeFeedback> */}

              {/* <TouchableNativeFeedback
                onPress={() =>
                  this.navigate('stack.hmo.enrolees.redirect', {
                    isMedicalBills: false,
                  })
                }>
                <View style={styles.dashboardContainers}>
                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={styles.img}
                    source={require('../../../assets/dashboard/report.png')}
                  />
                  <H2 style={styles.label}>Medical reports</H2>
                </View>
              </TouchableNativeFeedback> */}
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  subMainContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fbfbfb',
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  dashboardItems: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    paddingVertical: 30,
    marginVertical: 10,
  },
  subHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.Brand.brandColor,
    height: height - 300,
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  dashboardContainers: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: Colors.Brand.getBrandColorByOpacity(0.3),
    marginVertical: 4,
    marginHorizontal: 5,
  },
  listBodyText: {
    fontSize: 14,
    color: '#555',
  },
  label: {
    color: Colors.Brand.getBrandColorByOpacity(0.8),
    fontWeight: 'bold',
    fontSize: 11,
    marginTop: 10,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.Brand.brandColor,
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
    backgroundColor: Colors.Brand.brandColor,
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
    fontSize: 40,
  },
  badge: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10000,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
