import React, {useState, useEffect, useContext} from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from "../types";
import { IRecipeDatabase, RecipeDatabaseContext } from '../Database';
import { FAB } from 'react-native-paper';


export default function HomeScreen(props:any) {
    
    // TODO implment search function
    
    const [recipes, setRecipes] = useState<Recipe[]>()
    const {db, setListeners} = useContext(RecipeDatabaseContext);
    
    const initRecipes = async ()=>{
        return db.then((db: IRecipeDatabase)=>{
            return db.getAllRecipes();
        }).then((init_recipes: Recipe[]) =>{
            setRecipes(init_recipes);
        }).catch((e: any)=>{
            console.log("database un init", e)
        })
    }

    useEffect(()=>{
        setListeners([initRecipes])
    }, [])

    useEffect(()=>{
        const unsub = props.navigation.addListener(
            "focus",
            ()=>{
                initRecipes()
            }
        )
        return unsub;
    },[props.navigation]);

    const removeRecipe = async (recipe_id:number)=>{
        return db.then((db: IRecipeDatabase)=>{
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

    const clickRecipe = (recipe_id:number)=>{
        props.navigation.navigate("Recipe", {recipe_id:recipe_id})
    }

    const addRecipe = ()=>{
        props.navigation.navigate("Recipe");
    }

    const clickList = ()=>{
        props.navigation.navigate("List")
    }

    const addRecipeToList = async (recipe_id:number)=>{
        db.then((db: IRecipeDatabase)=>{
            return db.addRecipeToList(recipe_id)
        }).then(()=>{
            console.log("Recipe added to list")
        })
    }

    const removeRecipeFromList = async (recipe_id:number)=>{
        db.then((db: IRecipeDatabase)=>{
            return db.removeRecipeFromList(recipe_id)
        }).then(()=>{
            console.log("Recipe removed from list")
        })
    }

    const resetDb = async ()=>{
        db.then((db: IRecipeDatabase)=>{
            db.resetDatabase()
        })
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
                            addThisToList = {addRecipeToList}
                            removeThisFromList = {removeRecipeFromList}
                        />
                    }}
                    keyExtractor={item=>`${item._id}`}
                >
                </FlatList>
            </View>
            <FAB
                icon="plus"
                style={styles.add_fab}
                onPress = {addRecipe}
            ></FAB>
            <FAB
                icon="view-list"
                style={styles.list_fab}
                onPress = {clickList}
            ></FAB>
            <FAB
                icon="minus"
                style={styles.reset_fab}
                onPress = {resetDb}
            ></FAB>
        </View>
    )
}


const styles = StyleSheet.create({
    add_fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    list_fab: {
        position: 'absolute',
        margin: 16,
        bottom:0,
        left: 0
    },
    reset_fab: {
        position: 'absolute',
        margin: 16,
        bottom:0,
        left: 100
    }
})