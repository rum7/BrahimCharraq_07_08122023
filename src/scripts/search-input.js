const searchInput = document.querySelectorAll('.search-recipe')
searchInput.forEach((input) => {
    input.addEventListener('keyup', btnResetState)
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') { resetInputSearch(input.nextElementSibling) }
    })
    input.value = ""
})
const resetSearch = document.querySelectorAll('.reset-search')
resetSearch.forEach((btn) => {
    btn.addEventListener('click', () => { 
        resetInputSearch(btn)
        btn.previousElementSibling.focus()
    })
})

function btnResetState(event) {
    const input = event.currentTarget
    const btn = input.nextElementSibling
    let errorMsg
    if (input.id === "search-recipe") {
        errorMsg = !document.getElementById('search-error').classList.contains('invisible')
    } else {
        errorMsg = !document.querySelector('.no-tag-message').classList.contains('hidden')
    }

    if (input.value.trim().length >= 3 || errorMsg) {
        btn.classList.remove('hidden')
    } else {
        btn.classList.add('hidden')
    }
}

function resetInputSearch(event) {
    const btn = event
    const input = btn.previousElementSibling

    input.value = ""
    input.dispatchEvent(new Event('input'))
    btn.classList.add('hidden')
}