import React from 'react';
import { 
  Provider as PaperProvider 
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import { SafeAreaView, StatusBar } from 'react-native';

const Stack = createStackNavigator()

function ScreenController(){
  return(
    <Stack.Navigator>
      <Stack.Screen name = "Home" component = {HomeScreen} ></Stack.Screen>
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView>
        <StatusBar/>
        <NavigationContainer>
          <ScreenController></ScreenController>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}
