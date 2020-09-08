document.addEventListener('DOMContentLoaded', () => { //addEventListener is an event target method
  const grid = document.querySelector('.grid') //js knows that anytime we type grid that we want it applied to all of them
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')//display won't change
  const startBtn = document.querySelector('#start-button')//won't change //#indicates that we are looking for an Id
  const width = 10 //won't change
  let nextRandom = 0 //will change
  let timerId //will change
  let score = 0 //will change
  const colors = [  //won't change from those colors
    'gainsboro',
    'lightSeaGreen',
    'deepPink',
    'blueVoilet',
    'Aquamarine'
  ]

  //querySelector: inbuild js method. it searches through document for whatever is assigned to it ('')
  //querySelectorAll: collects all divs inside grid, then uses array.from to collect all divs in grid
  //and turns them into an array with a specific index number

console.log(squares)

    //Ids are unique and can only be used once. Classes can be used multiple times on a single element,
    //or a single class can be used on multiple elements.

    //you can store values in variables. they're identifiers. when you declare a variable it must be unique.
    //have two kinds of scope: global and function (it can only be used inside function)
    //var: variables that are not limited in scope (global)
    //let: allows you to declare variables that are limited to a scope of a block statement
    //const: cannot access if it's inside a function - cannot change it later on
    //The Tetrominoes

  const lTetromino = [ //this is const variable with a given value of this array of arrays. each line is one position of the tetromino
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

//Arrays: a variable that can hold more than one value at one time. (rather than single constants for example)
//can hold many values under a single name and you can access values by referring to an index number
//
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino] // this variable has the value of the "condensed" tetrimino arrays
  // so they'll be have as a group when referenced

  let currentPosition = 4 // this variable says that the tetromino will begin at position 4 on the grid
  let currentRotation = 0

  console.log(theTetrominoes[0][0])

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length)// built in fuction of js that does math to get random number. here it's assigned to
  let current = theTetrominoes[random][currentRotation]

//math.random = will give random number
//length = inbuilt method that will give array length
//math.floor = will round down to the nearest integer

  //draw the Tetromino - draw and forEach functions invoked and applied to the index (0-99) of
  function draw() {
    current.forEach(index => { //forEach says that the function will be called once for each element in an array
      squares[currentPosition + index].classList.add('tetromino') //classList accesses the elements list of classes connected to it
      //a class is an identifier of an element (like Id, but not unique)
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  } //arrow function => = shorter function synrax

  //forEach = causes a provided callback function once for each element in an array in ascending order. The callback is invoked for (value, index, object)

//classList.add =
  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

  //assign functions to keyCodes. keyCodes are numerical assignments to keys that can then be assigned to a function
  function control(e) {
    if(e.keyCode === 37) { // here keyCode 37 is the moveLeft function. This reads if the left arrow is released, the
      //tetrimono will move left
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control) //this addEventListener is listenint for the up event (release of the key)
  //to work

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width // this means that after the tetromino is undrawn, it will be set to draw again
    //at a position equal to where it is + the width of a square

    //the full length version would be currentPosition = current position + width
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //if some of the tetrominos pass through a square with a taken position (current position + width), game will freeze
      //then they all become "taken" game freezes
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)//defined left edge (some is a method that looks at each item in an array and checks that it's true for at least one item)
    //the math above returns 0 basically and stops shape from falling off left edge
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    } // this stops the tetromino and moves it back a space (without redrawing) so it seems not to have moved
    draw()
  }


  ///FIX ROTATION OF TETROMINOS A THE EDGE
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }

  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

  //rotate the tetromino
  function rotate() {
    undraw()
    currentRotation ++ //goes to next item in array
    if(currentRotation === current.length) { //if currentRotation is deeply = to the amount of rotations in our current tetromino shape,
      // then we go back to first item in our array
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
  }
  /////////



  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino

  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000) // one second
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
    }
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i +=width) { //the condition for the loop to run
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      //for = setting variable before loop starts, defining condition to run and implementing value by 1

      if(row.every(index => squares[index].classList.contains('taken'))) { //if every square in our defined row
        //contains a div in the class of taken. If it does, we add 10 to the score, then add the score to display (innerHTML),
        //then remove the squares with the class of ('taken')
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')//pulls the tetrominos off the top after beign re-added
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width) //mutates an array - in this case, taking out a row
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))//appends removed squares to grid (or else the grid would
        //appear smaller - as they've been removed through splice)
      }
    }
  }
//splice = remove or add to array
//splice = attaches to array and lists index nuber of items to remove (1 = remove, 0 = don't remove)
//
  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

})
