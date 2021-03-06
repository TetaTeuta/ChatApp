import React from 'react';
import 'firebase/firestore';
import firebase from 'firebase';
import CustomActions from './CustomActions';
import NetInfo from '@react-native-community/netinfo';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Platform, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

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
  };

  // Set navigation title
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  componentDidMount() {
    NetInfo.fetch().then(state => {
      // Check if the user is online
      if (state.isConnected) {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (!user) {
            try {
              await firebase.auth().signInAnonymously();
            } catch (error) {
              console.log(`Unable to sign in: ${error.message}`);
            }
          }
          this.setState({
            isConnected: true,
            user: {
              _id: user.uid,
              name: this.props.navigation.state.params.name,
              avatar: 'https://placeimg.com/140/140/any',
            },
            messages: [],
          });
          this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        // The user is offline
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
  };

  // Stop listening for authentication and changes
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  };

  /**
     * Update the message state with the most recent data 
     * @function onCollectionUpdate
     * @param {string} _id - message id
     * @param {string} text - message content
     * @param {date} cratedAt - date and time of message
     * @param {string} user - user data
     * @param {string} image
     * @param {number} location - geographical coordinates
     * @param {boolean} sent
     * @returns {state}
     */
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

  /**
  * Add message
  * @function addMessage
  * @param {string} _id - message id
  * @param {string} text - message content
  * @param {date} cratedAt - date and time of message
  * @param {string} image 
  * @param {number} location - geographical coordinates 
  * @param {boolean} sent
  */
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

  /**
       * If the user is offline, the messages are stored locally(async storage)
       * The user can access the messages when offline
       * @function getMessages
       * @param {string} messages 
       * @returns {state} messages
       */
  async getMessages() {
    let messages = [];
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(`Unable to get messages: ${error.message}`);
    }
  };

  /**
     * Save messages in local storage
     * @async
     * @function saveMessages
     * @returns {AsyncStorage} - setItem
     */
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(`Unable to save messages: ${error.message}`);
    }
  };

  /**
     * @async
     * @function deleteMessages
     * @returns {AsyncStorage} - removeItem
     */
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(`Unable to delete messages: ${error.message}`);
    }
  };

      /**
       * @function onSend
       * @param {string} messages - the data can take the form of message, image or geo location
       * @returns {state} @GiftedChat append - the state is updated to include the most recent data(also saved locally)
       */
  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  };

  /**
       * Only if the user is online the input toolbar is returned 
       * @function renderInputToolbar
       * @param {*} props 
       * @returns {InputToolbar}
       */
  renderInputToolbar(props) {
    if (this.state.isConnected) {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  };

  /**
     * @function renderBubble
     * @param {*} props 
     * @returns {Bubble}
     */
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

  /**
    * If the message contains geo location coordinates, mapView is returned
    * @function renderCustomActions
    * @param {*} props 
    * @returns {MapView}
    */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage ?.location ?.latitude && currentMessage ?.location ?.longitude) {
      return (
        <MapView
          style={styles.mapContainer}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          loadingEnabled={true}
          showsCompass={true}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
            }}
          />
        </MapView>
      );
    }
    return null;
  };

  /**
     * Render image selector, take photo and share location
     * @function renderCustomActions
     * @param {*} props
     * @returns {CustomActions}
     */
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
    margin: 1,
    width: 250,
    height: 200,
    borderRadius: 13,
  },
});