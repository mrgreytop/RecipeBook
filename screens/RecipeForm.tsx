import React, {useState} from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { TextInput, FAB } from "react-native-paper";
import IngredientCard from "../components/IngredientCard";

export default function RecipeFormScreen(){

    const [name, setName] = useState<string>();
    const [ingredients, setIngredients] = useState<any>();

    return (
        <View style = {styles.flexCol}>
            <TextInput
                label="name"
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
            ></TextInput>
            <FlatList
                data = {ingredients}
                renderItem = {(item:any)=>(
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