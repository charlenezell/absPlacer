'use strict';
let hasMark = false;
let allAbsElement;
let movedElements = {};
function exportAll() {
    console.log(
        JSON.stringify(Object.keys(movedElements).map(v => {
            return {
                id: v,
                top: movedElements[v].style.top,
                left: movedElements[v].style.left,
                class: movedElements[v].getAttribute("class")
            }
        }))
    );
}
function handleMarkAll() {
    if (hasMark) { return false; }
    hasMark = true;
    let n = Array.from(document.querySelectorAll('*'))
        .filter(v => {
            return getComputedStyle(v).position === 'absolute';
        })

    n.forEach(v => {
        v.style.outline = '1px solid green';
        let o = v.getAttribute('class');
        v.setAttribute('class', `${o} absPlacer__item`);
        v.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    allAbsElement = n;
    bindInteractItem(n);
}
let gid = 1;
function bindInteractItem() {
    interact('.absPlacer__item')
        .draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: 'parent',
                // endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            // enable autoScroll
            autoScroll: true,

            // call this function on every dragmove event
            // onstart: () => {
            //     startMove = true;
            // },
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: function (event) {
                startMove = false;
                let target = event.target;
                let id = target.getAttribute('data-absid');
                if (!id) {
                    target.setAttribute('data-absid', gid++);
                    id = target.getAttribute('data-absid');
                }
                movedElements[id] = target;
                // let target = event.target;
                // getComputedStyle(target).left = `${(parseFloat(target.getAttribute('data-x')) || 0)}px`;
                // getComputedStyle(target).top = `${(parseFloat(target.getAttribute('data-y')) || 0)}px`;
            }
        });
}

var startMove = false;
function dragMoveListener(event) {
    var target = event.target;
    if (!startMove) {
        target.setAttribute('data-x', parseFloat(getComputedStyle(target).left) || 0);
        target.setAttribute('data-y', parseFloat(getComputedStyle(target).top) || 0);
        startMove = true;
    }
    event.preventDefault();
    event.stopPropagation();

    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.left = x + 'px';
    target.style.top = y + 'px';


    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function main() {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            switch (request.action) {
                case 'markAll':
                    handleMarkAll();
                    sendResponse({ code: 0 });
                    break;
                case 'exportAll':
                    exportAll();
                    sendResponse({ code: 0 });
                default:
                    break;
            }
        });
}
main();