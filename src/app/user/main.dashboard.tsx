import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
  Modal,
} from 'react-native';
import {
  H1,
  Container,
  Header,
  Left,
  Body,
  Badge,
  Fab,
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
import call from 'react-native-phone-call';
import {connect} from 'react-redux';
import {User} from '../utils/types';
import helperFuncs from '../utils/utils';
import MMKVStorage from 'react-native-mmkv-storage';
import Splashscreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';
import {appUrl} from '../../configs/globals.config';
import SpinKit from 'react-native-spinkit';
import axios from 'axios';
import firebaseStorage from '@react-native-firebase/storage';

const storage = new MMKVStorage.Loader().initialize();

type Props = {
  componentId: string;
  user: User;
  logout: () => void;
  setHcpProfilePicture: (url: string) => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch({type: 'DO-LOGOUT'}),
  setHcpProfilePicture: (url: string) =>
    dispatch({type: 'DO-CHANGE-USER-PROFILE-PICTURE', payload: url}),
});

class Dashboard extends React.Component<Props> {
  state = {
    latitude: 0,
    longitude: 0,
    count: 0,
    totalPercentage: 0,
    modalVisible: false,
    uploadState: '',
  };

  watchChatList: any;
  ref = firestore().collection('ChatList').doc(this.props.user.enrolee_id);
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

  navigate(name: string) {
    Navigation.push(this.props.componentId, {
      component: {
        name: name,
        passProps: {
          longitude: this.state.longitude,
          latitude: this.state.latitude,
        },
      },
    });
  }

  componentWillUnmount() {
    try {
      this.watchChatList();
    } catch (e) {}
  }

  componentDidMount() {
    this.watchChatList = this.ref.onSnapshot((snapshot) => {
      let count = 0;
      let user: any = snapshot.data();
      if (snapshot.exists) {
        count += user.userCount;
        this.setState({count: count});
      } else {
        this.ref.set({...this.props.user, userCount: 0});
        this.setState({count: 0});
      }
    });

    Splashscreen.hide();
  }

  call() {
    const args = {
      number: '07036035182', // Use commas to add time between digits.
      prompt: false,
    };

    call(args).catch(console.error);
  }

  _logout() {
    Navigation.popToRoot(this.props.componentId).then(() => {
      this.props.logout();
    });
  }

  logout() {
    Alert.alert('Log Out', 'Are you sure you want to log out ? ', [
      {onPress: () => this._logout(), text: 'Confirm'},
      {onPress: () => '', text: 'cancel'},
    ]);
  }

  gotoChat() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'stack.gen.chat',
        id: 'stack.gen.chat',
        passProps: {
          user: this.props.user,
          isHmo: false,
        },
      },
    });
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
        appUrl + '/enrolee/set_enrollee_profile_photo.php',
        {
          enrolee_id: this.props.user.enrolee_id,
          enrollee_mobile_photo_url: url,
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
    return (
      <Container style={styles.mainContainer}>
        {this.renderUploader()}
        <View style={styles.container}>
          <Header
            androidStatusBarColor={Colors.Brand.brandColor}
            style={styles.header}>
            <Left style={{maxWidth: 50}}>
              <View>
                <TouchableOpacity
                  onPress={() => toggleSideMenu(true, this.props.componentId)}
                  style={styles.btnMenu}>
                  <Icon style={{color: '#f3f3f3'}} name="menu" />
                </TouchableOpacity>
              </View>
            </Left>

            <Body></Body>
            <Right style={{maxWidth: 50}}>
              {/* <Button
                onPress={() => this.navigate('stack.user.search')}
                transparent>
                <Icon type="AntDesign" name="search1" />
              </Button> */}
              <Button onPress={() => this.logout()} transparent>
                <Icon type="AntDesign" name="logout" />
              </Button>
            </Right>
          </Header>

          <View
            style={{
              backgroundColor: StyleConfig.Brand.brandColor,
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              paddingHorizontal: 25,
              height: 220,
            }}>
            <H2
              style={{
                color: '#fff',
                fontWeight: 'bold',
                marginVertical: 10,
                textTransform: 'capitalize',
              }}>
              Welcome {this.props.user.other_name}
            </H2>

            <H3
              style={{
                color: '#fff',
                fontWeight: 'bold',
                marginVertical: 10,
                fontSize: 15,
              }}>
              {' '}
              Are you feeling Sick ?
            </H3>
            <Text
              numberOfLines={2}
              lineBreakMode="tail"
              style={{color: '#fff'}}>
              Get quick medication by talking to a consultant and getting your
              drugs delivered to your nearest location.
            </Text>

            <View style={{flexDirection: 'row', flex: 1}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <Button
                  onPress={() => this.navigate('stack.user.search')}
                  iconLeft
                  danger
                  block
                  rounded
                  style={{alignSelf: 'center'}}>
                  <Icon type="AntDesign" name="medicinebox" />
                  <Text uppercase={false}>Buy drug</Text>
                </Button>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Button
                  onPress={() =>
                    Navigation.push(this.props.componentId, {
                      component: {
                        name: 'stack.user.rating',
                        id: 'stack.user.rating',
                      },
                    })
                  }
                  iconLeft
                  block
                  rounded
                  style={{alignSelf: 'center'}}>
                  <Icon name="star-rate" type="MaterialIcons" />
                  <Text uppercase={false}> Rate App</Text>
                </Button>
              </View>
            </View>
          </View>

          <View style={{marginTop: 10}} />

          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <View>
              <Avatar
                imageStyle={{alignSelf: 'center'}}
                size={100}
                source={helperFuncs.getUserDefaultProfilePhoto(this.props.user)}
              />

              {/* <TouchableOpacity
                onPress={() => this.uploadProfilePic()}
                style={styles.cameraContainer}>
                <Icon style={{color: Colors.Brand.brandColor}} name="camera" />
              </TouchableOpacity> */}
            </View>

            <H1
              style={{
                fontFamily: 'sans-serif-light',
                color: '#555',
                letterSpacing: 2,
                marginVertical: 10,
                textTransform: 'capitalize',
              }}>
              {(this.props.user.other_name || '') +
                ' ' +
                (this.props.user.family_name || '')}
            </H1>
            {/* <Button style={{alignSelf:'center',marginTop:5}} small success rounded>
                            <Text uppercase={false}>Active</Text>
                        </Button> */}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <TouchableOpacity
            onPress={() => this.navigate('stack.user.erollee.info')}
            style={{alignContent: 'center', alignItems: 'center'}}>
            <View style={styles.icoContainer}>
              <Avatar
                source={helperFuncs.getUserDefaultProfilePhoto(this.props.user)}
              />
            </View>
            <Text style={styles.labelList} note>
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.gotoChat()}
            style={{alignContent: 'center', alignItems: 'center'}}>
            {this.state.count > 0 && (
              <Badge
                style={{position: 'absolute', top: 2, right: 10, zIndex: 1000}}>
                <Text>{this.state.count}</Text>
              </Badge>
            )}
            <View style={styles.icoContainer}>
              <Image
                style={styles.img}
                source={require('../../../assets/dashboard/chat.png')}
              />
            </View>
            <Text style={styles.labelList} note>
              Live Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.navigate('stack.user.notifications')}
            style={{alignContent: 'center', alignItems: 'center'}}>
            <View style={styles.icoContainer}>
              <Image
                style={styles.img}
                source={require('../../../assets/dashboard/bill.png')}
              />
            </View>
            <Text style={styles.labelList} note>
              My Orders
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  cameraContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    right: 0,
    bottom: 0,
    height: 40,
    width: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  icoContainer: {
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
    color: '#fff',
  },
  img: {
    width: 50,
    height: 50,
  },
  headerInput: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 50,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
