//const { Rectangle, Graphics } = require("pixi.js");
import { Rectangle } from "pixi.js";

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

    /*Subnodes are anchored top left and built like so
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
        this.nodes[1] = new Quadtree(level, x + subWidth, y, subWidth, subHeight);
        this.nodes[2] = new Quadtree(level, x, y + subHeight, subWidth, subHeight);
        this.nodes[3] = new Quadtree(level, x + subWidth, y + subHeight, subWidth, subHeight);
    }

    /*
    * Determine which node the object belongs to. -1 means
    * object cannot completely fit within a child node and is part
    * of the parent node
    */
    getIndex(element){
        let index = -1;
        let x = element.x; //element._geometry.graphicsData[0].shape.x;
        let y = element.y; //element._geometry.graphicsData[0].shape.y;
        let horizontalMidpoint = this.bounds.width / 2;
        let verticalMidpoint = this.bounds.height / 2;
        
        //Is the element wholey within the top or bottom half? y == midpoint is regarded as not within the bottom
        let topQuadrant = !!(y < verticalMidpoint && y + element.height < verticalMidpoint);
        let bottomQuadrant = !!(y > verticalMidpoint);

        //Is the element wholey within the left or right half? x == midpoint is regarded as not within the right
        let leftQuadrant = !!(x < horizontalMidpoint && x + element.width < horizontalMidpoint);
        let rightQuadrant = !!(x > horizontalMidpoint);

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
                this.nodes[index].insert(element);
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
                    this.nodes[index].insert(this.objects.splice(i,1)[0]);
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

    explain(){
      if(this.nodes.length != 0){
        console.log(`Level : ${this.level + 1} | TopLeft  Objects ${this.nodes[0].objects.length} | X: ${this.nodes[0].bounds.x} | Y: ${this.nodes[0].bounds.y}
        TopRight Objects ${this.nodes[1].objects.length} | X: ${this.nodes[1].bounds.x} | Y: ${this.nodes[1].bounds.y}
        BotLeft  Objects ${this.nodes[2].objects.length} | X: ${this.nodes[2].bounds.x} | Y: ${this.nodes[2].bounds.y}
        BotRight Objects ${this.nodes[3].objects.length}   X: ${this.nodes[3].bounds.x} | Y: ${this.nodes[3].bounds.y}`);
        this.nodes[0].explain();
        this.nodes[1].explain();
        this.nodes[2].explain();
        this.nodes[3].explain();
      }
      
    }
}