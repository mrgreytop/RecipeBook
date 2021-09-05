import React, {useState, useRef, useEffect} from "react";
import { 
    View, StyleSheet, FlatList, TextInput as NativeTextInput, 
    TextInputSubmitEditingEventData, NativeSyntheticEvent
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import IngredientCard from "../components/IngredientCard";
import { RecipeDatabase, IRecipeDatabase, null_unit } from '../Database';
import { Recipe, Unit, LazyRecipeIngredient} from "../types";


let recipeDb: Promise<IRecipeDatabase> = RecipeDatabase();

type onTextSubmit = (
    NativeSyntheticEvent<TextInputSubmitEditingEventData>
)

//TODO load from database
const units = [
    "",
    "ml",
    "g"
]

export default function RecipeFormScreen(props:any){

    // TODO implment tags in form

    const [name, setName] = useState<string>("");
    const [servings, setServings] = useState<string>("");
    const [ingredients, setIngredients] = useState<({key:string} & LazyRecipeIngredient)[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>("");
    const [isBound, setIsBound] = useState<boolean>(false);
    const [errors, setErrors] = useState<Map<string, string>>(new Map<string, string>());

    const newIngInput = useRef(null);

    useEffect(()=>{
        if(props.route.params){
            initForm(props.route.params.recipe_id)
        }
    },[])

    const initForm = async (recipe_id:number)=>{
        recipeDb.then(db=>{
            return db.readRecipe(recipe_id)
        }).then((recipe:Recipe) => {
            setName(recipe.name)
            setServings(`${recipe.servings}`)
            setIngredients(
                recipe.ingredients.map((e,i)=>{
                    return {
                        key:`${i}`,
                        ...e
                    }
                })
            )
            setIsBound(true);
        })
    }

    function parse_ingredients(ing_text: string): LazyRecipeIngredient[] {
        let unit_group = units.join("|")
        let rg = RegExp(`^[\\s]*([\\d\\.]+)[\\s]*(${unit_group})(.*)$`, "gm")

        let ingredients: LazyRecipeIngredient[] = []

        var match = rg.exec(ing_text)

        while (match !== null) {
            let name = match[3].trim()
            name = /^x(\b|[0-9])/gm.test(name) ? name.slice(1).trim() : name

            let unit = match[2].trim()
            let amount = parseFloat(match[1])

            ingredients.push({
                amount: amount,
                unit: unit,
                name: name
            })

            match = rg.exec(ing_text);
        }

        return ingredients
    }

    const onIngredientEdit = (ev:(onTextSubmit&{key:string}))=>{
        let ings = parse_ingredients(ev.nativeEvent.text)
        if (ings.length == 1){
            let new_ings = [...ingredients];
            let idx_to_change = new_ings.findIndex(
                ing => ing.key == ev.key
            )
            new_ings[idx_to_change] = {
                key: ev.key,
                ...ings[0]
            }
            setIngredients(new_ings)
        }
    }

    const addNewIngredient = (ev:onTextSubmit)=>{
        let ings = parse_ingredients(ev.nativeEvent.text)
        if (ings.length == 0){
            console.log("Remember to put the amount first then the ingredient")
            // TODO show snackbar
        }else{
            setIngredients(old_ings=>{
                let last_key = 0;
                if (old_ings.length != 0){
                    last_key = parseInt(old_ings[0].key)
                }
                let new_ings = ings.map((e, i)=>{
                    return {
                        key:`${last_key + i + 1}`,
                        ...e
                    }
                })
                return [...new_ings, ...old_ings]
            })
            setNewIngredient("");
        }
    }

    const onSave = ()=>{
        console.log("saving recipe")
        // TODO add validation with snackbars
        let recipe = {
            name: name,
            servings: parseInt(servings),
            tags: [],
            ingredients: ingredients.map(ing => {
                return {
                    name: ing.name,
                    amount: ing.amount,
                    unit: ing.unit
                }
            })
        }
        recipeDb.then((db)=>{
            if (isBound){
                db.updateRecipe(
                    props.route.params.recipe_id,
                    recipe
                )
            }else{
                db.addRecipe(recipe)
            }
        }).then(() => {
            console.log("recipe saved")
            props.navigation.navigate("Home")
        })
    }

    return (
        <View style = {styles.flexCol}>
            <TextInput
                label="Name"
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
            ></TextInput>
            
            <TextInput
                label="Servings"
                value={servings}
                onChangeText={(text) => setServings(text)}
                render={(props) =>
                    <NativeTextInput
                        {...props}
                        keyboardType="number-pad"
                    ></NativeTextInput>
                }
            ></TextInput>
            <TextInput 
                label="Add Ingredients"
                value={newIngredient}
                onChangeText={text=> setNewIngredient(text)}
                onSubmitEditing={addNewIngredient}
                ref = {newIngInput}
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
            <Button 
                onPress = {onSave} 
                mode="contained"
                style = {{marginHorizontal:5,marginVertical:2}}
            >Save</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    flexCol:{
        flex:1,
        flexDirection:"column"
    }
})