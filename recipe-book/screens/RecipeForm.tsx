import React, {useState, useRef, useEffect, useContext} from "react";
import { 
    View, StyleSheet, FlatList, TextInput as NativeTextInput, 
    TextInputSubmitEditingEventData, NativeSyntheticEvent
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import IngredientCard from "../components/IngredientCard";
import { RecipeDatabase, IRecipeDatabase, RecipeDatabaseContext } from '../Database';
import { Recipe, LazyRecipeIngredient, RecipeIngredient, Unit} from "../types";


type onTextSubmit = (
    NativeSyntheticEvent<TextInputSubmitEditingEventData>
)

export default function RecipeFormScreen(props:any){
    
    // TODO implment tags in form

    const [name, setName] = useState<string>("");
    const [servings, setServings] = useState<string>("");
    const [ingredients, setIngredients] = useState<({key:string} & LazyRecipeIngredient)[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>("");
    const [isBound, setIsBound] = useState<boolean>(false);
    const [units, setUnits] = useState<string[]>([])

    const {db, setListeners} = useContext(RecipeDatabaseContext);

    const newIngInput = useRef(null);

    useEffect(()=>{
        setListeners([])
        initUnits()
        if(props.route.params){
            initForm(props.route.params.recipe_id)
        }
    },[])

    const initForm = async (recipe_id:number)=>{
        db.then((db: IRecipeDatabase)=>{
            return db.readRecipe(recipe_id)
        }).then((recipe:Recipe) => {
            setName(recipe.name)
            setServings(`${recipe.servings}`)
            setIngredients(
                recipe.ingredients.map((ing,i)=>{
                    return {
                        key:`${i}`,
                        name:ing.name,
                        amount:ing.amount,
                        unit:ing.unit.symbol
                    }
                })
            )
            setIsBound(true);
        })
    }

    const initUnits = async ()=>{
        db.then((db: IRecipeDatabase)=>{
            return db.getAllUnits()
        }).then((init_units: Unit[])=>{
            let unit_symbols = init_units
                .filter(u=>u.symbol !== "")
                .map(u=>u.symbol)
            console.log("available units", unit_symbols)
            setUnits(unit_symbols)
        })
    }

    const parse_ingredients = (ing_text: string): LazyRecipeIngredient[] => {
        let unit_group = units.join("|")
        let rg = RegExp(`^[\\s]*([\\d\\.]+)[\\s]*(${unit_group}|)(.*)$`, "gm")

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

    const onIngredientDelete = (key:string)=>{
        setIngredients(old_ings=>{
            return old_ings.filter(ing=>ing.key !== key)
        })
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

    const onSave = async (): Promise<void>=>{
        console.log("saving recipe")
        // TODO add validation errors with snackbars
        // TODO add 'saving' component on save
        // TODO slugify ingredient names
        let recipeDb = await db
        if (recipeDb === null){
            return new Promise(res => setTimeout(res, 500)).then(()=>{
                console.log("waiting for db to load");
                return onSave();
            });
        }

        let unit_promises = ingredients.map(ing=>recipeDb.readUnit(ing.unit));
        let ing_units = await Promise.all(unit_promises)

        let ings: RecipeIngredient[] = ingredients.map(
            (v,i)=> {
                return {
                    name:v.name,
                    amount: v.amount,
                    unit: ing_units[i]
                }
            }
        )
        let recipe = {
            name:name,
            servings: parseInt(servings),
            tags: [],
            ingredients: ings
        }
        
        if (isBound){
            await recipeDb.updateRecipe(
                props.route.params.recipe_id,
                recipe
            )
        }else{
            await recipeDb.addRecipe(recipe)
        }
        console.log("recipe saved")
        props.navigation.navigate("Home")
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
                            onDelete = {onIngredientDelete}
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