import React, {useState} from "react";
import { 
    View, StyleSheet, FlatList, TextInput as NativeTextInput, 
    TextInputSubmitEditingEventData, NativeSyntheticEvent
} from "react-native";
import { TextInput } from "react-native-paper";
import { RecipeIngredient } from "../types";
import IngredientCard from "../components/IngredientCard";

type onTextSubmit = (
    NativeSyntheticEvent<TextInputSubmitEditingEventData>
    & {key:string}
)

export default function RecipeFormScreen(){

    const [name, setName] = useState<string>("");
    const [servings, setServings] = useState<string>("");
    const [ingredients, setIngredients] = useState<({key:string} & RecipeIngredient)[]>([
        {key:"1", amount:5,unit:"kg",name:"salt"},
        {key:"2", amount:5,unit:"",name:"onions"},
        {key:"3", amount:20,unit:"ml",name:"water"},
    ]);

    const onIngredientEdit = (ev:onTextSubmit)=>{
        console.log("do somethin with text", ev.nativeEvent.text, ev.key)
    }

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
                <FlatList
                    data = {ingredients}
                    renderItem = {(ing)=>{
                        return <IngredientCard 
                            {...ing} 
                            onEdit = {onIngredientEdit}
                            ></IngredientCard>
                    }}
                >
                </FlatList>
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