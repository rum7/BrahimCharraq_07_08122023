const tagnameList = document.querySelectorAll('.tagname-list')
tagnameList.forEach((tagname) => {
    tagname.addEventListener('click', toggleDropdown)
})

const tagnameFilter = document.querySelectorAll('.tagname-filter')
tagnameFilter.forEach((filter) => {
    filter.addEventListener('click', toggleFilter)
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

    btn.getAttribute('data-state') === "close" ? btn.setAttribute('data-state', 'open') : btn.setAttribute('data-state', 'close')

    // if (btn.getAttribute('data-state') === "open") {
    //     dropList.addEventListener('transitionend', () => {
    //         dropList.classList.toggle('z-30')
    //         dropList.classList.toggle('z-10')
    //         btn.classList.toggle('z-40')
    //         btn.classList.toggle('z-20')
    //     })
    // }
}

document.addEventListener('click', (event) => {
    if (!event.target.matches('.tagname-list') && !event.target.matches('.tagname-filter')) {
        tagnameList.forEach(btn => {
            if (btn.getAttribute('data-state') !== "close") {
                animeDropdown(btn)
            }
        })
    }
})

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

        const categoryListSorted = categoryContent.sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]))
        categoryListSorted.forEach(item => {
            let content
            let id
            for (const [key, value] of Object.entries(item)) {
                content = key[0].toUpperCase()+key.slice(1)
                id = value
            }
            const tag = document.createElement('li')
            tag.dataset.recipeNum = id
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
            filterBtn.textContent = content
            tag.appendChild(filterBtn)
            tagCategoryList.appendChild(tag)
        })
    })
}

function toggleFilter(event) {
    const filter = event.currentTarget
    filter.classList.toggle('selected')
}