let preload = document.querySelector('.preload')
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')

//setting interval
let interval = new Interval(startInterval, 60)

let model = ml5.sketchRNN("cat", modelready)
let x = canvas.width/4
let y = canvas.width/4

function modelready(){
    console.log('okay')
    preload.style.display = 'none'
}

let pen = "down"
function gotSketch(e, data){
    // console.log(data)
    if(pen == "down"){
        let dx = data.dx 
        let dy = data.dy 
        //draw line between (x,y) and (x+dx,y+dy)
        line(ctx, "black", 5, x, y, x+dx, y+dy)
        //change (x,y) to (x+dx,y+dy)
        
        x = x+data.dx 
        y = y+data.dy
        pen = data.pen
    }
    if(pen=="up"){
        x = x+data.dx
        y = y+data.dy
        pen = data.pen
    }
    if(pen == 'end'){
        console.log('end drawing')
    }
}
function startInterval(){
    if(pen != "end"){
        model.generate(gotSketch)
    }else{
        console.log("drawing end")
        interval.stop()
    }
}


//drawing 

let drawx, drawy
let drawing = false
let seed = new Array()
canvas.onmousedown = e => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    model.reset()
    seed = []
    drawx = e.layerX
    drawy = e.layerY
    seed.push({
        x: drawx,
        y: drawy
    })
    drawing = true
}
canvas.onmousemove = e => {
    if(drawing){
        let nextX = e.layerX
        let nextY = e.layerY
        line(ctx, "black", 5, drawx, drawy, nextX, nextY)
        drawx = nextX
        drawy = nextY
        seed.push({
            x: nextX,
            y: nextY
        })
    }
}
canvas.onmouseup = () => {
    drawing = false
    x = drawx 
    y = drawy
    console.log(seed)
    let feedSeed = new Array()
    let rdppint = simplifyPath(seed, 2)
    console.log(rdppint)
    for (let i = 1; i < rdppint.length; i++) {
        if (i != rdppint.length - 1) {
            feedSeed.push({
                dx: rdppint[i].x - rdppint[i - 1].x,
                dy: rdppint[i].y - rdppint[i - 1].y,
                pen: "down"
            })
        }else{
            feedSeed.push({
                dx: rdppint[i].x - rdppint[i - 1].x,
                dy: rdppint[i].y - rdppint[i - 1].y,
                pen: "up"
            })
            
        }
        
    }
    model.generate(feedSeed, gotSketch)
    interval.start()
}



