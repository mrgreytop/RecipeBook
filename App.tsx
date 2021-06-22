import React from 'react';
import { 
  Provider as PaperProvider 
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home';

function ScreenController(){
  return(
    <Stack.Navigator>
      <Stack.Screen name = "Home" component = {HomeScreen} ></Stack.Screen>
    </Stack.Navigator>
  )
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <ScreenController></ScreenController>
      </NavigationContainer>
    </PaperProvider>
  );
}