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

const startLoadingAnimation = (buttonElement, loaderElement, buttonTextElement) => {
    // buttonElement, loaderElement, and buttonTextElement are all DOM elements.

    // start loading animation if loaderElement is hidden
    if (loaderElement.classList.contains("hidden")) {
        buttonElement.style.cursor = 'default'
        buttonElement.disabled = true
        loaderElement.classList.remove("hidden");
        buttonTextElement.classList.add("hidden");
    }
}

const endLoadingAnimation = (buttonElement, loaderElement, buttonTextElement) => {
    // buttonElement, loaderElement, and buttonTextElement are all DOM elements.

    // Hide the loading animation if loading animation is present
    if (!loaderElement.classList.contains("hidden")) {
        buttonElement.style.cursor = 'pointer'
        buttonElement.disabled = false
        loaderElement.classList.add("hidden");
        buttonTextElement.classList.remove("hidden");
    }
}

export {startLoadingAnimation, endLoadingAnimation, errorPopup, successPopup}