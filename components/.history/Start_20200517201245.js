import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native';

export default class Start extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      color: ''
    }
  }

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/BackgroundImage.png')}
      >
        <Text style={styles.appTitle}>ChatApp</Text>

        <View style={styles.container}>

          {/*Name input section*/}
          <TextInput
            accessible={true}
            accessibilityLabel='Input name'
            value={this.state.name}
            placeholder='Your Name'
            autoCompleteType={'off'}
            style={styles.nameContainer}
            onChangeText={(name) => this.setState({ name })}
          />

          {/*Chat background color selector*/}
          <Text style={styles.text}>
            Choose Background Color:
                    </Text>
          <View style={styles.colorOptions}>
            <TouchableOpacity
              style={[styles.colorButtons, styles.colorOption1]}
              onPress={() => this.setState({ color: '#090C08' })}
            />

            <TouchableOpacity
              style={[styles.colorButtons, styles.colorOption2]}
              onPress={() => this.setState({ color: '#474056' })}
            />

            <TouchableOpacity
              style={[styles.colorButtons, styles.colorOption3]}
              onPress={() => this.setState({ color: '#8A95A5' })}
            />

            <TouchableOpacity
              style={[styles.colorButtons, styles.colorOption4]}
              onPress={() => this.setState({ color: '#B9C6AE' })}
            />
          </View>
          <TouchableNativeFeedback
            onPress={() => this.props.navigation.navigate('Chat',
              {
                name: this.state.name,
                color: this.state.color
              }
            )}
          >
            <View
              accessible={true}
              accessibilityLabel='Start chatting'
              style={styles.chatBtn}
            >
              <Text style={styles.textBtn}>
                Start Chatting
                            </Text>
            </View>
          </TouchableNativeFeedback>
          {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
        </View>
      </ImageBackground >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '88%',
    fontSize: 16,
    height: '44%',
    color: '#000',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#757083',
    fontWeight: '300',

  },
  appTitle: {
    flex: 1,
    fontSize: 45,
    marginTop: 60,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  nameContainer: {
    height: 65,
    opacity: .5,
    fontSize: 16,
    width: '88%',
    marginTop: 20,
    borderWidth: 2,
    marginBottom: 30,
    color: '#757083',
    fontWeight: '300',
    textAlign: 'center',
    borderColor: '#757083',
  },
  chatBtn: {
    height: 65,
    width: '88%',
    marginBottom: 20,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757083',
  },
  textBtn: {
    margin: 30,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  colorOptions: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  colorButtons: {
    width: 40,
    height: 40,
    margin: 10,
    borderRadius: 20,
  },
  colorOption1: {
    backgroundColor: '#090C08',
  },
  colorOption2: {
    backgroundColor: '#474056',
  },
  colorOption3: {
    backgroundColor: '#8A95A5',
  },
  colorOption4: {
    backgroundColor: '#B9C6AE',
  }
});