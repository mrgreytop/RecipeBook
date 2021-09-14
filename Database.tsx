import AsyncStorage from "@react-native-async-storage/async-storage";
import {Recipe, RecipeIngredient, Unit, SiMeasure, ListIngredient} from "./types";
// TODO add shopping lists to database


function convert_unit(amount:number, unit:Unit, new_unit:Unit):number|null{
    console.log("converting", unit, "to",  new_unit)
    if (unit.measure != new_unit.measure){
        return null
    }
    if (unit.measure == SiMeasure.None){
        return amount
    }
    if ((unit.factor !== undefined) && (new_unit.factor !== undefined)){
        return amount * new_unit.factor / unit.factor
    }else{
        throw new Error("unexpected null factors")
    }
}

function combine_ingredients(list: Recipe[]):ListIngredient{
    let ingredients = new Map <string, {unit:Unit, amount:number}[]>()
    for (let i = 0; i < list.length; i++) {
        // for each recipe
        const ings = list[i].ingredients
        for (let j = 0; j < ings.length; j++) {
            // for each ingredient
            const ing = ings[j]
            let amounts = ingredients.get(ing.name)
            // if ingredient already in @ingredients
            if (amounts !== undefined){
                // find the amount that has the same units
                let unit_amount = amounts.find(a=>a.unit == ing.unit)
                if (unit_amount !== undefined){
                    // if same unit exists sum amounts
                    unit_amount.amount += ing.amount
                }else{
                    // else try to convert units
                    unit_amount = amounts[0]
                    let converted_amount = convert_unit(ing.amount, ing.unit, unit_amount.unit)
                    if (converted_amount !== null){
                        // if can convert add converted amount
                        unit_amount.amount += converted_amount
                    }else{
                        // else add annother unit to array for this ingredient
                        amounts.push({unit:ing.unit, amount:ing.amount})
                    }
                }
            }else{
                // else create a new entry for @ingredients
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
    {symbol: "kg", measure:SiMeasure.Weight, factor: 1/1000},
    {symbol: "oz", measure:SiMeasure.Weight, factor: 0.035274},
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
    readListRecipe:()=>Promise<Recipe[]>,
    readListIngredients:()=>Promise<ListIngredient>,
    addRecipeToList:(recipe_id:number)=>Promise<void>,
    removeRecipeFromList:(recipe_id:number)=>Promise<void>,
    resetDatabase:()=>Promise<void>
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
        await Promise.all(unit_writes)
        await AsyncStorage.setItem("@init:unit", "True")
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
            await AsyncStorage.removeItem(`@recipe:${recipe_id}`)
            await this.removeRecipeFromList(recipe_id)
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

        readListRecipe: async function(): Promise<Recipe[]>{
            let list_json = await AsyncStorage.getItem(`@list:*`)
                
            if(list_json === null){
                return [];
            }else{
                let recipe_ids:number[] = JSON.parse(list_json);
                let recipe_promises = recipe_ids.map(id=>{
                    return this.readRecipe(id).catch(e=>e)
                }).filter(e => !(e instanceof Error));
                return Promise.all<Recipe>(recipe_promises)
            }
        },

        readListIngredients: async function(): Promise<ListIngredient>{
            return this.readListRecipe().then(list=>{
                 return combine_ingredients(list)
            })
        },

        writeList: async function(list: number[]){
            let list_json = JSON.stringify(list)
            return AsyncStorage.setItem("@list:*", list_json)
        },

        addRecipeToList: async function(recipe_id: number){
            return AsyncStorage.getItem(`@list:*`).then(list_json=>{
                let list: number[];
                if (list_json !== null){
                    list = JSON.parse(list_json)
                    list.push(recipe_id)
                }else{
                    list = [recipe_id]
                }

                return AsyncStorage.setItem("@list:*", JSON.stringify(list))
            })
        },

        removeRecipeFromList: async function(recipe_id:number){
            return AsyncStorage.getItem(`@list:*`).then(list_json => {
                if (list_json !== null) {
                    let list: number[] = JSON.parse(list_json)
                    let new_list = list.filter(el=>el !== recipe_id)
                    return this.writeList(new_list);
                }
            })
        },

        resetDatabase: async function(){
            return AsyncStorage.getAllKeys().then(keys=>{
                return AsyncStorage.multiRemove(keys)
            }).then(()=>{
                return initUnits(default_units)
            })
        }
    }

})

export const exportedForTesting = {
    convert_unit,
    combine_ingredients
}
