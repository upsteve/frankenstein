import { buildBlock } from './lib-franklin.js';

function addBlock(/** @type {Element} */ main, /** @type {Element} */ section, isOdd) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(isOdd ? 'odd' : 'even')
    const eles = [...section.children].reduce((/** @type {any} */prev, cur, i) => {
        const col = i % 2
        if (col === 0) {
            prev.push([cur])
         } else {
            prev[prev.length-1].push(cur)
         }
        return prev
    }, [])
    wrapper.append(buildBlock('alt-img-text', eles));
    main.prepend(wrapper);
}

function isAlternatingImageText(/** @type {Element} */ main, /** @type {Element} */ section) {
    const count = section.children.length
    if (count === 0 || count % 2 !== 0) return false
    if (section.querySelectorAll(':scope > p').length === count) {
        const imgCountOdd = section.querySelectorAll(':scope > p:nth-child(odd) picture').length
        const imgCountEven = section.querySelectorAll(':scope > p:nth-child(even) picture').length
        if (imgCountOdd === count / 2 && imgCountEven === 0) addBlock(main, section, true)
        if (imgCountEven === count / 2 && imgCountOdd === 0) addBlock(main, section, false)
        return true
    }
}

export default function buildImageTextBlock(/** @type {Element} */main) {
    // console.log(main.innerHTML)
    main.querySelectorAll(':scope > div').forEach(section => isAlternatingImageText(main, section))
}
