import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
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
  signUpStatus: string;
  errorSignUp: string;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  signUp: (payload: any) => void;
};

const mapStateToProps = (store: any) => ({
  loginPhoneNumber: store.Auth.loginPhoneNumber,
  loginPassword: store.Auth.loginPassword,
  signUpStatus: store.Auth.signUp,
  errorSignUp: store.Auth.errorSignUp,
});

const mapDispatchToProps = (dispatch: any) => ({
  setPhoneNumber: (phoneNumber: string) =>
    dispatch({type: 'DO-SET-LOGIN-PHONE-NUMBER', payload: phoneNumber}),
  setPassword: (password: string) =>
    dispatch({type: 'DO-SET-LOGIN-PASSWORD', payload: password}),
  signUp: (payload: any) => dispatch({type: 'DO-SIGNUP', payload: payload}),
});

class SignUp extends React.Component<Props> {
  state = {
    email: '',
    password: '',
    family_name: '',
    other_name: '',
    hcp: 'default',
  };
  createAccount() {
    Navigation.push(this.props.componentId, {
      component: {
        id: 'stack.auth.signup',
        name: 'stack.auth.signup',
      },
    });
  }

  signUp() {
    const {password, email, family_name, other_name, hcp} = this.state;
    let payload = {password, email, family_name, other_name, hcp};
    this.props.signUp(payload);
  }

  resetPassword() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'stack.auth.validate.reset.credentials',
      },
    });
  }

  componentDidMount() {
    Splashscreen.hide();
  }

  render() {
    const isLoading =
      this.props.signUpStatus === 'SIGNUP-STARTED' ? true : false;
    const isSignUpSuccess =
      this.props.signUpStatus === 'SIGNUP-SUCCESS' ? true : false;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: StyleConfig.Brand.brandColor,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <ImageBackground
          style={{flex: 1, paddingHorizontal: 20}}
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
                fontSize: 23,
              }}
              note>
              Signup.
            </Text>

            {!isLoading &&
              !isSignUpSuccess &&
              this.props.signUpStatus !== 'SIGNUP-NOT-STARTED' && (
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
                    {this.props.errorSignUp}
                  </Text>
                </View>
              )}

            <View style={{flexDirection: 'row'}}>
              <View style={{flexGrow: 1}}>
                <TextInput
                  value={this.state.other_name}
                  placeholder="First Name"
                  style={[
                    StyleConfig.Components.InputStyles,
                    {backgroundColor: 'rgba(255,255,255,0.9)'},
                  ]}
                  onChangeText={(text) => this.setState({other_name: text})}
                />
              </View>
              <View style={{flexGrow: 1, marginLeft: 2}}>
                <TextInput
                  value={this.state.family_name}
                  placeholder="Last Name"
                  style={[
                    StyleConfig.Components.InputStyles,
                    {backgroundColor: 'rgba(255,255,255,0.9)'},
                  ]}
                  onChangeText={(text) => this.setState({family_name: text})}
                />
              </View>
            </View>
            <TextInput
              value={this.state.email}
              placeholder="Email Address"
              style={[
                StyleConfig.Components.InputStyles,
                {backgroundColor: 'rgba(255,255,255,0.9)'},
              ]}
              onChangeText={(text) => this.setState({email: text})}
            />
            <TextInput
              value={this.state.password}
              placeholder="Password"
              onChangeText={(text) => this.setState({password: text})}
              secureTextEntry
              style={[
                StyleConfig.Components.InputStyles,
                {backgroundColor: 'rgba(255,255,255,0.9)'},
              ]}
            />

            <Button
              onPress={() => this.signUp()}
              style={styles.btn}
              rounded
              block
              iconLeft>
              <Icon name="md-create-outline" />
              <Text style={styles.btnText}>Create Account</Text>
              {isLoading && <Spinner color="#fff" />}
            </Button>
            <TouchableOpacity
              onPress={() => Navigation.pop(this.props.componentId)}>
              <Text
                style={[
                  styles.title,
                  {marginTop: 10, alignSelf: 'flex-end', color: '#fff'},
                ]}>
                Have an account? login
              </Text>
            </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
