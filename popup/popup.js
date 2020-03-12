if (typeof browser !== 'undefined') {
    chrome = browser
}

// get elements
const btnClose = document.getElementsByName("btnClose")

const sectionTranslate = document.getElementById("sectionTranslate")
const sectionTranslating = document.getElementById("sectionTranslating")
const sectionRestore = document.getElementById("sectionRestore")
const sectionError = document.getElementById("sectionError")

const cbAlwaysTranslate = document.getElementsByName("cbAlwaysTranslate")
const lblAlwaysTranslate = document.getElementsByName("lblAlwaysTranslate")
const lblTranslate = document.getElementsByName("lblTranslate")
const lblTranslating = document.getElementsByName("lblTranslating")
const lblTranslated = document.getElementsByName("lblTranslated")
const lblError = document.getElementsByName("lblError")

const btnTranslate = document.getElementsByName("btnTranslate")
const btnOptions = document.getElementsByName("btnOptions")
const btnRestore = document.getElementsByName("btnRestore")
const btnTryAgain = document.getElementsByName("btnTryAgain")
// const btnOpenOnGoogleTranslate = document.getElementsByName("btnOpenOnGoogleTranslate")

function showSection(element)
{
    sectionTranslate.style.display = "none"
    sectionTranslating.style.display = "none"
    sectionRestore.style.display = "none"
    sectionError.style.display = "none"
    element.style.display = "block"
}
// chrome.tabs.query({ currentWindow: true, active: true}, tabs => {
//     btnOpenOnGoogleTranslate.setAttribute("href", "https://translate.google.com/translate?u=" + tabs[0].url)
// })

// translate
lblTranslate.forEach( value => value.textContent = chrome.i18n.getMessage("lblTranslate") )
lblTranslating.forEach( value => value.textContent = chrome.i18n.getMessage("lblTranslating") )
lblTranslated.forEach( value => value.textContent = chrome.i18n.getMessage("lblTranslated") )
lblError.forEach( value => value.textContent = chrome.i18n.getMessage("lblError") )
lblAlwaysTranslate.forEach( value => value.textContent = chrome.i18n.getMessage("lblAlwaysTranslate") )
btnTranslate.forEach( value => value.textContent = chrome.i18n.getMessage("btnTranslate") )
btnOptions.forEach( value => value.textContent = chrome.i18n.getMessage("btnOptions") )
btnRestore.forEach( value => value.textContent = chrome.i18n.getMessage("btnRestore") )
btnTryAgain.forEach( value => value.textContent = chrome.i18n.getMessage("btnTryAgain") )

// if (localStorage.getItem("alwaysTranslate") == "true") {
//     cbAlwaysTranslate.checked = true
// }

// close popup
btnClose.forEach(value => value.addEventListener("click", () => {
    window.close()
}))

// update status
chrome.tabs.query({ currentWindow: true, active: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getStatus"}, response => {
        if (response == "finish") {
            showSection(sectionRestore)
        } else if(response == "progress") {
            showSection(sectionTranslating)
        } else if (response == "error") {
            showSection(sectionError)
        } else {
            showSection(sectionTranslate)
        }
    })
})

function translate()
{
    // localStorage.setItem("alwaysTranslate", cbAlwaysTranslate.checked ? "true" : "false")
    // chrome.runtime.sendMessage({name: "alwaysTranslate", value: cbAlwaysTranslate.checked})

    chrome.tabs.query({ currentWindow: true, active: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "Translate"})
    })
    showSection(sectionTranslating)

    let updateStatus = () => {
        chrome.tabs.query({ currentWindow: true, active: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "getStatus"}, response => {
                if (response == "prompt") {
                    showSection(sectionTranslate)
                } else if (response == "finish") {
                    showSection(sectionRestore) 
                } else if (response == "error") {
                    showSection(sectionError)
                } else {
                    setTimeout(updateStatus, 500)
                }
            })
        })
    }
    setTimeout(updateStatus, 500)
}

// translate web page
btnTranslate.forEach( value => value.addEventListener("click", () => {
    translate()
}))

// show original text
btnRestore.forEach( value => value.addEventListener("click", () => {
    // localStorage.setItem("alwaysTranslate", cbAlwaysTranslate.checked ? "true" : "false")
    // chrome.runtime.sendMessage({name: "alwaysTranslate", value: cbAlwaysTranslate.checked})
    
    chrome.tabs.query({ currentWindow: true, active: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "Restore"})
    })
    showSection(sectionTranslate)
}))

btnTryAgain.forEach( value => value.addEventListener("click", () => {
    translate()
}))

// cbAlwaysTranslate.addEventListener("change", () => {
//     if (!cbAlwaysTranslate.checked) {
//         localStorage.setItem("alwaysTranslate", "false")
//         chrome.runtime.sendMessage({name: "alwaysTranslate", value: false})
//     }
// })
