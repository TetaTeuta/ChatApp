import Chat from './components/Chat';
import Start from './components/Start';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const navigator = createStackNavigator({
  Start: {
    screen: Start,
    navigationOptions: {
      headerShown: false,
    },
  },
  Chat: { screen: Chat },
});

const navigatorContainer = createAppContainer(navigator);

export default navigatorContainer;
