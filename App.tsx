import React from 'react';
import { 
  Provider as PaperProvider 
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import RecipeFormScreen from './screens/RecipeForm';
import { SafeAreaView } from 'react-native';

function ScreenController(){
  return(
    <Stack.Navigator>
      <Stack.Screen name = "Home" component = {HomeScreen} ></Stack.Screen>
      <Stack.Screen name="Recipe" component={RecipeFormScreen} ></Stack.Screen>
    </Stack.Navigator>
  )
}

// TODO create a 'shopping list screen'

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style = {{flex:1, flexDirection:"column"}}>
        <NavigationContainer>
          <ScreenController></ScreenController>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}