export default class Player {
    runAnimationTimerConst = 200;
    runAnimationTimerVar = this.runAnimationTimerConst;
    dinoRunImages = [];
    
    jumpPressed = false;
    jumpProgressing = false;
    falling = false;
    jumpSpeed = 0.6;
    gravity = 0.4;

    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio
        this.y = this.canvas.height - this.height - (1.5 * scaleRatio);
        this.standingPosition = this.y;

        this.standStillImage = new Image();
        this.standStillImage.src = 'images/standing_still.png';
        this.image = this.standStillImage;

        const dinoRunImage1 = new Image();
        dinoRunImage1.src = 'images/dino_run1.png';
        const dinoRunImage2 = new Image();
        dinoRunImage2.src = 'images/dino_run2.png';
        this.dinoRunImages.push(dinoRunImage1);
        this.dinoRunImages.push(dinoRunImage2);

        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);

        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);
        window.addEventListener('touchstart', this.touchstart);        
        window.addEventListener('touchend', this.touchend);
    }

    keydown = (event) => {
        if (event.code === 'Space') {
            this.jumpPressed = true;
        }
    };

    keyup = (event) => {
        if (event.code === 'Space') {
            this.jumpPressed = false;
        }
    };

    touchstart = () => {
        this.jumpPressed = true;
    };

    touchend = () => {
        this.jumpPressed = false;
    };
    

    run(gameSpeed, frameTimeDelta) {
        if (this.runAnimationTimerVar <= 0) {
            if (this.image === this.dinoRunImages[0]) {
                this.image = this.dinoRunImages[1];
            }
            else {
                this.image = this.dinoRunImages[0];
            }
            this.runAnimationTimerVar = this.runAnimationTimerConst;
        }
        this.runAnimationTimerVar -= frameTimeDelta * gameSpeed;
    }

    jump(frameTimeDelta) {
        if (this.jumpPressed) {
            this.jumpProgressing = true;
        }

        if (this.jumpProgressing && !this.falling) {
            if ((this.y > this.canvas.height - this.minJumpHeight) || ((this.y > this.canvas.height - this.maxJumpHeight) && this.jumpPressed)) {
                this.y -= this.jumpSpeed * frameTimeDelta * this.scaleRatio;
            }
            else {
                this.falling = true;
            }
        }
        else {
            if (this.y < this.standingPosition) {
                this.y += this.gravity * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.standingPosition;
                }
            }
            else {
                this.falling = false;
                this.jumpProgressing = false;
            }
        }
    }

    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);
        this.jump(frameTimeDelta);
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this. width, this.height);
    }
}