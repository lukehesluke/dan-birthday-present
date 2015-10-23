import 'babel/polyfill'
import {cond, test, T} from 'ramda'
import {List} from 'immutable'

// Tags of elements whose text not to replace
const TAG_BLACKLIST = (new Set()).add('script').add('noscript').add('style');

const danifyNode = textNode => {
    const replacedContents = document.createDocumentFragment()
    const danifyWord = word => {
        const element = document.createElement('span')
        element.style.fontWeight = 'bold'
        element.textContent = `DAN${word.slice(3)}`
        return element
    }
    const words = new List(textNode.textContent.split(/\s+/g))
        .interpose(' ')
        .map(cond([
            [test(/^.[aA][nN]/), danifyWord],
            [T, word => document.createTextNode(word)]
        ]))
    words.forEach(word => {
        replacedContents.appendChild(word)
    })
    textNode.parentNode.replaceChild(replacedContents, textNode)
}

const walk = rootNode => {
    // Make changes to offline copy of root node so as not to incur wrath of constant DOM reflow
    const copiedRootNode = rootNode.cloneNode(true)
    const walker = document.createTreeWalker(copiedRootNode, NodeFilter.SHOW_TEXT, null, false)
    const nodes = []
    while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim().length === 0) continue
        // Make sure we don't touch script / style / etc tags
        if (TAG_BLACKLIST.has(walker.currentNode.parentNode.tagName.toLowerCase())) continue
        nodes.push(walker.currentNode)
    }
    nodes.forEach(danifyNode)
    rootNode.parentNode.replaceChild(copiedRootNode, rootNode)
}

walk(document.body)
