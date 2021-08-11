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

export {startLoadingAnimation, endLoadingAnimation}