//const { Rectangle, Graphics } = require("pixi.js");
import { Rectangle, Graphics } from "pixi.js";

class Quadtree {
    constructor(level, x, y, width, height){
        this.MAX_OBJECTS = 10;
        this.MAX_LEVELS = 5;

        this.level = level;
        this.objects = [];
        this.bounds = new Rectangle(x,y,width,height);
        this.nodes = [];
    }

    //Delete Everything Recursivly
    clear(){
        this.objects = [];

        this.nodes.map(n => {
            n.clear();
        });
        this.nodes = [];
    }

    /*Subnodes are anchored top left and build like so
        0  1
        2  3
    */
    split(){
        let subWidth = this.bounds.width / 2;
        let subHeight = this.bounds.height / 2;
        let x = this.bounds.x;
        let y = this.bounds.y;
        let level = this.level + 1;

        this.nodes[0] = new Quadtree(level, x, y, subWidth, subHeight);
        this.nodes[1] = new Quadtree(this.level, x + subWidth, y, subWidth, subHeight);
        this.nodes[2] = new Quadtree(this.level, x, y + subHeight, subWidth, subHeight);
        this.nodes[3] = new Quadtree(this.level, x + subWidth, y + subHeight, subWidth, subHeight);
    }

    /*
    * Determine which node the object belongs to. -1 means
    * object cannot completely fit within a child node and is part
    * of the parent node
    */
    getIndex(element){
        let index = -1;
        horizontalMidpoint = element.x + (element.width/2);
        verticalMidpoint = element.y + (element.height/2);
        
        //Is the element wholey within the top or bottom half? y == midpoint is regarded as not within the bottom
        let topQuadrant = !!(element.y < verticalMidpoint && element.y + element.height < verticalMidpoint);
        let bottomQuadrant = !!(element.y > verticalMidpoint);

        //Is the element wholey within the left or right half? x == midpoint is regarded as not within the right
        let leftQuadrant = !!(element.x < horizontalMidpoint && element.x + element.width < horizontalMidpoint);
        let rightQuadrant = !!(element.x > horizontalMidpoint);

        //Is the element fully within a corner?
        if(topQuadrant && leftQuadrant){
            index = 0;
        }else if (topQuadrant && rightQuadrant){
            index = 1;
        }else if(bottomQuadrant && leftQuadrant){
            index = 2;
        }else if(bottomQuadrant && rightQuadrant){
            index = 3;
        }

        return index;
    }

    //Puts something into the quad tree
    //Will break up the tree if it overflows
    insert(element){
        //If we have child nodes already
        if(this.nodes.length != 0){
            let index = this.getIndex(element);

            if(index != -1){
                this.nodes[index].insert(eleemtn);
                return; //"We're done here" - Cave Johnson
            }
        }

        //Either we have no children, or the element won't fit within a child
        this.objects.push(element);

        //Have we overflown and have more depth we can drill down to?
        if(this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS){
            //Make children if we need to
            if(this.nodes.length == 0){
                this.split();
            }

            //"Iterate" through the objects and see if we can jam them into a child node
            //Unknown length due to contracting the array while working on it
            let i = 0;
            while(i < this.objects.length){
                let index = this.getIndex(this.objects[i]);
                if(index != -1){
                    this.nodes[index].insert(this.objects.splice(i,1));
                }else{
                    i++;
                }
            }
        }
    }

    //Determine if there are elements in the same node as the given element recursivly
    retrive(foundElements, element){
        let index = this.getIndex(element);
        //Is the element within a child node?
        if(index != -1 && this.nodes.length != 0){
            this.nodes[index].retrive(foundElements, element);
        }

        foundElements.push(this.objects);
        return foundElements;
    }
}

//Testing the tree
let myQuadTree = new Quadtree(0, 0,0, 800, 600);
let someRectangles = [];
for(let i = 0; i < 10; i++){
    aGraphic = new Graphics();
    aGraphic.beginFill(0xFF0000);
    aGraphic.lineStyle(2, 0xFFFFFF);
    aGraphic.drawRect(Math.random(600), Math.random(600), Math.random(100) + 1, Math.random(100) + 1);
    someRectangles.push(aRectangle);
}

// Simulating a frame
myQuadTree.clear();

for(let i = 0; i <= someRectangles.length; i++){
    myQuadTree.insert(someRectangles[i]);
}

myQuadTree.retrive(stuff, someRectangles[2]);
console.log('Did it work?');