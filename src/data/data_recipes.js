export async function getRecipes() {
    const response = await fetch('./src/data/recipes.json')
    const data = await response.json()
    const recipes = data.recipes
    const ingredients = data.recipes.map(recipes => recipes.ingredients.map(name => name.ingredient.toLowerCase())).flat()
    const appareils = data.recipes.map(recipes => recipes.appliance.toLowerCase())
    const ustensils = data.recipes.map(recipes => recipes.ustensils.map(name => name.toLowerCase())).flat()
       
    return { recipes, ingredients, appareils, ustensils }
}