export function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container')

    recipes.forEach((recipe, index) => {
        recipe.name = recipe.name[0].toUpperCase()+recipe.name.slice(1).toLowerCase()
        recipesContainer.insertAdjacentHTML("beforeend", `
            <div class="recipe-card relative rounded-2xl bg-white overflow-clip shadow-2xl" data-recipe-id="${recipe.id}">
                <img class="recipe-card__thumbnail w-full h-64 object-cover" src="./src/img/${recipe.image}" alt="${recipe.name}">
                <div class="recipe-card__content px-6 py-8 flex flex-col gap-y-8">
                    <h2 class="recipe-card__name font-Anton text-lg text-lpp-black leading-[1]">${recipe.name}</h2>
                    <div class="flex flex-col gap-y-3.5">
                        <h3 class="recipe-card__category font-Manrope font-bold text-[.75rem] uppercase text-lpp-grey tracking-wider leading-[1]">Recette</h3>
                        <p class="recipe-card__desc font-Manrope text-sm text-lpp-black text-ellipsis overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;">${recipe.description}</p>
                    </div>
                    <div class="flex flex-col gap-y-3.5">
                        <h3 class="recipe-card__category font-Manrope font-bold text-[.75rem] uppercase text-lpp-grey tracking-wider leading-[1]">Ingrédients</h3>
                        <ul class="recipe-card__ingredients grid grid-cols-2 gap-x-1.5 gap-y-5">
                            ${recipe.ingredients.map(item => {
                                item.ingredient = item.ingredient[0].toUpperCase()+item.ingredient.slice(1).toLowerCase()
                                return `
                                    <li class="recipe-card__ingredient">
                                        <p class="recipe-card__name font-Manrope font-medium text-sm  text-lpp-black">${item.ingredient}</p>
                                        <p class="recipe-card__quantity font-Manrope text-sm text-lpp-grey">${item.quantity??'-'} ${item.unit??''}</p>
                                    </li>`                        
                            }).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `)
    })
}