//Declaring the game state as 0 once instead of declaring it as the default state everytime its reset
//Global variables i can change later for convienience 
let gameState = 0;
let successfulGuessCounter = 0;
let nextGuessOrder = [];
let useClick = true;

// Shuffle function from http://stackoverflow.com/a/2450976
let shuffle = function(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//Takes all the possible <i>'s and makes a list of them that doesnt repeat any and shuffles them
function shuffleTargetCards() {
  let cardSymbols = [];
  for(let i = 0; i < gameState.cards.length; i++) {
    cardSymbols[i] = gameState.cards[i].image;
  }
  
  return shuffle(cardSymbols);
}

//Reset function that'll set the page back to its default
function reset() {
  //reseting the gamestates values instead of re-declaring it
  gameState = {
    nextCard: [],
    score: 0,
    cards: [
      {
        image: "fas fa-atom",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-frog",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-feather-alt",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-cogs",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-anchor",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-fan",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-bolt",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-hat-wizard",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-apple-alt",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-bell",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-bomb",
        clicked: false,
        guessedCorrect: false,
      },
      {
        image: "fas fa-brain",
        clicked: false,
        guessedCorrect: false,
      },
    ],
  }

  //have to declare it after or itll create issues with the game state
  const imageList = [...shuffleTargetCards()];
  //looping through all possible symbols 
  for (let i = 0; i < gameState.cards.length; i++) {
    gameState.cards[i].image = imageList[i];
  }
  //shuffling the list
  gameState.nextCard = shuffleTargetCards();
  
  renderGame();
}

//Function to handle when i click a box
function handleCardClick(event) {
  const clickedBox = event.target.dataset.number;
  //If the dataset number i gave it is over 0 itll log a click that way you cant get clicks from inbetween boxes
  if (clickedBox >= 0) {
    if (useClick) {
      useClick = false;
      gameState.cards[clickedBox].clicked = true;
      console.log(gameState.nextCard);

      //ups the score if the box hasnt yet been guessed correctly
      if (gameState.cards[clickedBox].guessedCorrect === false) {
        gameState.score++;
      }
      
      //If its a match it ticks off the correct guess and gets rid of that image from the list
      if (gameState.nextCard[0] === gameState.cards[clickedBox].image) {
        gameState.nextCard.shift();
        gameState.cards[clickedBox].guessedCorrect = true;
      }

    }
  }
  renderGame();
}

//Render function being the only one to interact with the html document 
function renderGame() {
  //All my variables for the documents put into arrays so i can use methods and stuff on them
  const gameCards = [...(document.getElementsByClassName("card"))];
  const cardImages = [...(document.getElementsByClassName("fas"))];
  const cardItem = [...(document.getElementsByTagName("li"))];
  const correctMatches = [...(document.getElementsByClassName("matched"))];

  //randomizing the next card before anything is changed
  cardImages[0].className = gameState.nextCard[0];

  //making all the cards hidden
  for (let card of gameCards) {
    card.classList.remove("matched", "show");
  }
  
  //shifting out the <i>'s that are before the list of <i>'s
  for (let i = 0; i < cardImages.length - gameCards.length + 1; i++) {
    cardImages.shift();
  }

  //giving the ul and <i> the same data set number so that i dont have to click directly onto the symbol as well as randomizing the card symbols
  for (let i = 0; i < cardImages.length; i++) {
    cardImages[i].className = gameState.cards[i].image;
    cardImages[i].dataset.number = i;
    cardItem[i].dataset.number = i;

    //checking if its been clicked so it can be shown
    if (gameState.cards[i].clicked === true) {
      cardItem[i].classList.add("show");
      
      //setting the timeout time and getting rid of the show class then setting clicked to false
      setTimeout(() => {cardItem[i].classList.remove("show"), useClick = true}, 1000);
      gameState.cards[i].clicked = false;
    }

    //If the guess is correct it shows that its matched instead of just shown
    if (gameState.cards[i].guessedCorrect === true) {
      cardItem[i].classList.add("matched");
    }
  }

  //if the correct matches length is where it needs to be then it runs the end game function
  console.log(correctMatches.length);
  if (correctMatches.length === 11) {
    gameVictory();
  }
  
  //updates the score at the end of every time the function is called
  document.getElementById("score").innerText = gameState.score;
}

//alerts the player the game is over and shows them their moves
function gameVictory() {
  alert(`Congratulations the game has been won, it took you ${gameState.score} moves!`);
}

//resets the page on load and my event listeners
reset();
document.getElementById("cards").addEventListener("click", handleCardClick)
document.querySelector(".restart").addEventListener("click", reset);