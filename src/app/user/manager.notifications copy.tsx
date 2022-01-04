import React from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import {
  Icon,
  Header,
  Right,
  Left,
  Body,
  Container,
  Title,
  Text,
  H1,
  H3,
  ListItem,
  Item,
} from 'native-base';
import Colors from '../../configs/styles/index';
import {TabBar} from 'react-native-ui-lib';
import helperFuncs from '../utils/utils';
import {Navigation} from 'react-native-navigation';
import HealthTips from './healthTips.data';
import {Avatar} from 'react-native-ui-lib';
import Modal from 'react-native-modalbox';
const {width, height} = Dimensions.get('window');

type Props = {
  componentId: string;
};

export default class Notification extends React.Component<Props> {
  state = {
    modalVisible: false,
    tip: {
      title: '',
      image: require('../../../assets/healthTips/1.jpg'),
      text: '',
    },
  };

  toggleModal() {
    this.setState({modalVisible: !this.state.modalVisible});
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
  }

  onBackButtonPressed() {
    helperFuncs.reconcileRouteHistoryForSidemenu('stack.user.notifications');
    return false;
  }

  back() {
    helperFuncs.reconcileRouteHistoryForSidemenu('stack.user.notifications');
    Navigation.pop(this.props.componentId);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onBackButtonPressed,
    );
  }

  showTip(tips: any) {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'stack.user.tips',
        id: 'stack.user.tips',
        passProps: {
          tips: tips,
        },
      },
    });
  }

  render() {
    return (
      <Container>
        <Header hasTabs style={styles.header}>
          <Left style={{maxWidth: 50}}>
            <TouchableOpacity
              onPress={() => this.back()}
              style={styles.avatarContainer}>
              <Icon
                style={{color: Colors.Brand.brandColor}}
                name="arrow-back"
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={{color: '#000'}}>Health Tips</Title>
          </Body>
        </Header>
        <View style={{marginHorizontal: 10, marginBottom: 50}}>
          <FlatList
            data={HealthTips}
            keyExtractor={(item) => item.text}
            renderItem={({item, index}) => (
              <ListItem onPress={() => this.showTip(item)}>
                <Avatar source={item.image} />
                <Body>
                  <View style={{marginVertical: 5}}>
                    <Text
                      style={{
                        marginBottom: 4,
                        fontWeight: 'bold',
                        color: '#555',
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{fontSize: 15, color: '#333'}}>
                      {item.text}
                    </Text>
                  </View>
                </Body>
              </ListItem>
            )}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal2: {
    height: 230,
    backgroundColor: '#3B5998',
  },

  modal3: {
    height: 300,
    width: 300,
  },

  modal4: {
    height: height,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f4f4f4',
    width: width,
  },
  selectedStyle: {
    color: Colors.Brand.brandColor,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#fff',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    maxWidth: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: Colors.Brand.brandColor,
  },
  notificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
