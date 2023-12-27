const tagnameList = document.querySelectorAll('.tagname-list')
tagnameList.forEach((tagname) => {
    tagname.addEventListener('click', toggleDropdown)
})

const tagnameFilter = document.querySelectorAll('.tagname-filter')
tagnameFilter.forEach((filter) => {
    filter.addEventListener('click', toggleFilter)
})

function toggleDropdown(event) {
    const btn = event.currentTarget
    // const dropName = btn.parentNode
    const dropList = btn.nextElementSibling
    const dropArrow = btn.children[1]

    //transition start
    btn.classList.toggle('rounded-xl')
    dropList.classList.toggle('z-20')
    dropList.classList.toggle('h-0')

    //transition end
    btn.classList.toggle('rounded-t-xl')
    btn.classList.toggle('z-30')
    dropList.classList.toggle('h-[200px]')
    dropArrow.classList.toggle('open')
}

function toggleFilter(event) {
    const filter = event.currentTarget
    filter.classList.toggle('selected')
}

export function displayFilterTag(ingredients, appareils, ustensils) {

    const category = [
        {"ingredients": ingredients},
        {"appareils": appareils},
        {"ustensils": ustensils}
    ]

    category.forEach(category => {
        const catName = Object.keys(category)[0]
        const catContent = Object.values(category).flat()
        const tagCategoryList = document.getElementById(`tags-${catName}-list`)

        const categoryList = [... new Set(catContent)]
        const categoryListSorted = categoryList.sort((a, b) => a.localeCompare(b))
        categoryListSorted.forEach(item => {
            item = item[0].toUpperCase()+item.slice(1)
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
            filterBtn.textContent = item
            tag.appendChild(filterBtn)
            tagCategoryList.appendChild(tag)
        })
    })
}