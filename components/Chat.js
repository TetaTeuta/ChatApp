import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Platform from 'react-native';
import { StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, Button, View } from 'react-native';
import firebase from "firebase";
import "firebase/firestore";

export default class Chat extends React.Component {

  constructor() {
    super();

    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: ''
      }
    };

    var firebaseConfig = {
      apiKey: "AIzaSyDIVBDt0W3t0UVpotXQbhj7GeX4khPAgKk",
      authDomain: "chatapp-78617.firebaseapp.com",
      databaseURL: "https://chatapp-78617.firebaseio.com",
      projectId: "chatapp-78617",
      storageBucket: "chatapp-78617.appspot.com",
      messagingSenderId: "967149298342",
      appId: "1:967149298342:web:a59ab9e170511b9f564a67",
      measurementId: "G-2K4CQY79QF"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceMessages = firebase.firestore().collection('messages')

  }

  //this will put the users name in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  componentDidMount() {
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      if (this.props.navigation.state.params.name) {
        this.setUser(user.uid, this.props.navigation.state.params.name);
      } else {
        this.setUser(user.uid);
      }
      this.setState({
        uid: user.uid,
        loggedInText: 'Welcome'
      });

      this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
    });

    this.setState({
      messages: [
        {
          _id: 124098920,
          text: 'Hi there',
          createdAt: new Date(),
          user: {
            name: "Teuta",
            _id: 5,
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: this.props.navigation.state.params.name + ' is in da house!',
          createdAt: new Date(),
          system: true,
        }
      ]
    })
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    this.unsubscribe();
  }

  setUser = (_id, name = "Anonymous") => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: "https://placeimg.com/140/140/tech"
      }
    });
  }

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: this.state.uid,
      id: this.state.uid,
    }
  }

  addMessage() {
    console.log(this.state.user)
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid,
    });
  }

  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessage();
      }
    );
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach(doc => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.Date,
        user: data.user,
        image: data.image,
      });
    });
    this.setState({
      messages
    });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }







  render() {
    return (
      <View style={[{ flex: 1 }, { backgroundColor: this.props.navigation.state.params.color }]}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    )
  }
}
