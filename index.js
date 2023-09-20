const introContainer = document.getElementById("intro-container");
const gameCanvas = document.getElementById("game-canvas")
const timerBox = document.getElementById("timer")
const readyButton = document.getElementById("ready-button");

// Starts game by clicking the "Ready!" button
readyButton.addEventListener("click", function () {
    // Hide the intro container
    introContainer.classList.add("hidden")

    // Show the canvas and timer
    gameCanvas.classList.remove("hidden")
    timerBox.classList.remove("hidden")

    //Start timer countdown
    decreaseTimer()
});

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/background.png"
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 147
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/Huntress/Idle.png",
    scale: 3,
    framesMax: 8,
    offset: {
        x: 100,
        y: 120
    },
    sprites: {
        idle: {
            imageSrc: "./img/Huntress/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./img/Huntress/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/Huntress/jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/Huntress/fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/Huntress/Attack1.png",
            framesMax: 5
        }, 
        takeHit: {
            imageSrc: "./img/Huntress/Take hit.png",
            framesMax: 3
        }, 
        death: {
            imageSrc: "./img/Huntress/Death.png",
            framesMax: 8
        }
    },
    attackBox: {
        offset: {
            x: -100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 650,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }, 
    imageSrc: "./img/kenji/Idle.png",
    scale: 2.5,
    framesMax: 4,
    offset: {
        x: 0,
        y: 145
    },
    sprites: {
        idle: {
            imageSrc: "./img/kenji/Idle.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./img/kenji/run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/kenji/jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/kenji/fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/kenji/attack1.png",
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        }, 
        death: {
            imageSrc: "./img/kenji/death.png",
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -120,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },

    //Enemy keys
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255,255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    
    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //Detect for collision & enemy gets hit
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && 
        player.isAttacking && 
        player.framesCurrent === 1
    ) {
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    //if player misses
    if(player.isAttacking && player.framesCurrent === 3) {
        player.isAttacking = false
    }

    //this is where our player gets hit
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && 
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false

        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    //if enemy misses
    if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) { 
        switch (event.key) {
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break;
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break;
            case 'w':
                player.velocity.y = -20
                break;
            case 's':
                player.attack()
                break;
        }
    }

    //Enemy keys
    if (!enemy.dead) {
        switch(event.key) {
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20
                break;
            case 'ArrowDown':
                enemy.attack()
                break;
        }
    }  
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
    }

        //Enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
         case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    }
})