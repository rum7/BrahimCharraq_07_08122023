/**
 * DROPDOWN
 */

const tagnameList = document.querySelectorAll('.tagname-list')
tagnameList.forEach((tagname) => {
    tagname.addEventListener('click', toggleDropdown)
})

function toggleDropdown(event) {
    const currentbtn = event.currentTarget
    
    tagnameList.forEach(btn => {
        if (btn.getAttribute('data-state') !== "close" && btn !== currentbtn) {
            animeDropdown(btn)
        }
    })

    animeDropdown(currentbtn)
}

function animeDropdown(btn) {
    const dropList = btn.nextElementSibling
    const dropArrow = btn.children[1]

    //transition start
    btn.classList.toggle('rounded-xl')
    btn.classList.toggle('z-20')
    dropList.classList.toggle('z-10')
    dropList.classList.toggle('top-[41px]')

    //transition end
    btn.classList.toggle('rounded-t-xl')
    btn.classList.toggle('z-40')
    dropList.classList.toggle('z-30')
    dropList.classList.toggle('h-[200px]')
    dropList.classList.toggle('top-[56px]')
    dropArrow.classList.toggle('open')

    btn.getAttribute('data-state') === "close" ? btn.setAttribute('data-state', 'open')
    : btn.setAttribute('data-state', 'close')
}

// Close dropdown
document.addEventListener('click', (event) => {
    if (!event.target.matches('.tagname-list') && !event.target.matches('.tagname-filter')) {
        tagnameList.forEach(btn => {
            if (btn.getAttribute('data-state') !== "close") {
                animeDropdown(btn)
            }
        })
    }
})



/**
 * FILTERS
 */

const tagnameFilter = document.querySelectorAll('.tagname-filter')
tagnameFilter.forEach((filter) => filter.addEventListener('click', toggleFilter))

const tagListContainer = document.querySelector('.tags__list')

function toggleFilter(event) {
    const filter = event.target
    filter.classList.toggle('selected')
}

let tagsToRemove = []
export function displaySelectedTag(tagName) {
    const tag = document.createElement('li')
    const filterBtn = document.createElement('button')
    filterBtn.classList.add(
        'tag-on',
        'inline-flex',
        'justify-between',
        'items-center',
        'p-4',
        'pr-[90px]',
        'rounded-xl',
        'shadow-sm',
        'bg-lpp-yellow',
        `bg-[url('../img/btn-delete-tag-2.svg')]`,
        'bg-right-20-center',
        'bg-no-repeat',
        'hover:bg-white',
        'transition',
        'ease-in-out',
        'duration-200'
    )

    filterBtn.addEventListener('click', () => toggleFilter(tagName))
    filterBtn.textContent = tagName.currentTarget.textContent
    tag.appendChild(filterBtn)
    tagListContainer.appendChild(tag)

    tagsToRemove = [...tagsToRemove, tagName.currentTarget.textContent]

    return filterBtn
}

export function removeSelectedTag(filterToRemove) {
    const indexTagToRemove = tagsToRemove.indexOf(filterToRemove)
    tagsToRemove.splice(indexTagToRemove, 1)
    tagListContainer.removeChild(tagListContainer.childNodes[indexTagToRemove])
}


export function displayFilterTag(ingredients, appareils, ustensils) {
    const category = [
        {"ingredients": ingredients},
        {"appareils": appareils},
        {"ustensils": ustensils}
    ]

    category.forEach(category => {
        const categoryName = Object.keys(category)[0]
        const categoryContent = category[categoryName]
        const tagCategoryList = document.getElementById(`tags-${categoryName}-list`)

        const categoryListSorted = new Set(categoryContent.sort((a, b) => a.localeCompare(b)))
        categoryListSorted.forEach(item => {
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
            filterBtn.textContent = item[0].toUpperCase()+item.slice(1)
            tag.appendChild(filterBtn)
            tagCategoryList.appendChild(tag)
        })
    })
}

// export function displayFilterTag(ingredients, appareils, ustensils) {
//     const category = [
//         {"ingredients": ingredients},
//         {"appareils": appareils},
//         {"ustensils": ustensils}
//     ]

//     category.forEach(category => {
//         const categoryName = Object.keys(category)[0]
//         const categoryContent = category[categoryName]
//         const tagCategoryList = document.getElementById(`tags-${categoryName}-list`)

//         const categoryListSorted = categoryContent.sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]))
//         categoryListSorted.forEach(item => {
//             let content
//             let id
//             for (const [key, value] of Object.entries(item)) {
//                 content = key[0].toUpperCase()+key.slice(1)
//                 id = value
//             }
//             const tag = document.createElement('li')
//             tag.dataset.recipeNum = id
//             tag.dataset.recipeIngredient = content
//             const filterBtn = document.createElement('button')
//             filterBtn.classList.add(
//                 'tagname-filter', 
//                 'w-full',
//                 'text-left',
//                 'px-4',
//                 'py-2',
//                 'text-ellipsis',
//                 'whitespace-nowrap',
//                 'overflow-hidden',
//                 'hover:bg-lpp-yellow', 
//                 '[&.selected]:pr-10',
//                 '[&.selected]:font-bold',
//                 `[&.selected]:bg-[url('../img/btn-delete-tag-1.svg')]`,
//                 '[&.selected]:bg-no-repeat',
//                 '[&.selected]:bg-right-15-center',
//                 '[&.selected]:bg-lpp-yellow'
//             )
//             filterBtn.addEventListener('click', toggleFilter)
//             filterBtn.textContent = content
//             tag.appendChild(filterBtn)
//             tagCategoryList.appendChild(tag)
//         })
//     })
// }