import React, {useState} from "react";
import { View, StyleSheet, FlatList, TextInput as NativeTextInput } from "react-native";
import { TextInput, FAB } from "react-native-paper";
import IngredientCard from "../components/IngredientCard";
import { RecipeIngredient } from "../types";

export default function RecipeFormScreen(){

    const [name, setName] = useState<string>("");
    const [servings, setServings] = useState<string>("");
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>();

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
                style={{ flex: 1 }}
            ></TextInput>
            <FlatList
                data = {ingredients}
                renderItem = {(item)=>(
                    <IngredientCard {...item}></IngredientCard>
                )}
            ></FlatList>
            <FAB
                icon = "plus"
                style = {styles.fab}
            ></FAB>
        </View>
    )
}

const styles = StyleSheet.create({
    flexCol:{
        flex:1,
        flexDirection:"column"
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
})