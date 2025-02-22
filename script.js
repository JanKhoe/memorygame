//CONSTS
const gridContainer = document.getElementById('grid-container');
const containerWidth = parseFloat(window.getComputedStyle(gridContainer).width);
const maxCols = Math.floor((containerWidth - 190) / 170) + 1;
console.log(maxCols)
console.log()

const childNode = gridContainer.querySelector(':scope > *');
const childNodeWidth = parseFloat(window.getComputedStyle(childNode).width);
const childNodeHeight = parseFloat(window.getComputedStyle(childNode).height);
console.log(childNodeHeight, childNodeWidth)

const gap = parseFloat(window.getComputedStyle(gridContainer).gap);

const shapes = ['circle', 'triangle', 'square', 'star'];
const colors = ['red', 'blue', 'yellow', 'green'];
const givenPrompts = [];
let correctPrompts = 0;

const tracker = {
    'circle': 0,
    'triangle': 0,
    'square': 0,
    'star': 0,
    'red': 0,
    'blue': 0,
    'yellow': 0,
    'green': 0,
};

let checkRightAnswer = () => {
    return true;
}

window.onload = function() {

    document.getElementById('shuffleButton').addEventListener('click', shuffleGrid);


    const cardBacks = document.querySelectorAll('.card-back');

    cardBacks.forEach((cardBack) => {
        const shape = getRandomItem(shapes);
        const color = getRandomItem(colors);
        tracker[shape] += 1
        tracker[color] += 1
        const shapeElement = document.createElement('div');
        shapeElement.classList.add('shape', shape, color);

        if (shape === 'triangle') {
            shapeElement.style.borderBottomColor = color;
        }
        if (shape === 'star') {
            shapeElement.style.color = color;
        }

        cardBack.appendChild(shapeElement);
    });
    console.log(tracker);

};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function shuffleGrid(event) {
    event.target.removeEventListener('click', shuffleGrid);
    console.log(gridContainer)
    const gridItems = Array.from(gridContainer.children);

    const shuffledItems = shuffleArray(gridItems);

    shuffledItems.forEach((item, index) => {
        //console.log(item)
        const { row, col } = getGridPosition(index, Math.min(maxCols, gridItems.length));
        //console.log(row, col)
        item.style.transition = 'transform 0.5s ease-in-out';
        const translateX = (col - getGridColumn(item, 6)) * (childNodeWidth + gap);
        //console.log(translateX)
        const translateY = (row - getGridRow(item, 6)) * (childNodeHeight + gap);
        //console.log(translateY)
        item.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });

    new Promise(resolve => {
        setTimeout(() => {
            shuffledItems.forEach(item => gridContainer.appendChild(item));
            gridItems.forEach(item => item.style.transform = '');
            resolve();
        }, 1000);
    }).then(() => {
        const allCards = document.getElementsByClassName('card-container');
        requestAnimationFrame(() => {
            for (const card of allCards) {
                void card.offsetWidth;
                card.classList.toggle('active');
            }
        });
        new Promise(resolve => {
            setTimeout(() => {
                const allCards = document.getElementsByClassName('card-container');
                for (const card of allCards) {
                    void card.offsetWidth;
                    card.classList.toggle('active');
                }
                resolve()
                //FOR GRIFFIN: CHANGE THIS NUMBER TO GIVE PEOPLE MORE/LESS TIME TO VIEW THE SHAPES
            }, 3500)
        }).then( () => {
            new Promise((resolve) => {
                setTimeout(() => {
                    //adds curtains
                    const curtainContainer = document.createElement('div');
                    curtainContainer.classList.add('curtain-container');
                    const leftCurtain = document.createElement('div');
                    leftCurtain.classList.add('curtain', 'left-curtain');
                    leftCurtain.style.animationName = 'closeLeftCurtain'
                    const rightCurtain = document.createElement('div');
                    rightCurtain.classList.add('curtain', 'right-curtain');
                    rightCurtain.style.animationName = 'closeRightCurtain'
                    curtainContainer.appendChild(leftCurtain)
                    curtainContainer.appendChild(rightCurtain)
                    document.body.appendChild(curtainContainer)
                    const quizContainer = document.createElement('div')
                    quizContainer.classList.add('quiz-container')
                    const linesContainer = document.createElement('div');
                    linesContainer.classList.add('lines-container');
                    const leftLine = document.createElement('div');
                    leftLine.classList.add('line', 'left-line');
                    linesContainer.appendChild(leftLine);
                    const rightLine = document.createElement('div');
                    rightLine.classList.add('line', 'right-line');
                    linesContainer.appendChild(rightLine);
                    const signContainer = document.createElement('div');
                    signContainer.classList.add('sign-container');
                    const sign = document.createElement('div');
                    sign.classList.add('sign');
                    const signHeading = document.createElement('h1');
                    signHeading.textContent = 'POP QUIZ!';
                    sign.appendChild(signHeading);
                    signContainer.appendChild(sign);
                    const inputContainer = document.createElement('div');
                    inputContainer.classList.add('input-container');
                    const gameshowInput = document.createElement('input');
                    gameshowInput.type = 'text';
                    gameshowInput.placeholder = 'Type your answer here...';
                    gameshowInput.classList.add('gameshow-input');
                    gameshowInput.id = 'gameshow-input'
                    inputContainer.appendChild(gameshowInput);
                    quizContainer.appendChild(linesContainer);
                    quizContainer.appendChild(signContainer);
                    quizContainer.appendChild(inputContainer);
                    document.body.appendChild(quizContainer);
                    resolve()
                }, 300)
            }).then(() => {
                new Promise ((resolve) => {
                    setTimeout(() => {
                        generateRandomPrompt();
                        document.getElementById('gameshow-input').addEventListener('keypress', function(event) {
                            if (event.key === 'Enter') {
                                const inputValue = event.target.value;
                                console.log('Input value:', inputValue, checkRightAnswer(inputValue));
                                if(checkRightAnswer(inputValue)){
                                    generateRandomPrompt();
                                    this.value = ''
                                    if (++correctPrompts == 3){
                                        const sign = document.getElementsByClassName('sign')[0]
                                        sign.firstElementChild.textContent  = `YOU WIN!`
                                    }
                                }
                                else{
                                    window.location.reload();
                                }
                            }
                        });
                        resolve();
                    }, 3000)
                })
            })
        })
    });
}

function generateRandomPrompt() {
    const sign = document.getElementsByClassName('sign')[0]
    colorOrShape = Math.floor(Math.random() * 2)
    console.log(colorOrShape)
    randitem = colorOrShape ? getRandomItem(colors) : getRandomItem(shapes);
    while(givenPrompts.includes(randitem)){
        randitem == colorOrShape ? getRandomItem(colors) : getRandomItem(shapes);
    }
    sign.firstElementChild.textContent  = `HOW MANY ${randitem} CARDS WERE THERE?`
    checkRightAnswer = (guess) => {
        if(tracker[randitem] == guess){
            return true;
        }
        return false;
    }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Helper function to get grid position (row and column) from index
function getGridPosition(index, columns) {
    const row = Math.floor(index / columns);
    const col = index % columns;
    return { row, col };
}

// Helper function to get current grid row of an element
function getGridRow(element, numCols) {
    return Math.floor(Array.from(element.parentNode.children).indexOf(element) / numCols);
}

// Helper function to get current grid column of an element
function getGridColumn(element, numCols) {
    return Array.from(element.parentNode.children).indexOf(element) % numCols;
}