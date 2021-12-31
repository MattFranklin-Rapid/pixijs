import { ObservablePoint, Sprite } from "pixi.js"



class emitter{

    constructor(x, y, sprite, angle){
        this.sprite = new Sprite.from(sprite);
        this.sprite.angle = angle;
        this.sprite.position = new ObservablePoint(x,y);
    }
}


class bullet{
    constructor(x, y, sprite, angle, speed){
        this.sprite = new Sprite.from(sprite);
        this.sprite.angle = angle;
        this.sprite.position = new ObservablePoint(x,y);
        this.speed = speed;
    }

    /*
        Really we want to change this
        If the move could be given a target and move straight there with a callback to update it's position when it reaches it
        Then the 'direct shot' type movement could do things like
        "Create 20 bullets in a spot, have them move out to form a cirlce, then all fire forward towards the player (or move as a group with the imaginary circle centred on the player)"
        Then we can also have different moves for waves, orbits, straight line, zig zags
        This would let the abstraction of a pattern be managed by a higher order manager and let him just control the move type and targets to form patterns
    */
    move(delta){
        if(this.sprite.x > 800){
            this.sprite.x = -5;
        } else{
            if(this.sprite.x < 0) this.sprite.x = 805;
        }
        
        if(this.sprite.y > 600) {
            this.sprite.y = -5;
        }else{
            if(this.sprite.y < 0) this.sprite.y = 605;
        }
        
        if(this.sprite.angle > 360){
            this.sprite.angle += 0.03 * delta;
            this.sprite.angle = this.sprite.angle % 360;
        }
        this.sprite.angle += 0.03 * delta;

        this.sprite.x += Math.sin(this.sprite.angle) * this.speed * delta;
        this.sprite.y += Math.cos(this.sprite.angle) * this.speed * delta;
    }
}