document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const garfield = document.createElement('div')
    let isGameOver = false
    let groundCount = 5
    let grounds = []
    let score = 0

    // initial position
    let garfieldLeftSpace = 50
    let startPoint = 150
    let garfieldBottomSpace = startPoint

    let isJumping = true
    let upTimerId
    let downTimerID
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId

    class Ground {
        constructor(newGroundBottom) {
            // random left margin for first ground, must be smaller than 400 - 70
            this.left = Math.random() * 330
            this.bottom = newGroundBottom
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('ground')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createGrounds() {
        for (let i = 0; i < groundCount; i ++ ) {
            let groundGap = 600 / groundCount
            let newGroundBottom = 100 + i * groundGap
            let newGround = new Ground(newGroundBottom)
            grounds.push(newGround)
            console.log(grounds)
        }
    }

    function createGarfield() {
        grid.appendChild(garfield)
        garfield.classList.add('garfield')
        // let garfield align the first ground
        garfieldLeftSpace = grounds[0].left
        garfield.style.left = garfieldLeftSpace + 'px'
        garfield.style.bottom = garfieldBottomSpace + 'px'
    }
    // createGarfield()

    // when garfield higher bottom than 200px, all ground move down 4px
    function moveGrounds() {
        if (garfieldBottomSpace > 200) {
            grounds.forEach(ground => {
                ground.bottom -= 4
                let visual = ground.visual
                visual.style.bottom = ground.bottom + 'px'

                // remove the lowest ground when it away from bottom 10px
                if (ground.bottom < 10) {
                    let firstGround = grounds[0].visual
                    firstGround.classList.remove('ground')
                    grounds.shift()
                    // console.log('1', grounds)
                    // each remove add 1 score
                    score++
                    // add a new ground at top
                    let newGround = new Ground(600)
                    grounds.push(newGround)
                    // console.log('2', grounds)
                }
            })
        }
    }

    function fall() {
        //check garfield if in jumping state
        isJumping = false
        clearTimeout(upTimerId)
        downTimerID = setInterval(() => {
            garfieldBottomSpace -= 5
            garfield.style.bottom = garfieldBottomSpace + 'px'
            if (garfieldBottomSpace <= 0) {
                gameOver()
            }
            grounds.forEach(ground => {
                if (
                    (garfieldBottomSpace >= ground.bottom) &&
                    (garfieldBottomSpace <= (ground.bottom + 15)) &&
                    ((garfieldLeftSpace + 50) >= ground.left) &&
                    (garfieldLeftSpace <= (ground.left + 70))  &&
                    !isJumping
                ) {
                    startPoint = garfieldBottomSpace
                    jump()
                    console.log('startPoint', startPoint)
                    isJumping = true
                }
            })
        }, 20)
    }

    function jump() {
        clearInterval(downTimerID)
        isJumping = true
        upTimerId = setInterval(() => {
            garfieldBottomSpace += 15 // 20
            garfield.style.bottom = garfieldBottomSpace + 'px'
            if (garfieldBottomSpace > startPoint + 200) {
                fall()
                isJumping = false
            }
        }, 30)
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(() => {
            if (garfieldLeftSpace >= 0) {
                // console.log('going left')
                garfieldLeftSpace -= 3 //5
                garfield.style.left = garfieldLeftSpace + 'px'
            } else moveRight()
        }, 20)
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        leftTimerId = setInterval(() => {
            if (garfieldLeftSpace <= 313) {
                // console.log('going right')
                garfieldLeftSpace += 3 //5
                garfield.style.left = garfieldLeftSpace + 'px'
            } else moveLeft()
        }, 20)
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    // map keypress to moveleft, moveright
    function control(e) {
        garfield.style.bottom = garfieldBottomSpace + 'px'
        if (e.key === 'ArrowLeft') {
            moveLeft()
        } else if (e.key === 'ArrowRight') {
            moveRight()
        } else if (e.key === 'ArrowUp') {
            moveStraight()
        }
    }

    // call this when game over
    function gameOver() {
        isGameOver = true
        // delete all div object
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        // display final score
        grid.innerHTML = score
        clearInterval(downTimerID)
        clearInterval(upTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function start() {
        if (!isGameOver) {
            createGrounds()
            createGarfield()
            // call moveGrounds() every 30 milliseconds
            setInterval(moveGrounds, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    start()

    
})