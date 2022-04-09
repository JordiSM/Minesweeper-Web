document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid')
    const width = 10
    const nBombs = 20
    
    let squares = []

    let SquaresLeft
    let isGameOver
    let flags

    function createBoard() {
        SquaresLeft = (width * width) - nBombs
        isGameOver  = false
        flags = 0

        for (let i = 0; i < width; i++) {
            squares[i] = []

            for (let j = 0; j < width; j++){
                squares[i][j] = 0
            }
        }
        
        bombs_counter = 0;
        while(bombs_counter < nBombs){
           
            x = Math.floor(Math.random() * (width - 0));
            y = Math.floor(Math.random() * (width - 0));

            // si la casilla no contiene una bomba
            if(squares[x][y] != -1){
                //colocamos la bomba
                squares[x][y] = -1

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


    function click(square) {
        currentId = square.id
        x = Math.floor(currentId/10)
        y = currentId%10
        console.log('Fila:' ,x, ' - Columna:' , y)
        
        if(isGameOver) return
        if(square.classList.contains('checked') || square.classList.contains('flag')) return
        if(square.classList.contains('bomb')){
            gameOver(square)
        } else {

            value = square.getAttribute('data')
            console.log(value)

            square.classList.add('checked')

            if(value == 0){
                checkNeighbours(square, currentId)
            }
        }
    }

    function gameOver(square){
        console.log('bomba en ', square.id)
    }

    function checkNeighbours(square , currentId){
        x = Math.floor(currentId/10)
        y = currentId%10
        setTimeout(() => {
            for(let ix = -1; ix < 2; ix++){
                for(let iy = -1; iy < 2; iy++){
                    posx = x + ix;
                    posy = y + iy;
                    if((-1 < posx) && (posx < width) && (-1 < posy) && (posy < width)){
                        nextId = posx * 10 + posy
                        click(document.getElementById(nextId))
                    }
                }
            }
        }, 50)
    }



    function addFlag(square){
        console.log('flag')
    }

    createBoard()

})