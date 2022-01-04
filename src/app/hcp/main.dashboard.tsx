import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Modal,
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
import {User, HealthCareProvider} from '../utils/types';
import helperFuncs from '../utils/utils';
import MMKVStorage from 'react-native-mmkv-storage';
import Splashscreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';
import SpinKit from 'react-native-spinkit';
import * as geoHash from 'geofire-common';
import {appUrl} from '../../configs/globals.config';
import axios from 'axios';
import firebaseStorage from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('window');

const containerWidth = width / 2 - 10;

const storage = new MMKVStorage.Loader().initialize();

type hmo = {
  enrolee_photo: string;
  user_name: string;
  email_address: string;
  email: string;
};

type hcp = {
  id: number;
  user_name: string;
  email_address: string;
  mobile_no: string;
  role_id: number;
  hcp: number;
  dob: string;
  title: string;
  fullname: string;
  describe: string;
  active_status: string;
  default_pwd: string;
};

type Props = {
  componentId: string;
  user: hcp;
  enrolees: User[];
  enroleesStatus: string;
  notificationCount: number;
  hcpInfo: HealthCareProvider;
  logout: () => void;
  getEnrolees: () => void;
  setNotificationCount: (count: number, increement: number) => void;
  setHcpProfilePicture: (url: string) => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
  hcpInfo: store.Auth.hcpInfo,
  enrolees: store.Hmo.enrolees,
  enroleesStatus: store.Hmo.enroleesStatus,
  notificationCount: store.Hmo.notificationCount,
});

const mapDispatchToProps = (dispatch: any) => ({
  getEnrolees: () => dispatch({type: 'DO-GET-ENROLEES-HMO'}),
  logout: () => dispatch({type: 'DO-LOGOUT'}),
  setHcpProfilePicture: (url: string) =>
    dispatch({type: 'DO-CHANGE-HCP-PROFILE-PICTURE', payload: url}),
});

class Dashboard extends React.Component<Props> {
  state = {
    latitude: 0,
    longitude: 0,
    rating: 0,
    setting: false,
    totalPercentage: 0,
    modalVisible: false,
    uploadState: '',
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

  getCurrentPosition() {
    this.setState({setting: true});
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;

        let admin = firestore()
          .collection('Hcp-Locations')
          .doc(this.props.user.hcp + '');
        const hash = geoHash.geohashForLocation([latitude, longitude]);
        let info: any = Object.assign({}, this.props.user);
        delete info.user_settings;
        delete info.user_password;

        admin
          .set({
            geohash: hash,
            lat: latitude,
            lng: longitude,
            hcp: this.props.user.hcp,
            ...this.props.hcpInfo,
          })
          .then(() => {
            this.setState({setting: false}, () => {
              Alert.alert(
                'Success',
                'Your current location is set as the hcp location.',
              );
            });
          });
      },
      (error) => {
        this.setState({setting: false}, () => {
          Alert.alert('', 'Could not get current location please try again');
        });
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
    console.log(this.props.hcpInfo);
    Splashscreen.hide();
  }

  logout() {
    Alert.alert('Log Out', 'Are you sure you want to log out ? ', [
      {onPress: () => this.props.logout(), text: 'Confirm'},
      {onPress: () => '', text: 'cancel'},
    ]);
  }

  renderUploader() {
    return (
      <Modal transparent visible={this.state.modalVisible}>
        <View style={styles.modal}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <SpinKit size={200} type="Circle" color={Colors.Brand.brandColor} />
            <H2
              style={{
                position: 'absolute',
                fontWeight: 'bold',
                color: Colors.Brand.brandColor,
              }}>
              {this.state.totalPercentage.toFixed(0) + '%'}
            </H2>
          </View>
          <H1 style={styles.uploadAction}>{this.state.uploadState} </H1>
        </View>
      </Modal>
    );
  }

  async savingProfilePicture(url: string) {
    try {
      const update = await axios.post(
        appUrl + '/hcp/set_hcp_profile_photo.php',
        {
          ukey: this.props.hcpInfo.ukey,
          hcp_mobile_photo_url: url,
        },
      );

      this.setState({modalVisible: false}, () => {
        console.log(update.data);
        this.props.setHcpProfilePicture(url);
        Alert.alert('', 'Profile picture changed successfully!!');
      });
    } catch (e) {
      Alert.alert('Unable to set profile picture please try again.');
    }
  }

  upload(media: string) {
    this.setState({uploading: true});

    let task = firebaseStorage()
      .ref('/profile/medias/hcp')
      .child('Img' + this.props.user.hcp)
      .putFile(media);

    task.on('state_changed', (task) => {
      let percentageUploaded = (task.bytesTransferred / task.totalBytes) * 100;
      console.log(percentageUploaded + '%');
      this.setState({totalPercentage: percentageUploaded});
    });

    task.then((completed) => {
      task.snapshot?.ref.getDownloadURL().then((url) => {
        this.setState({uploadState: 'Saving profile picture ... '}, () => {
          //update app state;
          this.savingProfilePicture(url);
        });
      });
    });

    task.catch((e) => {
      this.setState({modalVisible: false}, () => {
        Alert.alert('', 'unable to upload profile photo');
      });
    });
  }

  uploadProfilePic() {
    helperFuncs
      .getImageFromGallery()
      .then((url) => {
        this.setState(
          {modalVisible: true, uploadState: 'Uploading Profile Picture ....'},
          () => {
            this.upload(url as string);
          },
        );
      })
      .catch((e) => {
        Alert.alert('', 'unable to upload profile photo');
      });
  }

  render() {
    const {success, failed, started} = this.getResourceStatus(
      this.props.enroleesStatus,
    );
    return (
      <Container style={styles.mainContainer}>
        {this.renderUploader()}
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
            <View style={{maxWidth: 50, marginHorizontal: 10}}>
              <Avatar
                imageStyle={{alignSelf: 'center'}}
                source={helperFuncs.getHcpDefaultProfilePhoto(
                  this.props.hcpInfo,
                )}
              />
            </View>
            <View style={{flex: 1}}>
              <H3
                style={[
                  {
                    color: '#fff',
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                  },
                  styles.textShadow,
                ]}>
                {this.props.user.hcp_name}
              </H3>
              <Text note style={{color: '#fff', fontSize: 10}}>
                {this.props.user.email}
              </Text>
            </View>
          </View>

          <View style={styles.subMainContainer}>
            <View style={styles.dashboardItems}>
              <TouchableNativeFeedback
                onPress={() => this.navigate('stack.hcp.enrolees', {})}>
                <View style={styles.dashboardContainers}>
                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={styles.img}
                    source={require('../../../assets/dashboard/patient.png')}
                  />
                  <H2 style={styles.label}>Manage Drugs</H2>
                </View>
              </TouchableNativeFeedback>

              <TouchableNativeFeedback
                onPress={() =>
                  this.navigate('stack.hcp.enrolee.redirect', {
                    isMedicalBills: true,
                  })
                }>
                <View style={styles.dashboardContainers}>
                  {this.props.notificationCount > 0 && (
                    <Badge style={styles.badge}>
                      <Text>{this.props.notificationCount}</Text>
                    </Badge>
                  )}

                  {this.state.setting ? (
                    <SpinKit color={Colors.Brand.brandColor} type="Circle" />
                  ) : (
                    <Image
                      resizeMethod="resize"
                      resizeMode="contain"
                      style={styles.img}
                      source={require('../../../assets/dashboard/location.png')}
                    />
                  )}

                  <H2 style={styles.label}>Set Pickup locations</H2>
                </View>
              </TouchableNativeFeedback>

              {/* <TouchableNativeFeedback
                onPress={() =>
                  this.navigate('stack.hcp.enrolee.redirect', {
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
                  this.navigate('stack.hcp.enrolee.redirect', {
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

              {/* <TouchableNativeFeedback onPress={() => this.uploadProfilePic()}>
                <View style={[styles.dashboardContainers]}>
                  <Image
                    resizeMethod="resize"
                    resizeMode="contain"
                    style={styles.img}
                    source={require('../../../assets/dashboard/gallery.png')}
                  />
                  <H2 style={styles.label}>Change profile photo</H2>
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
  uploadAction: {
    fontFamily: 'sans-serif-light',
    marginVertical: 50,
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.Brand.brandColor,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 20,
  },
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
    justifyContent: 'center',
    backgroundColor: Colors.Brand.brandColor,
    height: height - 400,
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
