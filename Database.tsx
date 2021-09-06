import AsyncStorage from "@react-native-async-storage/async-storage";
import {Recipe, RecipeIngredient, Unit, SiMeasure, ListRecipe, ListIngredient} from "./types";
// TODO add shopping lists to database


function convert_unit(amount:number, unit:Unit, new_unit:Unit):number|null{
    if (unit.measure != new_unit.measure){
        return null
    }
    if (unit.measure == SiMeasure.None){
        return amount
    }
    if ((unit.factor === null) && (new_unit.factor === null)){
        return amount / (unit.factor * new_unit.factor)
    }else{
        throw new Error("unexpected null factors")
    }
}

function combine_ingredients(list: ListRecipe):ListIngredient{
    let ingredients = new Map <string, {unit:Unit, amount:number}[]>()
    for (let i = 0; i < list.recipes.length; i++) {
        const ings = list.recipes[i].ingredients
        for (let j = 0; j < ings.length; j++) {
            const ing = ings[j]
            let amounts = ingredients.get(ing.name)
            if (amounts !== undefined){
                let unit_amount = amounts.find(a=>a.unit == ing.unit)
                if (unit_amount !== undefined){
                    unit_amount.amount += ing.amount
                }else{
                    unit_amount = amounts[0]
                    let converted_amount = convert_unit(ing.amount, ing.unit, unit_amount.unit)
                    if (converted_amount !== null){
                        unit_amount.amount += converted_amount
                    }else{
                        amounts.push({unit:ing.unit, amount:ing.amount})
                    }
                }
            }else{
                ingredients.set(ing.name, [{unit:ing.unit, amount:ing.amount}])
            }
        }
    }
    return {"ingredients":ingredients}
}


export const null_unit = { symbol: "", measure: SiMeasure.None }

const default_units: Unit[] = [
    null_unit,
    {symbol: "g", measure:SiMeasure.Weight, factor: 1},
    {symbol: "ml", measure:SiMeasure.Volume, factor: 1},
]

export interface IRecipeDatabase{
    getAllRecipes:()=>Promise<Recipe[]>,
    addRecipe:(recipe: Partial<Recipe>)=>Promise<number>,
    removeRecipe:(recipe_id:number)=>Promise<void>,
    updateRecipe:(recipe_id:number, update:Partial<Recipe>)=>Promise<void>,
    readRecipe: (recipe_id:number)=>Promise<Recipe>,
    readUnit: (unit_symbol:string)=>Promise<Unit>,
    writeUnit: (unit: Unit)=>Promise<void>,
    getAllUnits:()=>Promise<Unit[]>,
    readListRecipe:()=>Promise<ListRecipe>,
    readListIngredients:()=>Promise<ListIngredient>
}

export var RecipeDatabase = (async function(new_recipe_listners?: Function[]){
    console.log("initialising database")
    var max_key = await findMaxKey();
    var unit_init = await checkUnitsInit();
    if (!unit_init){
        await initUnits(default_units);
    }

    async function findMaxKey():Promise<number>{
        return AsyncStorage.getItem("@maxkey:recipe").then((val:string|null)=>{
            let max_key = val === null ? 0 : parseInt(val)
            console.log("found max_key")
            return max_key
        })    
    }

    async function checkUnitsInit():Promise<boolean>{
        return AsyncStorage.getItem("@init:unit").then((val)=>{
            return !((val === null) || (val === "False"))
        })
    }

    async function writeUnit(unit:Unit){
        let string_unit = JSON.stringify(unit)
        return AsyncStorage.setItem(`@unit:${unit.symbol}`, string_unit)
    }

    async function initUnits(units: Unit[]){
        let unit_writes = []
        for (let i = 0; i < units.length; i++) {
            unit_writes.push(writeUnit(default_units[i]))
        }
        return Promise.all(unit_writes).then(()=>{
            AsyncStorage.setItem("@init:unit", "True")
        })
    }

    async function incrementMaxKey():Promise<number>{
        console.log("getting next id number")
        max_key += 1;
        await AsyncStorage.setItem("@maxkey:recipe", `${max_key}`)
        return max_key
    }

    function notifyNewRecipeListeners(){
        if (new_recipe_listners !== undefined){
            new_recipe_listners.map(f=>f())
        }
    }

    console.log("database initialised")
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
                        let obj = JSON.parse(key_val[1]);
                        return obj
                    }else{
                        return null
                    }
                })
                
                return recipe_objs.filter((obj) => obj !== null)
            })
        },

        addRecipe: async function(recipe:Partial<Recipe>): Promise<number>{
            let recipe_id = await incrementMaxKey()
            recipe._id = recipe_id;
            let recipe_json = JSON.stringify(recipe)
            await AsyncStorage.setItem(`@recipe:${recipe_id}`, recipe_json)
            notifyNewRecipeListeners()
            return recipe_id
        },

        removeRecipe: async function(recipe_id:number): Promise<void>{
            console.log("removing recipe")
            await AsyncStorage.removeItem(`@recipe:${recipe_id}`)
            console.log("recipe removed")
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
        },

        readRecipe: async function (recipe_id:number): Promise<Recipe>{
            return AsyncStorage.getItem(`@recipe:${recipe_id}`).then((recipe_json:string|null)=>{
                if(recipe_json === null){
                    throw new Error(`Cannot find recipe @recipe:${recipe_id}`)
                }
                let recipe:Recipe = JSON.parse(recipe_json)
                return recipe
            })
        },

        readUnit: async function(unit_symbol:string): Promise<Unit>{
            return AsyncStorage.getItem(`@unit:${unit_symbol}`).then((unit_json:string|null)=>{
                if (unit_json === null) {
                    throw new Error(`Cannot find unit ${unit_symbol}`);
                } else {
                    let unit: Unit = JSON.parse(unit_json);
                    return unit;
                }
            })
        },
        
        writeUnit: writeUnit,

        getAllUnits: async function(): Promise<Unit[]>{
            return AsyncStorage.getAllKeys().then((keys: string[] | undefined) => {
                if (keys === undefined) {
                    return []
                } else {
                    return keys.filter((k: string) => k.startsWith("@unit:"))
                }
            }).then((recipe_keys: string[]) => {
                return AsyncStorage.multiGet(recipe_keys)
            }).then((recipes: [string, string | null][]) => {

                let unit_objs: Unit[] = recipes.map((key_val: [string, string | null]) => {
                    if (key_val[1] !== null) {
                        let obj = JSON.parse(key_val[1]);
                        return obj
                    } else {
                        return null
                    }
                })

                return unit_objs.filter((obj) => obj !== null)
            })
        },

        readListRecipe: async function(): Promise<ListRecipe>{
            return AsyncStorage.getItem(`@list:*`).then(list_json=>{
                let list: ListRecipe
                if(list_json === null){
                    list = {recipes:[]}
                }else{
                    list = JSON.parse(list_json);
                }
                return list
            })
        },

        readListIngredients: async function(): Promise<ListIngredient>{
            return this.readListRecipe().then(list=>{
                 return combine_ingredients(list)
            })
        },

        writeList: async function(list: ListRecipe){
            let list_json = JSON.stringify(list)
            return AsyncStorage.setItem("@list:*", list_json)
        },

        addRecipeToList: async function(recipe_id: number){
            return Promise.all([
                this.readListRecipe(), 
                this.readRecipe(recipe_id)
            ]).then(([list, recipe])=>{
                list.recipes.push(recipe)
                return this.writeList(list)
            })
        },

        removeRecipeFromList: async function(recipe_id:number){
            return this.readListRecipe().then(list=>{
                let new_list = list.recipes.filter(r=>r._id !== recipe_id)
                list.recipes = new_list
                return this.writeList(list)
            })
        }
    }

})
