export default class CactusController {
    constructor(ctx, cactusImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.cactusImages = cactusImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
    }
}