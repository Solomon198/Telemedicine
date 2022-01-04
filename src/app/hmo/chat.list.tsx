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
  Badge,
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
import HelperFunctions from '../utils/utils';
import MMKVStorage from 'react-native-mmkv-storage';
import SpinKit from 'react-native-spinkit';
import Splashscreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');
const storage = new MMKVStorage.Loader().initialize();

type Props = {
  componentId: string;
  user: User;
  enrolees: User[];
  enroleesStatus: string;
  setNotificationCount: (count: number, increement: number) => void;
};

const mapStateToProps = (store: any) => ({
  enrolees: store.Hmo.enrolees,
});

const mapDispatchToProps = (dispatch: any) => ({
  setNotificationCount: (count: number, increement: number) =>
    dispatch({
      type: 'DO-SET-NOTIFICATION-COUNT-HMO',
      payload: count,
      increement,
    }),
});

class ChatList extends React.Component<Props> {
  ref = firestore().collection('ChatList').orderBy('createdAt', 'desc');
  watchChatList: any;

  state = {
    latitude: 0,
    longitude: 0,
    fetchingChatStatus: 'NOT-STARTED',
    chatList: [],
  };

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
    this.setState({fetchingChatStatus: 'FETCHING-STARTED'});
    this.watchChatList = this.ref.onSnapshot(
      (snapshot) => {
        let chatList: any[] = [];
        let count = 0;
        snapshot.forEach((user) => {
          let userD = user.data();
          count += userD.count;
          chatList.push(userD);
        });

        this.setState(
          {chatList: chatList, fetchingChatStatus: 'FETCHING-SUCCESS'},
          () => {
            this.props.setNotificationCount(count, 3);
          },
        );
      },
      (error) => {
        this.setState({chatList: [], fetchingChatStatus: 'FETCHING-FAILED'});
      },
    );
  }

  componentWillUnmount() {
    try {
      this.watchChatList();
    } catch (e) {}
  }

  gotoChat(user: any) {
    this.props.setNotificationCount(user.count, 2);

    Navigation.push(this.props.componentId, {
      component: {
        name: 'stack.gen.chat',
        id: 'stack.gen.chat',
        passProps: {
          user,
          isHmo: true,
        },
      },
    });
  }

  render() {
    const {success, failed, started} = this.getResourceStatus(
      this.state.fetchingChatStatus,
    );

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
                Live Chat
              </Title>
            </Body>
            <Right style={{maxWidth: 50}}></Right>
          </Header>

          <View style={{flex: 1}}>
            {started && (
              <SpinKit
                type="Circle"
                color={Colors.Brand.brandColor}
                style={{alignSelf: 'center', marginVertical: 10}}
              />
            )}

            {failed && (
              <Button rounded style={{alignSelf: 'center'}}>
                <Icon name="reload-circle-outline" />
                <Text uppercase={false}>Retry</Text>
              </Button>
            )}

            {success && this.state.chatList.length == 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <H3 style={{marginTop: 20, fontFamily: 'sans-serif-thin'}}>
                  No Chat history
                </H3>
              </View>
            )}

            {
              <FlatList
                data={this.state.chatList as any}
                keyExtractor={(item) => item._id}
                renderItem={({item, index}) =>
                  item.family_name && item.other_name ? (
                    <ListItem
                      style={styles.items}
                      onPress={() => this.gotoChat(item)}
                      key={index}
                      noIndent
                      noBorder>
                      <Avatar
                        imageStyle={{alignSelf: 'center'}}
                        size={50}
                        source={HelperFunctions.getUserDefaultProfilePhoto(
                          item as User,
                        )}
                      />
                      <Body>
                        <Text note style={styles.label}>
                          {item.family_name + ' ' + item.other_name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          note
                          style={styles.listBodyText}>
                          {item.lastMessage}
                        </Text>
                      </Body>
                      <Right>
                        {item.count > 0 && (
                          <Badge>
                            <Text>{item.count}</Text>
                          </Badge>
                        )}
                      </Right>
                    </ListItem>
                  ) : null
                }
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
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  label: {
    color: '#111',
    fontWeight: '900',
    fontSize: 16,
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
