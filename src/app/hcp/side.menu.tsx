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
import {connect} from 'react-redux';
import helperFuncs from '../utils/utils';
import {HealthCareProvider} from '../utils/types';
import MMKVStorage from 'react-native-mmkv-storage';

const storage = new MMKVStorage.Loader().initialize();

type Props = {
  componentId: string;
  centerComponentId: string;
  user: HealthCareProvider;
  logout: () => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.hcpInfo,
});

const mapDispatchToProps = (dispatch: any) => ({});

class SideMenu extends React.Component<Props> {
  navigate(name: string, props?: any) {
    toggleSideMenu(false, this.props.componentId);
    Navigation.push('stack.hcp.center', {
      component: {
        name: name,
        id: name,
        passProps: {
          ...props,
        },
      },
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
        <StatusBar backgroundColor={Colors.Brand.brandColor} />
        <ImageBackground
          style={{height: 200, justifyContent: 'center', paddingHorizontal: 30}}
          source={require('../../../assets/media/images/sidemenu.jpg')}>
          <Avatar
            size={70}
            source={helperFuncs.getHcpDefaultProfilePhoto(this.props.user)}
          />
          <H3 style={styles.title}>{this.props.user.hcp_name}</H3>
          <Text note style={styles.subTitle}>
            {this.props.user.email}
          </Text>
        </ImageBackground>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, backgroundColor: Colors.Brand.brandColor}}>
          <ListItem
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
          </ListItem>

          <ListItem
            onPress={() =>
              this.navigate('stack.hcp.enrolee.redirect', {
                isMedicalBills: true,
              })
            }
            style={styles.menuItems}>
            <Left style={styles.leftIco}>
              <Icon style={styles.menuIcon} type="FontAwesome5" name="coins" />
            </Left>
            <Body>
              <Text style={styles.menuText}>Medical Bills</Text>
            </Body>
          </ListItem>

          <ListItem
            onPress={() =>
              this.navigate('stack.hcp.enrolee.redirect', {
                isMedicalBills: false,
              })
            }
            style={styles.menuItems}>
            <Left style={styles.leftIco}>
              <Icon
                style={styles.menuIcon}
                type="MaterialIcons"
                name="report"
              />
            </Left>
            <Body>
              <Text style={styles.menuText}>Medical Reports</Text>
            </Body>
          </ListItem>

          <ListItem
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
          </ListItem>
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
