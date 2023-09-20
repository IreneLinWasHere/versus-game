// Timer mechanics
let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    } 

    if (timer === 0) {
        document.querySelector('#displayText').style.display = 'flex'
        determineWinner({player, enemy, timerId})
    }
}

// Detect attack
function rectangularCollision ({rectangle1, rectangle2}) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

// End of game mechanics
function determineWinner({player, enemy, timerId}) {
    const displayText = document.querySelector('#displayText')
    const playAgainButton = document.getElementById("play-again-button")
    
    clearTimeout(timerId)
    document.getElementById("result-container").style.display = 'flex'

    if (player.health === enemy.health) {
        displayText.innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        displayText.innerHTML = 'Huntress Wins'
    } else if (enemy.health > player.health) {
        displayText.innerHTML = 'Kenji Wins'
    } 

    playAgainButton.addEventListener("click", function() {
        location.reload()
    })
}