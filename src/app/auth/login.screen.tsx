import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {
  Button,
  Text,
  H1,
  Icon,
  Header,
  Container,
  Body,
  Right,
  View,
  Spinner,
} from 'native-base';
import StyleConfig from '../../configs/styles/index';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import Splashscreen from 'react-native-splash-screen';

type Props = {
  componentId: string;
  loginPhoneNumber: string;
  loginPassword: string;
  errorLogin: string;
  loginStatus: string;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  login: (payload: any) => void;
};

const mapStateToProps = (store: any) => ({
  loginPhoneNumber: store.Auth.loginPhoneNumber,
  loginPassword: store.Auth.loginPassword,
  loginStatus: store.Auth.login,
  errorLogin: store.Auth.errorLogin,
});

const mapDispatchToProps = (dispatch: any) => ({
  setPhoneNumber: (phoneNumber: string) =>
    dispatch({type: 'DO-SET-LOGIN-PHONE-NUMBER', payload: phoneNumber}),
  setPassword: (password: string) =>
    dispatch({type: 'DO-SET-LOGIN-PASSWORD', payload: password}),
  login: (payload: any) => dispatch({type: 'DO-LOGIN', payload: payload}),
});

class Login extends React.Component<Props> {
  createAccount() {
    Navigation.push(this.props.componentId, {
      component: {
        id: 'stack.auth.signup',
        name: 'stack.auth.signup',
      },
    });
  }

  login() {
    Keyboard.dismiss();
    let payload = {
      email: this.props.loginPhoneNumber,
      password: this.props.loginPassword,
    };
    this.props.login(payload);
  }

  resetPassword() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'stack.auth.validate.reset.credentials',
        id: 'stack.auth.validate.reset.credentials',
      },
    });
  }

  componentDidMount() {
    Splashscreen.hide();
  }

  render() {
    const isLoading =
      this.props.loginStatus == 'LOGIN-STARTED' ||
      this.props.loginStatus == 'LOGIN-SUCCESS'
        ? true
        : false;
    const isLoginSuccess =
      this.props.loginStatus === 'LOGIN-SUCCESS' ? true : false;

    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: StyleConfig.Brand.brandColor}}>
        <ImageBackground
          style={{flex: 1, paddingHorizontal: 20, justifyContent: 'center'}}
          source={require('../../../assets/media/images/sidemenu.jpg')}>
          <Header
            hasTabs
            androidStatusBarColor={StyleConfig.Brand.brandColor}
            style={{backgroundColor: 'transparent'}}>
            <Body></Body>
            <Right></Right>
          </Header>

          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                marginVertical: 20,
                fontSize: 20,
              }}
              note>
              Sign in to continue.
            </Text>

            {!isLoading &&
              !isLoginSuccess &&
              this.props.loginStatus !== 'LOGIN-NOT-STARTED' && (
                <View
                  style={{
                    backgroundColor: '#f4f4f4',
                    borderRadius: 10,
                    height: 50,
                    marginTop: 10,
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <Text style={{color: 'red', fontSize: 13}}>
                    Invalid login credentials please try again.
                  </Text>
                </View>
              )}

            <TextInput
              value={this.props.loginPhoneNumber}
              placeholder="Email"
              style={[
                StyleConfig.Components.InputStyles,
                {backgroundColor: 'rgba(255,255,255,0.9)'},
              ]}
              onChangeText={(text) => this.props.setPhoneNumber(text)}
            />

            <TextInput
              value={this.props.loginPassword}
              placeholder="Password"
              onChangeText={(text) => this.props.setPassword(text)}
              secureTextEntry
              style={[
                StyleConfig.Components.InputStyles,
                {backgroundColor: 'rgba(255,255,255,0.9)'},
              ]}
            />

            <Button
              onPress={() => this.login()}
              style={styles.btn}
              rounded
              block
              iconLeft>
              <Icon type="AntDesign" name="login" />
              <Text style={styles.btnText}>login</Text>
              {isLoading && <Spinner color="#fff" />}
            </Button>
            <Button
              onPress={() => this.createAccount()}
              style={styles.btn}
              rounded
              block
              iconLeft>
              <Icon name="create-outline" />
              <Text style={styles.btnText}>Create Account</Text>
            </Button>
            {/* <TouchableOpacity onPress={() => this.resetPassword()}>
              <Text
                style={[
                  styles.title,
                  {marginTop: 10, alignSelf: 'flex-end', color: '#fff'},
                ]}>
                forgotton password ?
              </Text>
            </TouchableOpacity> */}
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  labelList: {
    marginTop: 10,
    fontSize: 10,
    color: '#fff',
  },
  icoContainer: {
    height: 60,
    backgroundColor: 'transparent',
    width: 60,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  ico: {
    color: '#fff',
  },
  mainContainer: {
    backgroundColor: StyleConfig.Brand.brandColor,
    color: '#000000',
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    borderColor: '#e8e8e8',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 17,
    fontSize: 17,
    color: '#000',
    borderRadius: 50,
  },
  form: {
    marginHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  itemStyle: {
    borderColor: 'transparent',
  },
  btn: {
    marginVertical: 10,
    backgroundColor: StyleConfig.Brand.getBrandColorByOpacity(0.7),
    borderColor: 'transparent',
    paddingVertical: 30,
  },

  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },

  btnText: {
    letterSpacing: 2,
    fontWeight: 'bold',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
