import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  BackHandler,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import {
  H1,
  Container,
  Header,
  Left,
  Body,
  Title,
  Text,
  Textarea,
  Icon,
  H2,
  ListItem,
  Right,
  H3,
  Button,
  List,
  Content,
} from 'native-base';
import Colors from '../../configs/styles/index';
import {toggleSideMenu} from './navigations.actions';
import Geolocation from 'react-native-geolocation-service';
import {Navigation} from 'react-native-navigation';
import StyleConfig from '../../configs/styles/index';
import {Avatar} from 'react-native-ui-lib';
import helperFuncs from '../utils/utils';
import {FlatList} from 'react-native-gesture-handler';
import {Rating, AirbnbRating} from 'react-native-elements';
import {User} from '../utils/types';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

type Props = {
  componentId: string;
  user: User;
  comment: string;
  rating: number;
  setRating: (rating: number) => void;
  setComment: (comment: string) => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
  rating: store.User.rating,
  comment: store.User.comment,
});

const mapDispatchToProps = (dispatch: any) => ({
  setComment: (comment: string) =>
    dispatch({type: 'DO-SET-COMMENT', payload: comment}),
  setRating: (rating: number) =>
    dispatch({type: 'DO-SET-RATING', payload: rating}),
});

class RatingHMO extends React.Component<Props> {
  state = {
    latitude: 0,
    longitude: 0,
    reviews: ['Very bad', 'Poor', 'Good', 'Exellent'],
    rate: 1,
  };

  ref = firestore().collection('Rating').doc(this.props.user.enrolee_id);

  componentDidMount() {
    this.ref.get().then((data) => {
      if (data.exists) {
        let doc: any = data.data();
        this.props.setComment(doc.comment);
        this.props.setRating(doc.rating);
      }
    });
  }

  save() {
    this.ref
      .set({
        rating: this.props.rating,
        comment: this.props.comment,
        hcp: this.props.user.hcp,
        enrolee: this.props.user.enrolee_id,
      })
      .then(() => {
        ToastAndroid.show('Rating Saved', ToastAndroid.LONG);
      })
      .catch((e) => {
        ToastAndroid.show(e.message, ToastAndroid.LONG);
      });
  }

  back() {
    Navigation.pop(this.props.componentId);
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

  render() {
    return (
      <Container style={styles.mainContainer}>
        <Header
          hasTabs
          androidStatusBarColor={Colors.Brand.brandColor}
          style={styles.header}>
          <Left style={{maxWidth: 60}}>
            <View>
              <TouchableOpacity
                onPress={() => this.back()}
                style={styles.btnMenu}>
                <Icon
                  style={{color: Colors.Brand.brandColor}}
                  name="arrow-back"
                />
              </TouchableOpacity>
            </View>
          </Left>

          <Body>
            <Title style={{color: '#444', fontWeight: '400'}}>
              Rate Application
            </Title>
          </Body>

          <Right style={{maxWidth: 100}}>
            <Button onPress={() => this.save()} iconLeft transparent>
              <Icon
                style={{color: Colors.Brand.brandColor}}
                type="AntDesign"
                name="check"
              />
              <Text style={{color: Colors.Brand.brandColor}}>Save</Text>
            </Button>
          </Right>
        </Header>

        <View
          style={{
            flex: 1,
            marginHorizontal: 20,
            marginTop: 20,
            justifyContent: 'center',
          }}>
          <H1
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginVertical: 10,
              color: Colors.Brand.brandColor,
            }}>
            {this.state.reviews[this.props.rating ? this.props.rating - 1 : 0]}
          </H1>
          <AirbnbRating
            selectedColor={Colors.Brand.brandColor}
            count={4}
            showRating={false}
            reviews={['Very bad', 'Poor', 'Good', 'Exellent']}
            defaultRating={this.props.rating || 1}
            onFinishRating={(rate) => this.props.setRating(rate)}
            size={60}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    color: Colors.Brand.brandColor,
    fontWeight: '900',
    fontSize: 16,
  },
  iconLeft: {
    color: Colors.Brand.brandColor,
  },
  listBodyText: {
    fontSize: 14,
    color: '#555',
  },
  mainContainer: {
    flex: 1,
  },
  icoContainer: {
    height: 60,
    backgroundColor: StyleConfig.Brand.brandColor,
    width: 60,
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
    backgroundColor: '#fff',
    zIndex: 2000,
  },
  btnMenu: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  container: {},
  map: {
    flex: 1,
    zIndex: -10,
  },
  ico: {
    color: '#fff',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RatingHMO);
