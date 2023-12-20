import { toggleFilter } from "../scripts/filters-dropdown.js"

export  async function getRecipes() {
    const response = await fetch('./src/data/recipes.json')
    const data = await response.json()
    const recipes = data.recipes
    const name = data.recipes.map(recipes => recipes.name)
    const description = data.recipes.map(recipes => recipes.description)
    const ingredients = data.recipes.map(recipes => recipes.ingredients.map(name => name.ingredient.toLowerCase())).flat()
       
    return { recipes, name, description, ingredients }
}

export async function getData() {
    const { recipes, name, description, ingredients } = await getRecipes()

    displayIngredientsTag(ingredients)
}

function displayIngredientsTag(ingredients) {
    const tagsIngredientsList = document.getElementById('tags-ingredients-list')

    const ingredientsList = [... new Set(ingredients)]
    const ingredientsListSorted = ingredientsList.sort()
    ingredientsListSorted.forEach((ingredient, index) => {
        // console.log(`ing-${index}: `, ingredient)
        // console.log(`ing-${index}: `, ingredient[0].toUpperCase()+ingredient.slice(1))
        ingredient = ingredient[0].toUpperCase()+ingredient.slice(1)
        const tag = document.createElement('li')
        const filterBtn = document.createElement('button')
        filterBtn.classList.add(
            'tagname-filter', 
            'w-full',
            'text-left',
            'px-4',
            'py-2',
            'text-ellipsis',
            'whitespace-nowrap',
            'overflow-hidden',
            'hover:bg-lpp-yellow', 
            '[&.selected]:pr-10',
            '[&.selected]:font-bold',
            `[&.selected]:bg-[url('../img/btn-delete-tag-1.svg')]`,
            '[&.selected]:bg-no-repeat',
            '[&.selected]:bg-right-15-center',
            '[&.selected]:bg-lpp-yellow'
        )
        filterBtn.addEventListener('click', toggleFilter)
        filterBtn.textContent = ingredient
        tag.appendChild(filterBtn)
        tagsIngredientsList.appendChild(tag)
    })
}