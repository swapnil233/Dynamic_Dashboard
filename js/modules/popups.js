const errorPopup = (error) => {
    const errorPopup = document.createElement("div")
    errorPopup.classList.add("error-popup")
    errorPopup.innerHTML = error
    document.body.appendChild(errorPopup)
    setTimeout(() => {
        document.body.removeChild(errorPopup)
    }, 2000)
}

const successPopup = (success) => {
    const successPopup = document.createElement("div")
    successPopup.classList.add("success-popup")
    successPopup.innerHTML = success
    document.body.appendChild(successPopup)
    setTimeout(() => {
        document.body.removeChild(successPopup)
    }, 2000)
}

// Export errorPopup and successPopup
export { errorPopup, successPopup }