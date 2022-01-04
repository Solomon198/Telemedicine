import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  Badge,
  Body,
  H3,
  Header,
  Icon,
  Left,
  ListItem,
  Right,
  Text,
} from 'native-base';
import Colors from '../../configs/styles/index';
import {toggleSideMenu} from './navigations.actions';
import {Navigation} from 'react-native-navigation';
import {Avatar} from 'react-native-ui-lib';
import helperFuncs from '../utils/utils';
import {User} from '../utils/types';
import {connect} from 'react-redux';

import MMKVStorage from 'react-native-mmkv-storage';

const storage = new MMKVStorage.Loader().initialize();

type Props = {
  componentId: string;
  centerComponentId: string;
  user: User;
  logout: () => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
});

const mapDispatchToProps = (dispatch: any) => ({});

class SideMenu extends React.Component<Props> {
  navigate(name: string) {
    toggleSideMenu(false, this.props.componentId);
    Navigation.push('stack.user.center', {
      component: {
        name: name,
        id: name,
      },
    });
  }

  render() {
    const male = require('../../../assets/media/gender/male.jpg');
    const female = require('../../../assets/media/gender/female.png');
    return (
      <View style={{flex: 1, backgroundColor: Colors.Brand.brandColor}}>
        <StatusBar backgroundColor={Colors.Brand.brandColor} />
        <ImageBackground
          style={{height: 200, justifyContent: 'center', paddingHorizontal: 30}}
          source={require('../../../assets/media/images/sidemenu.jpg')}>
          <Avatar
            size={70}
            source={helperFuncs.getUserDefaultProfilePhoto(this.props.user)}
          />
          <H3 style={styles.title}>
            {this.props.user.other_name + ' ' + this.props.user.family_name}
          </H3>
          <Text note style={styles.subTitle}>
            {this.props.user.email}
          </Text>
        </ImageBackground>

        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <ListItem
            onPress={() => this.navigate('stack.user.erollee.info')}
            style={styles.menuItems}>
            <Left style={styles.leftIco}>
              <Icon style={styles.menuIcon} type="FontAwesome" name="user" />
            </Left>
            <Body>
              <Text style={styles.menuText}>Profile</Text>
            </Body>
          </ListItem>
          {/* 
          <ListItem
            onPress={() => this.navigate('stack.user.beneficiaries')}
            style={styles.menuItems}>
            <Left style={styles.leftIco}>
              <Icon style={styles.menuIcon} type="FontAwesome" name="users" />
            </Left>
            <Body>
              <Text style={styles.menuText}>Beneficiaries</Text>
            </Body>
          </ListItem> */}

          <ListItem
            onPress={() => this.navigate('stack.user.search')}
            style={styles.menuItems}>
            <Left style={styles.leftIco}>
              <Icon
                style={styles.menuIcon}
                type="AntDesign"
                name="medicinebox"
              />
            </Left>
            <Body>
              <Text style={styles.menuText}>Buy drugs</Text>
            </Body>
          </ListItem>

          {/* <ListItem
            onPress={() => this.navigate('stack.user.notifications')}
            style={styles.menuItems}>
            <Left style={styles.leftIco}>
              <Icon
                style={styles.menuIcon}
                type="AntDesign"
                name="notification"
              />
            </Left>
            <Body>
              <Text style={styles.menuText}>Health tips</Text>
            </Body>
          </ListItem> */}

          {/* <ListItem
            onPress={() => this.navigate('stack.user.benefits')}
            style={styles.menuItems}>
            <Left style={styles.leftIco}>
              <Icon
                style={styles.menuIcon}
                type="MaterialIcons"
                name="data-usage"
              />
            </Left>
            <Body>
              <Text style={styles.menuText}>Benefit Usage</Text>
            </Body>
          </ListItem> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subTitle: {
    color: '#e8e8e8',
    fontSize: 12,
  },
  title: {
    color: '#f4f4f4',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    textTransform: 'capitalize',
  },
  leftIco: {
    maxWidth: 40,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItems: {
    borderColor: 'transparent',
  },
  menuText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f9f9f9',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  menuIcon: {
    color: '#f0f0f0',
  },
  userInfoContainer: {
    flexDirection: 'row',
  },
  icoProfile: {
    fontSize: 50,
    marginBottom: 10,
    color: Colors.Brand.brandColor,
  },
  userName: {
    marginTop: 15,
  },
  avatarContainer: {
    height: 70,
    width: 70,
    borderRadius: 100,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderColor: Colors.Brand.brandColor,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },

  mainCamera: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 2,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
