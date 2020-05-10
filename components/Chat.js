import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import Platform from 'react-native'
import { StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, Button, View } from 'react-native';

export default class Chat extends React.Component {
  state = {
    messages: [],
  }

  //this will put the users name in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    }
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: this.props.navigation.state.params.name + ' has entered the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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

  render() {
    return (
      <View style={[{ flex: 1 }, { backgroundColor: this.props.navigation.state.params.color }]}>
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}

        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    )
  }
}
