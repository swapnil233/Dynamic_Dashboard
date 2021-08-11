const errorPopup = (error) => {
    const errorIcon = 
    `
    <span class="material-icons error-icon">
        error
    </span>
    `

    const errorMessage = 
    `
    <div class="error-message">
        <p>${error}</p>
    </div>
    `
    // Create a div element, and add the class "error-popup" to it.
    const errorPopup = document.createElement("div")
    errorPopup.classList.add("error-popup")

    // Add the error icon and error message to the div element.
    errorPopup.innerHTML += errorIcon
    errorPopup.innerHTML += errorMessage

    // Append the div element to the body element.
    document.body.appendChild(errorPopup)   

    // Shake the error popup
    shakeErrorPopup(errorPopup)

    // Set the timeout to hide the error popup.
    setTimeout(() => {
        // Remove the error popup from the body element.
        document.body.removeChild(errorPopup)
    }, 2000);

}

const successPopup = (success) => {
    const successIcon = 
    `
    <span class="material-icons success-icon">
        check_circle
    </span>
    `

    const successMessage = 
    `
    <div class="error-message">
        <p>${success}</p>
    </div>
    `
    // Create a div element, and add the class "error-popup" to it.
    const successPopup = document.createElement("div")
    successPopup.classList.add("success-popup")

    // Add the error icon and error message to the div element.
    successPopup.innerHTML += successIcon
    successPopup.innerHTML += successMessage

    // Append the div element to the body element.
    document.body.appendChild(successPopup)   

    // Set the timeout to hide the error popup.
    setTimeout(() => {
        // Remove the error popup from the body element.
        document.body.removeChild(successPopup)
    }, 2000);
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

// Animate the error popup to shake
const shakeErrorPopup = (errorPopupElement) => {
    // errorPopupElement is a DOM element.
    const errorPopup = errorPopupElement.querySelector(".error-popup")
    const errorIcon = errorPopupElement.querySelector(".error-icon")
    const errorMessage = errorPopupElement.querySelector(".error-message")

    const errorIconAnimation = errorIcon.animate([
        { transform: 'translate3d(0, 0, 0)' },
        { transform: 'translate3d(-3px, 0, 0)' },
        { transform: 'translate3d(3px, 0, 0)' },
        { transform: 'translate3d(0, 0, 0)' }
    ], {
        duration: 1000,
        iterations: Infinity,
        easing: 'ease-in-out'
    })
    errorIconAnimation.addEventListener('end', () => {
        errorIconAnimation.play()
    })
}

export {startLoadingAnimation, endLoadingAnimation, errorPopup, successPopup}