
export type Tag = {
    _id:number,
    name:string
}

export enum SiMeasure{
    Weight = "g",
    Volume = "ml",
    None = "",
}

export type Unit = {
    symbol:string,
    measure:SiMeasure,
    factor?:number
}

export type RecipeIngredient = {
    name: string,
    amount: number,
    unit: Unit
}

export type LazyRecipeIngredient = {
    name: string,
    amount: number,
    unit: string
}

export type Recipe = {
    _id:number,
    name:string,
    servings:number,
    tags:Tag[],
    ingredients:RecipeIngredient[]
}

export type ListIngredient = {
    ingredients: Map<string, { unit: Unit, amount: number }[]>
}

export type ListRecipe = {
    recipes:Recipe[]
}