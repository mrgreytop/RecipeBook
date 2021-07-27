import React, {useState, useEffect} from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from "../types";
import { RecipeDatabase, IRecipeDatabase } from '../Database';
import { FAB } from 'react-native-paper';

let recipeDb: Promise<IRecipeDatabase> = RecipeDatabase();

export default function HomeScreen(props:any) {

    const [recipes, setRecipes] = useState<Recipe[]>()

    useEffect(()=>{
        const unsub = props.navigation.addListener(
            "focus",
            ()=>{
                initRecipes()
            }
        )
        return unsub;
    },[props.navigation]);

    const initRecipes = async ()=>{
        return recipeDb.then(db=>{
            return db.getAllRecipes();
        }).then(init_recipes =>{
            setRecipes(init_recipes);
        });
    }

    const removeRecipe = async (recipe_id:number)=>{
        return recipeDb.then(db=>{
            return db.removeRecipe(recipe_id);
        }).then(()=>{
            setRecipes((old_recipes: Recipe[] | undefined) => {
                if (old_recipes !== undefined) {
                    let remove_idx = old_recipes.findIndex((r: Recipe) => r._id == recipe_id)
                    return [
                        ...old_recipes.slice(0, remove_idx),
                        ...old_recipes.slice(remove_idx + 1)
                    ]
                }
            })
        })
    }

    const clickRecipe = ()=>{
        // props.navigation.navigate()
    }

    const addRecipe = ()=>{
        props.navigation.navigate("Recipe");
    }

    return (
        
        <View style = {{flexDirection:"column", height:"100%"}}>
            <View style = {{flex:1}}>
                <FlatList
                    data = {recipes}
                    renderItem = {(p)=>{
                        return <RecipeCard {...p} 
                            removeThis = {removeRecipe}
                            clickThis = {clickRecipe}
                        />
                    }}
                    keyExtractor={item=>`${item._id}`}
                >
                </FlatList>
            </View>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress = {addRecipe}
            ></FAB>
        </View>
    )
}


const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
})