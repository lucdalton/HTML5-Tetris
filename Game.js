var testShape;
var testShape2;
var testShape3;
var testShape4;
var testShape5;
var testShape6;
var testShape7;
var s1;
var s2;
function startGame() {
    myGameArea.start();
    testShape = new Shape(0, 0, 10, "Shape6");
    testShape2 = new Shape(50, 100, 10, "Shape7");
    testShape3 = new Shape(120, 170, 10, "Shape5");    
    testShape4 = new Shape(100, 180, 10, "Shape4");
    
    console.log('Overlap: ', testShape3.collision(testShape4));
    testShape5 = new Shape(0, -40, 10, "Shape3");
    testShape6 = new Shape(0, -80, 10, "Shape2");
    testShape7 = new Shape(150, 250, 10, "Shape1"); 
    myGameArea.screenShapes.push(testShape2);
    s1 = new Square(20,20,"red", 50,50);
    s2 = new Square(20,20,"red", 69,69);
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 460;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateCanvas, 17);
    },
    clear: function(){
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    },
    blockSize : 10,
    screenShapes : [],
    update : function(){
        var shapeIndex = this.screenShapes.length-1;
        var currentShape = this.screenShapes[shapeIndex];
        if((this.frameNo % 10) == 0)
        {
            currentShape.move(0,10);
        }
        
        this.screenShapes.forEach(function(shape){
            shape.update();
        }); 
        
        if(this.screenShapes[this.screenShapes.length-1].lock)
        {
            this.screenShapes.push(new Shape(50, 100, 10, NextShape()));
        }
        shapeIndex = this.screenShapes.length-1;
        
        for(var i=0; i<this.screenShapes.length; i++)
        {
            if(i!=shapeIndex)
            {
                if(this.screenShapes[i].collision(currentShape))
                {
                    currentShape.lock = true;
                }
            }
        }
    },
    left : function()
    {
        var shapeIndex = this.screenShapes.length-1;
        var currentShape = this.screenShapes[shapeIndex];
        var moved = false;
        //this.screenShapes[shapeIndex].move(-10,0);
        // check shape side isn't touching any other
        if(this.screenShapes.length == 1)
        {
            this.screenShapes[shapeIndex].move(-1 * this.blockSize,0);
        }else
        {
            for(var i=0; i<this.screenShapes.length; i++)
            {
                if(i!=shapeIndex)
                {
                    //if(!this.screenShapes[i].touching(currentShape) && !moved)
                    //if(!this.screenShapes[i].touchingLeft(currentShape) && !moved)
                    if(!currentShape.touchingLeft(this.screenShapes[i]) && !moved)
                    {
                        this.screenShapes[shapeIndex].move(-1 * this.blockSize,0);
                        moved = true;
                    }
                }
            }
        }        
    },
    right : function()
    {
        var shapeIndex = this.screenShapes.length-1;
        this.screenShapes[shapeIndex].move(10,0);
    },
    rotate : function()
    {
        var shapeIndex = this.screenShapes.length-1;
        this.screenShapes[shapeIndex].rotate();
    }
}


function Square(width, height, color, x, y) {
    
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    //ctx = myGameArea.context;
    //ctx.fillStyle = color;
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


function NextShape()
{
    return "Shape" + (Math.floor(Math.random()*7 + 1));
}


function updateCanvas() {
    myGameArea.frameNo++;
    myGameArea.clear();
    //console.log(testShape2.squaresOverlap(s1, s2));
    //myGameArea.screenShapes.forEach(function(shape){
    //    shape.update();
    //});
    myGameArea.update();
    //if((myGameArea.frameNo % 10) == 0)
    //{
    //    testShape2.move(0,10);
    //}
    //testShape3.update();
    //testShape4.update();
}



//   shape1        shape2       shape3      shape4      shape5      shape6      shape7
//    O                           OO          O             O          OO         OO
//   OOO            OOOO          OO          OOO         OOO         OO           OO
function Shape(x,y,w, type) {
    this.squares = [];
    this.width = w;
    this.lock = false;
    this.screenHeight = myGameArea.canvas.height;
    this.squaresOverlap = function(square1, square2)
    {
        // check if squares overlap
        // if (RectA.X1 < RectB.X2 && RectA.X2 > RectB.X1 &&
        // RectA.Y1 < RectB.Y2 && RectA.Y2 > RectB.Y1) 
        var s1_w = square1.width;
        var s2_w = square2.width;
        if((square1.x < (square2.x + s2_w)) && ((square1.x + s1_w) > square2.x) &&
           (square1.y <= (square2.y + s2_w)) && ((square1.y + s1_w) >= square2.y))
        {
            return true;
        }
        return false;
    };
    this.squaresTouching = function(square1, square2)
    {
        // check if squares overlap
        // if (RectA.X1 < RectB.X2 && RectA.X2 > RectB.X1 &&
        // RectA.Y1 < RectB.Y2 && RectA.Y2 > RectB.Y1) 
        var s1_w = square1.width;
        var s2_w = square2.width;
        if((square1.x <= (square2.x + s2_w)) && ((square1.x + s1_w) >= square2.x) &&
           (square1.y <= (square2.y + s2_w)) && ((square1.y + s1_w) >= square2.y))
        {
            return true;
        }
        return false;
    };

    this.squaresTouchingLeft = function(square1, square2)
    {
        // check if squares1 left overlaps square2 right
        // if (RectA.X1 < RectB.X2 && RectA.X2 > RectB.X1 &&
        // RectA.Y1 < RectB.Y2 && RectA.Y2 > RectB.Y1) 
        var s1_w = square1.width;
        var s2_w = square2.width;
        if((square1.x == (square2.x + s2_w)) && (((square1.y + s1_w >= square2.y) && (square1.y + s1_w <= square2.y + s2_w)) || ((square1.y >= square2.y) && (square1.y <= square2.y + s2_w))))
        {
            return true;
        }

        return false;
    };

    this.collision = function(anotherShape)
    {
        // check if other shape collides with this one
        for(var i=0; i<this.squares.length; i++)
        {
            for(var j=0; j<anotherShape.squares.length; j++)
            {
                if(this.squaresOverlap(this.squares[i], anotherShape.squares[j]))
                {
                    return true;
                }
            }
        }
        return false;
        /*
        this.squares.forEach(function(s1){
            anotherShape.squares.forEach(function(s2){
                if(this.squaresOverlap(s1, s2))
                {
                    return true;
                }
            });
        });
        */  
    };
    this.touching = function(anotherShape)
    {
        // check if other shape collides with this one
        for(var i=0; i<this.squares.length; i++)
        {
            for(var j=0; j<anotherShape.squares.length; j++)
            {
                if(this.squaresTouching(this.squares[i], anotherShape.squares[j]))
                {
                    return true;
                }
            }
        }
        return false;
    };

    this.touchingLeft = function(anotherShape)
    {
        // check the left sides of the squares of this shape 
        for(var i=0; i<this.squares.length; i++)
        {
            for(var j=0; j<anotherShape.squares.length; j++)
            {
                if(this.squaresTouchingLeft(this.squares[i], anotherShape.squares[j]))
                {
                    return true;
                }
            }
        }
        return false;
    };

    this.touchingRight = function(anotherShape)
    {
        // check the left sides of the squares of this shape 
        for(var i=0; i<this.squares.length; i++)
        {
            for(var j=0; j<anotherShape.squares.length; j++)
            {
                if(this.squaresTouchingLeft(anotherShape.squares[j], this.squares[i]))
                {
                    return true;
                }
            }
        }
        return false;
    };

    this.update = function() {
        this.squares.forEach(function(square){
            square.update();
        });
    };
    this.move = function(dx,dy) {
        var height = this.screenHeight;
        var locked = this.lock;
        this.squares.forEach(function(square){
            //console.log(square.y + dy, height);
            if(square.y + w + dy > height)
            {
                //this.lock = true;
                locked = true;
                console.log('hit');
            }
        });  
        this.squares.forEach(function(square){
            if(!locked)
            {
                square.x += dx;
                square.y += dy;                
            }
        });
        this.lock = locked;  
    };
    if(type == "Shape1")
    {
        this.squares.push(new Square(w, w, "red", x, y));
        this.squares.push(new Square(w, w, "red", x + w, y));
        this.squares.push(new Square(w, w, "red", x + 2*w, y));
        this.squares.push(new Square(w, w, "red", x + w, y - w));
        this.state = 0;
        this.rotate = function() {
            switch(this.state)
            {
                case 0:
                {
                    this.squares[0].x += this.width;
                    this.squares[0].y -= this.width;
                    this.squares[2].x -= this.width;
                    this.squares[2].y += this.width;
                    this.squares[3].x += this.width;
                    this.squares[3].y += this.width;
                    this.state = 1;
                }
                break;
                case 1:
                {
                    this.squares[0].x += this.width;
                    this.squares[0].y += this.width;
                    this.squares[2].x -= this.width;
                    this.squares[2].y -= this.width;
                    this.squares[3].x -= this.width;
                    this.squares[3].y += this.width;
                    this.state = 2;
                }
                break;
                case 2:
                {
                    // OOO
                    //  O
                    this.squares[0].x -= this.width;
                    this.squares[0].y += this.width;
                    this.squares[2].x += this.width;
                    this.squares[2].y -= this.width;
                    this.squares[3].x -= this.width;
                    this.squares[3].y -= this.width;
                    
                    this.state = 3;
                }
                break;
                case 3:
                {
                    //  O
                    // OO
                    //  O
                    this.squares[0].x -= this.width;
                    this.squares[0].y -= this.width;
                    this.squares[2].x += this.width;
                    this.squares[2].y += this.width;
                    this.squares[3].x += this.width;
                    this.squares[3].y -= this.width;
                    this.state = 0;
                }
                break;
            }
        }
    }else if(type == "Shape2")
    {
        this.squares.push(new Square(w,w, "#53D190", x, y));
        this.squares.push(new Square(w,w, "#53D190", x + w, y));
        this.squares.push(new Square(w,w, "#53D190", x + 2*w, y));
        this.squares.push(new Square(w,w, "#53D190", x + 3*w, y));
        this.state = 0;
        this.rotate = function() {
            switch(this.state)
            {
                case 0:
                {
                    this.squares[0].x += 2*w;
                    this.squares[0].y -= 2*w;
                    this.squares[1].x += w;
                    this.squares[1].y -= w;
                    this.squares[3].x -= w;
                    this.squares[3].y += w;
                    this.state = 1;
                }
                break;
                case 1:
                {
                    this.squares[0].x -= 2*w;
                    this.squares[0].y += 2*w;
                    this.squares[1].x -= w;
                    this.squares[1].y += w;
                    this.squares[3].x += w;
                    this.squares[3].y -= w;
                    this.state = 0;
                }
                break;
            }
        }
    }else if(type == "Shape3")
    {
        this.squares.push(new Square(w,w, "#BA75D8", x    , y));
        this.squares.push(new Square(w,w, "#BA75D8", x + w, y));
        this.squares.push(new Square(w,w, "#BA75D8", x + w, y - w));
        this.squares.push(new Square(w,w, "#BA75D8", x    , y - w));
        this.rotate = function() {
        };
    }else if(type == "Shape4")
    {
        this.squares.push(new Square(w,w, "blue", x      , y));
        this.squares.push(new Square(w,w, "blue", x + w  , y));
        this.squares.push(new Square(w,w, "blue", x + 2*w, y));
        this.squares.push(new Square(w,w, "blue", x      , y - w));
        this.state = 0;
        this.rotate = function() 
        {
            switch(this.state)
            {
                case 0:
                {
                    this.squares[0].x += this.width;
                    this.squares[0].y -= this.width;
                    this.squares[2].x -= this.width;
                    this.squares[2].y += this.width;
                    this.squares[3].x += this.width*2;
                    this.state = 1;
                }
                break;
                case 1:
                {
                    //    [0][3]
                    //    [1]             <- rotate around this
                    //    [2]
                    this.squares[0].x += this.width;
                    this.squares[0].y += this.width;
                    this.squares[2].x -= this.width;
                    this.squares[2].y -= this.width;
                    this.squares[3].y += this.width*2;
                    this.state = 2;
                }
                break;
                case 2:
                {
                    //
                    //    [2][1][0]
                    //          [3]
                    this.squares[0].x -= this.width;
                    this.squares[0].y += this.width;
                    this.squares[2].x += this.width;
                    this.squares[2].y -= this.width;
                    this.squares[3].x -= this.width*2;
                    this.state = 3; 
                }
                break;
                case 3:
                {
                    //      [2]
                    //      [1]
                    //   [3][0]
                    this.squares[0].x -= this.width;
                    this.squares[0].y -= this.width;
                    this.squares[2].x += this.width;
                    this.squares[2].y += this.width;
                    this.squares[3].y -= this.width*2;
                    this.state = 0;  
                }
                break;
            }       
        };
    }else if(type == "Shape5")
    {
        this.squares.push(new Square(w,w, "#6195E8", x      , y));
        this.squares.push(new Square(w,w, "#6195E8", x + w  , y));
        this.squares.push(new Square(w,w, "#6195E8", x + 2*w, y));
        this.squares.push(new Square(w,w, "#6195E8", x + 2*w, y - w));
        this.state = 0;
        this.rotate = function() {
            switch(this.state)
            {
                case 0:
                {
                    //            [3]
                    //      [0][1][2]
                    //
                    this.squares[0].x += this.width;
                    this.squares[0].y -= this.width;
                    this.squares[2].x -= this.width;
                    this.squares[2].y += this.width;
                    this.squares[3].y += this.width*2;
                    this.state = 1;
                }
                break;
                case 1:
                {
                    //      [0]
                    //      [1]
                    //      [2][3]
                    this.squares[0].x += this.width;
                    this.squares[0].y += this.width;
                    this.squares[2].x -= this.width;
                    this.squares[2].y -= this.width;
                    this.squares[3].x -= this.width*2;
                    this.state = 2;
                }
                break;
                case 2:
                {
                    //
                    //      [2][1][0]
                    //      [3]
                    this.squares[0].x -= this.width;
                    this.squares[0].y += this.width;
                    this.squares[2].x += this.width;
                    this.squares[2].y -= this.width;
                    this.squares[3].y -= this.width*2;
                    this.state = 3; 
                }
                break;
                case 3:
                {
                    //   [3][2]
                    //      [1]
                    //      [0]
                    this.squares[0].x -= this.width;
                    this.squares[0].y -= this.width;
                    this.squares[2].x += this.width;
                    this.squares[2].y += this.width;
                    this.squares[3].x += this.width*2;
                    this.state = 0;  
                }
                break;
            } 
        };
    }else if(type == "Shape6")
    {
        //         [2][3]
        //      [0][1]
        this.squares.push(new Square(w,w, "Salmon", x      , y));
        this.squares.push(new Square(w,w, "Salmon", x + w  , y));
        this.squares.push(new Square(w,w, "Salmon", x + w  , y - w));
        this.squares.push(new Square(w,w, "Salmon", x + 2*w, y - w));
        this.state = 0;        
        this.rotate = function()
        {
            switch(this.state)
            {
                case 0:
                {
                    this.squares[0].x += this.width;
                    this.squares[0].y -= this.width;
                    this.squares[2].x += this.width;
                    this.squares[2].y += this.width;
                    this.squares[3].y += this.width*2;                    
                    this.state = 1;
                }
                break;
                case 1:
                {
                    this.squares[0].x -= this.width;
                    this.squares[0].y += this.width;
                    this.squares[2].x -= this.width;
                    this.squares[2].y -= this.width;
                    this.squares[3].y -= this.width*2;                    
                    this.state = 0;
                }
                break;
            }      
        }
    }else if(type == "Shape7")
    {
        //      [0][1]
        //         [2][3]
        this.squares.push(new Square(w,w, "Grey", x      , y));
        this.squares.push(new Square(w,w, "Grey", x + w  , y));
        this.squares.push(new Square(w,w, "Grey", x + w  , y + w));
        this.squares.push(new Square(w,w, "Grey", x + 2*w, y + w));
        this.state = 0;  
        this.rotate = function()
        {
            switch(this.state)
            {
                case 0:
                {
                    this.squares[0].x += this.width;
                    this.squares[0].y -= this.width;
                    this.squares[2].x -= this.width;
                    this.squares[2].y -= this.width;
                    this.squares[3].x -= this.width*2;                    
                    this.state = 1;
                }
                break;
                case 1:
                {
                    //     [0]
                    //  [2][1]
                    //  [3]
                    this.squares[0].x -= this.width;
                    this.squares[0].y += this.width;
                    this.squares[2].x += this.width;
                    this.squares[2].y += this.width;
                    this.squares[3].x += this.width*2;                    
                    this.state = 0;
                }
                break;
            }
        }
    }
}