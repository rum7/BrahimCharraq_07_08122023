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
    const dropName = btn.parentNode
    const dropList = btn.nextElementSibling
    const dropArrow = btn.children[1]

    btn.classList.toggle('rounded-xl')
    btn.classList.toggle('rounded-t-xl')
    // dropName.classList.toggle('max-h-14')
    // dropName.classList.toggle('max-h-80')
    // dropList.classList.toggle('hidden')
    // dropList.classList.toggle('opacity-0')
    // dropList.classList.toggle('-translate-y-4')
    // dropList.classList.toggle('translate-y-0')

    if (dropList.classList.contains('hidden')) {
        dropList.classList.remove('hidden')

        setTimeout(function() {
            btn.classList.toggle('z-30')
            dropList.classList.toggle('z-20')
            dropList.classList.toggle('opacity-0')
            dropList.classList.toggle('-translate-y-4')
            dropList.classList.toggle('translate-y-0')
        }, 50); // Petit délai avant de lancer la transition 
    } else {
        dropList.classList.toggle('opacity-0')
        dropList.classList.toggle('-translate-y-4')
        dropList.classList.toggle('translate-y-0')
        setTimeout(function() {
            dropList.classList.add('hidden')
            dropList.classList.toggle('z-20')
            btn.classList.toggle('z-30')
        }, 500); // Temps correspondant à la durée de la transition
    }

    dropArrow.classList.toggle('open')
}

export function toggleFilter(event) {
    const filter = event.currentTarget
    console.log('filter: ', filter)
    filter.classList.toggle('selected')
}