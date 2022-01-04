import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  BackHandler,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import {
  H1,
  Container,
  Body,
  Text,
  Icon,
  Header,
  Button,
  Left,
} from 'native-base';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {LiteCreditCardInput} from 'react-native-credit-card-input';
import * as joi from 'react-native-joi';
import firebase from '@react-native-firebase/firestore';

const validateEmail = joi.object({
  email: joi.string().email().required(),
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    padding: 10,
    marginLeft: 5,
    marginBottom: 5,
  },
  header: {backgroundColor: '#fff'},
  headerLeft: {maxWidth: 50},
  mainContainerSub: {paddingHorizontal: 10},
  pageTitle: {fontWeight: 'bold', marginVertical: 10, marginLeft: 10},
  cardInput: {
    borderBottomColor: 'dodgerblue',
    borderBottomWidth: 1,
  },
  errorCardText: {color: 'red', marginLeft: 10, marginVertical: 5},
  noteChargesContainer: {marginHorizontal: 15},
  flexContainer: {
    flex: 1,
  },
  noteChargesText: {fontSize: 15},
  learnMoreText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'dodgerblue',
  },
  btnAddCard: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  addCardIcon: {color: '#fff', fontSize: 23},
  addCardText: {fontWeight: 'bold'},
});

type Props = {
  componentId: string;
  userCards: any[];
  addCardEnabled: boolean;
  cardEmail: string;
  addCreditCardStatus: string;
  addCreditCardError: string;
  user: any;
  setCardEmail: (email: string) => void;
  addCard: (card: any) => void;
  enableAddCreditCardButton: (payload: boolean) => void;
};

const mapStateToProps = (store: any) => ({
  userCards: store.User.userCards,
  addCreditCardStatus: store.User.addCreditCardStatus,
  addCreditCardError: store.User.addCreditCardError,
  addCardEnabled: store.User.addCardEnabled,
  user: store.Auth.user,
  cardEmail: store.User.cardEmail,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  addCard: (payload: any) => dispatch({type: 'lldkfkfk', payload: payload}),
  enableAddCreditCardButton: (payload: boolean) =>
    dispatch({type: 'DO-ENABLE-ADD-BUTTON', payload: payload}),
  setCardEmail: (email: string) => dispatch({type: 'kdf', payload: email}),
});

class CreditCard extends React.Component<Props> {
  state = {
    error: '',
    cardValid: false,
    email: '',
  };
  searchPickUp() {}
  ref = firebase()
    .collection('Ordered-Items')
    .doc(this.props.user.enrolee_id)
    .collection('list');
  validCard: any;
  timer: any;

  goBack() {
    Navigation.pop(this.props.componentId);
  }

  componentDidMount() {
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackAction);
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackAction);
  }

  handleBackAction = () => {};

  addCard() {
    Keyboard.dismiss();
    const {error} = validateEmail.validate({email: this.state.email});
    if (error) {
      return this.setState({error: error.details[0].message});
    }

    this.ref.add({
      drugs: this.props.drugs,
      location: this.props.location,
    });
    Navigation.popToRoot(this.props.componentId);
    Alert.alert('', 'Delivery on progress');
  }

  validateCard(value: any) {
    const {number, expiry, cvc} = value.status;
    if (number === 'valid' && expiry === 'valid' && cvc === 'valid') {
      this.validCard = {
        number: value.values.number,
        cvc: value.values.cvc,
        expiry: value.values.expiry,
      };
      this.setState({cardValid: true});
    } else {
      this.setState({cardValid: false});
    }
  }

  render() {
    return (
      <Container style={styles.mainContainer}>
        <Header
          androidStatusBarColor={'dodgerblue'}
          hasTabs
          style={styles.header}>
          <Left style={styles.headerLeft}>
            <Button onPress={() => this.handleBackAction()} dark transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body />
        </Header>
        <View style={styles.mainContainerSub}>
          <H1 style={styles.pageTitle}>Credit Card</H1>
          {this.state.error || this.props.addCreditCardError ? (
            <Text note style={styles.errorCardText}>
              {this.state.error || this.props.addCreditCardError}
            </Text>
          ) : null}
          <LiteCreditCardInput
            autoFocus
            onChange={(values: any) => this.validateCard(values)}
            placeholders={{
              number: 'Card PIN',
              expiry: 'MM/YY',
              cvc: 'CVC',
              email: 'email',
            }}
            inputStyle={styles.cardInput}
          />
          <View>
            <TextInput
              value={this.props.cardEmail}
              style={styles.input}
              placeholder="Email Address"
              onChangeText={(text) => {
                this.setState({email: text, error: ''});
              }}
            />
          </View>
        </View>
        <View style={styles.flexContainer} />
        <View style={styles.noteChargesContainer}>
          <Text style={styles.noteChargesText}>
            You will be charged from your account ₦{this.props.total} for the
            drugs you selected for purchase, you can see items to be delivered
            to your location after payment on your orders page;
          </Text>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </View>

        <Text />
        <Button
          onPress={() => this.addCard()}
          disabled={!this.state.cardValid}
          iconLeft
          large
          rounded
          block
          style={[
            {
              backgroundColor: 'dodgerblue',
              opacity: this.state.cardValid ? 1 : 0.7,
            },
            styles.btnAddCard,
          ]}>
          <Icon
            style={styles.addCardIcon}
            type="FontAwesome5"
            name="credit-card"
          />
          <Text uppercase={false} style={styles.addCardText}>
            Pay for Drugs
          </Text>
          {/* {this.props.addCreditCardStatus ===
            AddCreditCard.ADD_CREDEIT_CARD_STARTED && (
            <SpinKit type="Circle" color="#fff" />
          )} */}
        </Button>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(CreditCard);
