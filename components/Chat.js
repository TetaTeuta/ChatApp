import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import { MapView } from 'react-native-maps';

import firebase from 'firebase';
import 'firebase/firestore';

console.disableYellowBox = true;

export default class Chat extends React.Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      image: null,
    };
    // Firebase init
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDIVBDt0W3t0UVpotXQbhj7GeX4khPAgKk",
        authDomain: "chatapp-78617.firebaseapp.com",
        databaseURL: "https://chatapp-78617.firebaseio.com",
        projectId: "chatapp-78617",
        storageBucket: "chatapp-78617.appspot.com",
        messagingSenderId: "967149298342",
        appId: "1:967149298342:web:a59ab9e170511b9f564a67",
        measurementId: "G-2K4CQY79QF"
      });
    }
    this.referenceMessages = firebase.firestore().collection('messages');
  }
  // Set navigation title as username
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };
  // Display elements
  componentDidMount() {
    NetInfo.fetch().then(state => {
      //console.log('Connection type', state.type);
      if (state.isConnected) {
        //console.log('Is connected?', state.isConnected);
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (!user) {
            try {
              await firebase.auth().signInAnonymously();
            } catch (error) {
              console.log('Unable to sign in: ' + error.message);
            }
          }
          this.setState({
            isConnected: true,
            user: {
              _id: user.uid,
              name: this.props.navigation.state.params.name,
              avatar: 'https://placeimg.com/140/140/any',
            },
            loggedInText: this.props.navigation.state.params.name + ' has entered the chat',
            messages: [],
          });
          //console.log(user);
          this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
  };
  componentWillUnmount() {
    // Stop listening for authentication
    this.authUnsubscribe();
    // Stop listening for changes
    this.unsubscribe();
  };
  // Update the message state with input data 
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach(doc => {
      // Get queryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || '',
        location: data.location || null,
        sent: true,
      });
    });
    this.setState({
      messages
    });
  };
  // Add message
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || '',
      location: message.location || null,
      sent: true,
    });
  };
  // Get messages from local(async) storage
  async getMessages() {
    var messages = [];
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // Save messages locally(asyncStorage)
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };
  // Delete messages locally(asyncStorage)
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  };
  // Send message
  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  };
  // Hide inputbar when offline
  renderInputToolbar(props) {
    if (this.state.isConnected) {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  };
  // Change message bubble color
  renderBubble(props) {

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0E3B43'
          },
          left: {
            backgroundColor: '#357266'
          }
        }}
      />
    );
  };

  // Custom view display when the message contains location
  renderCustomView(props) {
    var { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  // Render custom actions in inputToolbar
  renderCustomActions = (props) => <CustomActions {...props} />;

  render() {
    return (
      <View style={[
        styles.container,
        { backgroundColor: this.props.navigation.state.params.color },
      ]}>
        <GiftedChat
          scrollToBottom
          renderAvatarOnTop
          showUserAvatar={true}
          user={this.state.user}
          messages={this.state.messages}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions}
          onSend={messages => this.onSend(messages)}
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          timeTextStyle={{ left: { color: '#FFF' }, right: { color: '#FFF' } }}
        />
        {/* {Platform.OS === 'android' ? <KeyboardSpacer /> : null} */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: '#FFFFFF',
    backgroundColor: '#000000',
  },
  mapContainer: {
    width: 250,
    height: 200,
    borderRadius: 13,
    margin: 1,
    //width: Dimensions.get('window').width,
    //height: Dimensions.get('window').height,
  },
});