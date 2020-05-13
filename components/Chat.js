import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Platform from 'react-native';
import { StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, Button, View } from 'react-native';
import firebase from "firebase";
import "firebase/firestore";

export default class Chat extends React.Component {

  constructor() {
    super();
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
      })
    }

    // this.referenceMessageUser = null;
    this.referenceMessages = firebase.firestore().collection('messages')

    this.state = {
      messages: [],
      uid: 0,
      user: {
        uid: '',
        name: '',
        avatar: ''
      }
    };
  }

  //this will put the users name in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: this.state.uid,
      id: this.state.uid,
    }
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
        createdAt: data.createdAt,
        user: data.user,
        image: data.image,
        location: data.location
      });
    });
    this.setState({
      messages
    });
  };

  addMessage() {
    console.log(this.state.messages[0].user)
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      // user: [this.state.uid, this.props.navigation.state.params.name, ''],
      // image: this.state.messages[0].image || '',
      // location: this.state.messages[0].location || null,
      uid: this.state.uid,
    });
  }

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

  componentDidMount() {
    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        user = await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: "Logged in"
      });

      // create a reference to the active user's documents (messages)

      // this.referenceMessageUser = firebase.firestore().collection("messages");

      // listen for collection changes for current user
      this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
    });
    this.setState({
      messages: [
        {
          _id: 124098920,
          text: 'Hi there',
          createdAt: new Date(),
          user: {
            _id: 5,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `${this.props.navigation.state.params.name} have just joined the chat`,
          createdAt: new Date(),
          system: true,
        },
      ]
    })
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    // this.unsubscribeMessageUser();
  }

  render() {
    return (
      <View style={[{ flex: 1 }, { backgroundColor: this.props.navigation.state.params.color }]}>
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.user}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    )
  }
}
