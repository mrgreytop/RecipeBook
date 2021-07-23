import React, {useState} from "react";
import { View, StyleSheet, FlatList, TextInput as NativeTextInput } from "react-native";
import { TextInput } from "react-native-paper";
import { RecipeIngredient } from "../types";

export default function RecipeFormScreen(){

    const [name, setName] = useState<string>("");
    const [servings, setServings] = useState<string>("");
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);

    return (
        <View style = {styles.flexCol}>
            <TextInput
                label="name"
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
            ></TextInput>
            
            <TextInput
                label="servings"
                value={servings}
                onChangeText={(text) => setServings(text)}
                render={(props) =>
                    <NativeTextInput
                        {...props}
                        keyboardType="number-pad"
                    ></NativeTextInput>
                }
            ></TextInput>
            <View style ={{flex:1}}>
                {/* <FlatList
                    data = {ingredients}
                >
                </FlatList> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    flexCol:{
        flex:1,
        flexDirection:"column"
    }
})