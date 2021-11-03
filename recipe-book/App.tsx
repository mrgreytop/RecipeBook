import React, { useEffect, useState } from 'react';
import { 
  Provider as PaperProvider 
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home';
import RecipeFormScreen from './screens/RecipeForm';
import { SafeAreaView, View, Text } from 'react-native';
import ListScreen from './screens/List';
import { RecipeDatabase, RecipeDatabaseContext, IRecipeDatabase } from './Database';

function ScreenController(){
  return(
    <Stack.Navigator>
      <Stack.Screen name = "Home" component = {HomeScreen} ></Stack.Screen>
      <Stack.Screen name="Recipe" component={RecipeFormScreen} ></Stack.Screen>
      <Stack.Screen name="List" component={ListScreen} ></Stack.Screen>
    </Stack.Navigator>
  )
}

// TODO create context for RecipeDatabase

const Stack = createStackNavigator();

export default function App() {
  const [recipeDb, setRecipeDb] = useState<null|Promise<IRecipeDatabase>>(null);

  const setDbListeners = (listeners: Function[])=>{
    setRecipeDb(RecipeDatabase(listeners));
  }

  useEffect(()=>{
    setRecipeDb(RecipeDatabase())
  },[])

  return (
    // <View>
    //   <Text>Hello World</Text>
    // </View>
    <PaperProvider>
      <RecipeDatabaseContext.Provider value = {{
        db:recipeDb,
        setListeners:setDbListeners
      }}>
        <SafeAreaView style = {{flex:1, flexDirection:"column"}}>
          <NavigationContainer>
            <ScreenController></ScreenController>
          </NavigationContainer>
        </SafeAreaView>
      </RecipeDatabaseContext.Provider>
    </PaperProvider>
  );
}