"use strict"

const lives = 10;
const playButton = document.querySelector("#play");
const wordPlace = document.querySelector("#word");
const checkButton = document.querySelector("#checkButton");
const letterInput = document.querySelector("#letterInput");
const gameArea = document.querySelector("#gameArea");
const livesPlace = document.querySelector("#lives");

let chosenWord;
let chosenWordArray;
let hiddenWordArray;
let hiddenWordDisplay = '';
let remainingLives;
let guessedLetters = [];

let wordsToChoose = ["woda", "kot", "babcia", "gitara"];
wordsToChoose = wordsToChoose.map(word => word.toUpperCase()); 

// Hangman
const myHangman = document.getElementById("hangman");
const context = myHangman.getContext('2d');
context.beginPath();
context.strokeStyle = "#000";
context.lineWidth = 2;

function startHangman(){
    playButton.classList.add("d-none");
    gameArea.classList.remove("d-none");
    remainingLives = lives;
    setChosenWord();
    removeWordFromArray(chosenWord, wordsToChoose);
    setHiddenWordDisplay();
    writeInDocument(hiddenWordDisplay, wordPlace);
    writeInDocument(remainingLives, livesPlace);
    enableCheckButton();
    resetHangman();
}

function removeWordFromArray(word, wordsArray){
    let i = wordsArray.indexOf(word);
    wordsArray.splice(i, 1);
}

function setChosenWord(){
    chosenWord = wordsToChoose[Math.floor(Math.random() * wordsToChoose.length)];
    chosenWordArray = Array.from(chosenWord);
    hiddenWordArray = Array.from(chosenWord).map(letter => {return "_"}); 
}

function setHiddenWordDisplay(){
    hiddenWordDisplay = "";
    hiddenWordArray.forEach(letter => {
        hiddenWordDisplay = hiddenWordDisplay + " " + letter;
    });
}

function writeInDocument(text, node){
    node.innerHTML = text;
}

function checkLetter(){
    if (checkIfLivesRemain() === false){
        return;
    }

    let value = letterInput.value.toUpperCase();
    checkIfGuessed(value);
    setHiddenWordDisplay();
    writeInDocument(hiddenWordDisplay, wordPlace);
    letterInput.value = null;
    checkforWinningsOrLooses();
}

function checkforWinningsOrLooses(){
    let wordIsGuessed = !hiddenWordArray.some(letter => letter === "_");
    let noLivesLeft = remainingLives === 0;

    if(wordIsGuessed){
        writeInDocument("Wygrałeś", gameStatus);
    }

    if (noLivesLeft){
        writeInDocument("Przegrałeś. Spróbuj jeszcze raz", gameStatus);
    }

    if (wordIsGuessed || noLivesLeft){
        playButton.classList.remove("d-none");
    } 
}

function checkIfGuessed(v){
    let guessed = chosenWordArray.some(letter => letter === v);
    
    if(guessed){
        chosenWordArray.forEach((letter, index) => {
            if(letter === v) {
                hiddenWordArray[index] = v;
                writeInDocument("Brawo! Zgadłeś", gameStatus);
            }
        })

    } else {
        remainingLives--;
        writeInDocument("Nie zgadłeś", gameStatus);
        writeInDocument(remainingLives, livesPlace);
        if (remainingLives === 0){
            disableCheckButton();
        }
        animateHangman();
    } 
}

function checkIfLivesRemain(){
    if(remainingLives === 0){
        return false;
    }
    return true;
}

function disableCheckButton(){
    checkButton.disabled = true;
}

function enableCheckButton(){
    checkButton.disabled = false;
}

//Hangman functions

function animateHangman() {
    let drawMe = remainingLives;
    drawArray[drawMe]();
}

function resetHangman() {
    context.clearRect(0, 0, myHangman.width, myHangman.height);
    context.beginPath();
}

function draw($pathFromx, $pathFromy, $pathTox, $pathToy) {
    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke();
}

const head = function () {
    context.beginPath();
    context.arc(60, 25, 10, 0, Math.PI * 2, true);
    context.stroke();
}

const frame1 = function () {
    draw(0, 150, 150, 150);
};

const frame2 = function () {
    draw(10, 0, 10, 600);
};

const frame3 = function () {
    draw(0, 5, 70, 5);
};

const frame4 = function () {
    draw(60, 5, 60, 15);
};

const torso = function () {
    draw(60, 36, 60, 70);
};

const rightArm = function () {
    draw(60, 46, 100, 50);
};

const leftArm = function () {
    draw(60, 46, 20, 50);
};

const rightLeg = function () {
    draw(60, 70, 100, 100);
};

const leftLeg = function () {
    draw(60, 70, 20, 100);
};

const drawArray = [rightLeg, leftLeg, rightArm, leftArm, torso, head, frame4, frame3, frame2, frame1];

playButton.addEventListener("click", () => {
    startHangman();
});

checkButton.addEventListener("click", () => {
    checkLetter();
});
