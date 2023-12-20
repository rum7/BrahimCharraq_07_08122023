const searchInput = document.querySelectorAll('.search-recipe')
searchInput.forEach((input) => {
    input.addEventListener('input', btnResetState)
    input.value = ""

})
const resetSearch = document.querySelectorAll('.reset-search')
resetSearch.forEach((btn) => {
    btn.addEventListener('click', resetInputSearch)
})

function btnResetState(event) {
    const input = event.currentTarget
    const btn = input.nextElementSibling
    
    if (input.value.length >= 3) {
        btn.classList.remove('hidden')
    } else {
        btn.classList.add('hidden')
    }
}

function resetInputSearch(event) {
    const btn = event.currentTarget
    const input = btn.previousElementSibling

    input.value = ""
    btn.classList.add('hidden')
}