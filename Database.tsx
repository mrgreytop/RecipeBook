import AsyncStorage from "@react-native-async-storage/async-storage";
import {Recipe} from "./types";

var RecipeDatabase = (async function(){
    
    var max_key = await findMaxKey();

    async function findMaxKey():Promise<number>{
        return AsyncStorage.getItem("@maxkey:recipe").then((val:string|null)=>{
            if(val === null){
                return 0
            }else{
                return parseInt(val)
            }
        })    
    }

    async function incrementMaxKey():Promise<number>{
        max_key += 1;
        await AsyncStorage.setItem("@maxkey:recipe", `${max_key}`)
        return max_key
    }

    return {
        getAllRecipes: async function():Promise<Recipe[]>{
            return AsyncStorage.getAllKeys().then((keys:string[]|undefined)=>{
                if (keys === undefined){
                    return []
                }else{
                    return keys.filter((k:string)=>k.startsWith("@recipe:"))
                }
            }).then((recipe_keys:string[])=>{
                return AsyncStorage.multiGet(recipe_keys)
            }).then((recipes:[string, string|null][])=>{

                let recipe_objs:Recipe[] = recipes.map((key_val:[string,string|null])=>{
                    if (key_val[1] !== null){
                        return JSON.parse(key_val[1]);
                    }else{
                        return null
                    }
                })

                return recipe_objs.filter((obj)=>obj!==null)
            })
        },

        addRecipe: async function(recipe:Partial<Recipe>): Promise<number>{
            let recipe_id = await incrementMaxKey()
            recipe._id = recipe_id;

            let recipe_json = JSON.stringify(recipe)
            await AsyncStorage.setItem(`@recipe:${recipe_id}`, recipe_json)

            return recipe_id
        },

        removeRecipe: async function(recipe_id:number): Promise<void>{
            return AsyncStorage.removeItem(`@recipe:${recipe_id}`)
        },

        updateRecipe: async function(recipe_id:number, update:Partial<Recipe>): Promise<void>{
            return AsyncStorage.getItem(`@recipe:${recipe_id}`).then((recipe_json:string|null)=>{
                if(recipe_json === null){
                    throw new Error(`Cannot update recipe as it doesn't exist`)
                }
                let recipe:Recipe = JSON.parse(recipe_json)
                let updated_recipe = { ...recipe, ...update }
                return AsyncStorage.setItem(
                    `@recipe:${recipe_id}`, JSON.stringify(updated_recipe)
                );
            })
        }
    }

})
