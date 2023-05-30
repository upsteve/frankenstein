export default async function decorate(/** @type {HTMLElement} */ block) {
    const divs = block.querySelectorAll(':scope > div > div')
    divs[0] && divs[0].classList.add('the-left')
    divs[1] && divs[1].classList.add('the-right')
    const hr = document.createElement('hr');
    block.appendChild(hr)
}
