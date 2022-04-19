document.addEventListener('DOMContentLoaded', () => {
    grid = document.getElementById('grid')
    const width = 10
    const nBombs = 20
    
    let squares = []
    let bombs = []

    let SquaresLeft
    let isGameOver
    let flagsLeft = nBombs

    function createBoard() {
        SquaresLeft = (width * width) - nBombs
        isGameOver  = false
        flagsLeft = nBombs

        for (let i = 0; i < width; i++) {
            squares[i] = []

            for (let j = 0; j < width; j++){
                squares[i][j] = 0
            }
        }
        bombs = []
        bombs_counter = 0
        while(bombs_counter < nBombs){
           
            x = Math.floor(Math.random() * (width - 0));
            y = Math.floor(Math.random() * (width - 0));

            // si la casilla no contiene una bomba
            if(squares[x][y] != -1){
                //colocamos la bomba
                squares[x][y] = -1
                bombs.push((x * width) + y)

                //actualizamos casillas vecinas
                for(let ix = -1; ix < 2; ix++){
                    for(let iy = -1; iy < 2; iy++){
                        posx = x + ix;
                        posy = y + iy;
                        if((-1 < posx) && (posx < width) && (-1 < posy) && (posy < width) && (squares[posx][posy] != -1)){
                            squares[posx][posy]++
                        }
                    }
                }

                bombs_counter++
            } 
        }

        for(let i = 0; i < width*width; i++ ){
            const square = document.createElement('div')
            square.setAttribute('id', i)
            console.log(square)
            data = squares[Math.floor(i/width)][i%width]
            if(data!= -1){
                square.classList.add('valid')
                square.setAttribute('data', data)
            }else{
                square.classList.add('bomb')
            }
            
            grid.appendChild(square)
            
            square.addEventListener('click' , () => {
                click(square)
            })

            square.oncontextmenu = (e) => {
                e.preventDefault()
                addFlag(square)
            }
        }
        console.log(squares)
    }

    function gameOver(square){
        message = document.getElementById('message')
        message.innerHTML = 'Game Over'
        isGameOver=true
        bombs.forEach(id => {
            bomb = document.getElementById(id)
            bomb.innerHTML = 'x'
        });
    }

    function Victory(){
        message = document.getElementById('message')
        message.innerHTML = 'Victory!!'
        isGameOver=true
    }

    function click(square){
        if(isGameOver) return
        if(square.classList.contains('checked') || square.classList.contains('flag')) return
        if(square.classList.contains('bomb')){
            gameOver(square)
            return
        }

        currentId = square.id
        x = Math.floor(currentId/10)
        y = currentId%10

        cells = []
        cells.push(currentId)
        let cell_id

        while(cells.length > 0){
            cell_id = cells.shift()
            cell = document.getElementById(cell_id)
            if(cell.classList.contains('checked')){
                continue
            }
            value = cell.getAttribute('data')
            cell.innerHTML = value
            cell.classList.add('checked')
            SquaresLeft--
            if(SquaresLeft == 0){
                Victory()
            }
            if(parseInt(value) == 0){
                cell.innerHTML = ''
               
                x = Math.floor(cell_id/10)
                y = cell_id%10
                
                for(let ix = -1; ix < 2; ix++){
                    for(let iy = -1; iy < 2; iy++){
                        if (ix === 0 && iy === 0) {
                            continue;
                        }
                        posx = x + ix;
                        posy = y + iy;
                        if((-1 < posx) && (posx < width) && (-1 < posy) && (posy < width)){
                            nextId = (posx * 10) + posy
                            cells.push(nextId)
                        }
                    }
                }
            }


        }
    }

    function addFlag(square){
        if(isGameOver) return
        if(square.classList.contains('checked')) return
        if(flagsLeft==0) return
        if(square.classList.contains('flag')){
            square.classList.remove('flag')
            square.innerHTML = ''
            flagsLeft++
        } else {
            square.classList.add('flag')
            square.innerHTML = '!'
            flagsLeft--
        }
    }

    face = document.getElementById('newGame')
    face.addEventListener('click' , () => {
        //deletes previous board
        document.getElementById('message').innerHTML = ''
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        //create board
        createBoard()
    })

    createBoard()

})
