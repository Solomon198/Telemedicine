import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
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
  Button,
} from 'native-base';
import Colors from '../../configs/styles/index';
import {TabBar} from 'react-native-ui-lib';
import helperFuncs from '../utils/utils';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
type Props = {
  componentId: string;
  height: string;
  weight: string;

  setWeight: (weight: string) => void;
  setHeight: (height: string) => void;
};

const mapStateToProps = (store: any) => ({
  height: store.User.height,
  weight: store.User.weight,
});

const mapDispatchToProps = (dispatch: any) => ({
  setWeight: (weight: string) =>
    dispatch({type: 'DO-SET-WEIGHT', payload: weight}),
  setHeight: (height: string) =>
    dispatch({type: 'DO-SET-HEIGHT', payload: height}),
});

class BMI extends React.Component<Props> {
  calculateBMI() {
    let height = parseInt(this.props.height) || 0;
    let weight: number = parseInt(this.props.weight) || 0;
    let bmi = (weight / (height * height)) * 10000;
    let result: number;
    let comment: string = '';
    result = bmi;

    if (isNaN(bmi)) result = 0;
    if (result == Infinity) result = 0;
    if (result < 18.5) comment = 'Underweight';
    if (result >= 18.5 && result < 25) comment = 'Normal';
    if (result >= 25 && result <= 29.9) comment = 'Overweight';
    if (result >= 30) comment = 'Obesity';
    console.log();
    return {bmi: result, comment: comment};
  }

  back() {
    Navigation.pop(this.props.componentId);
  }
  render() {
    const {bmi, comment} = this.calculateBMI();
    return (
      <Container style={{flex: 1}}>
        <Header hasTabs style={styles.header}>
          <Left style={{maxWidth: 50}}>
            <Button transparent onPress={() => this.back()}>
              <Icon
                style={{color: Colors.Brand.brandColor}}
                name="arrow-back"
              />
            </Button>
          </Left>
          <Body>
            <Title style={{color: Colors.Brand.brandColor}}>
              BMI Calculator
            </Title>
          </Body>
        </Header>

        <View style={styles.notificationContainer}>
          <View style={styles.inputContainer}>
            <View style={{flex: 1}}>
              <TextInput
                placeholder="Height"
                value={this.props.height}
                keyboardType="number-pad"
                onChangeText={(text) => this.props.setHeight(text)}
                placeholderTextColor="#555"
                style={styles.input}
              />
              <Text style={styles.inputLabel}>Centimeters (cm)</Text>
            </View>
            <View style={{flex: 1}}>
              <TextInput
                placeholder="Weight"
                value={this.props.weight}
                keyboardType="number-pad"
                onChangeText={(text) => this.props.setWeight(text)}
                placeholderTextColor="#555"
                style={styles.input}
              />
              <Text style={styles.inputLabel}>Kilogram (kg)</Text>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.bmi}>
              <H1
                style={{
                  color: Colors.Brand.brandColor,
                  fontWeight: 'bold',
                  fontSize: 30,
                  lineHeight: 50,
                }}>
                {bmi.toFixed(2)}
              </H1>
              <Text style={{fontWeight: 'bold', color: 'red'}}>{comment}</Text>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 12,
    color: Colors.Brand.brandColor,
    textAlign: 'center',
  },
  bmi: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: Colors.Brand.getBrandColorByOpacity(0.6),
    marginTop: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderStyle: 'dotted',
  },
  inputContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderRadius: 50,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 20,
    backgroundColor: '#f4f4f4',
    marginHorizontal: 10,
    minHeight: 60,
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
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.Brand.brandColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: Colors.Brand.brandColor,
  },
  notificationContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BMI);
