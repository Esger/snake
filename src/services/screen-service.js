import {
    inject
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class ScreenService {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.spriteSize = 16;
        this.halfSprite = this.spriteSize / 2;
        this.snackSize = 24;
        this.halfSnackSize = this.snackSize / 2;
        this.canvasCenter = {};
    }

    drawSnake(snake) {
        let type = 0;
        for (let i = 0; i < snake.segments.length; i++) {
            let segment = snake.segments[i];
            this.ctx.save();
            this.ctx.translate(segment[0], segment[1]);
            (segment.type !== 1) && this.ctx.rotate(snake.direction * Math.PI / 2);
            this.ctx.drawImage(this.snakeImages[type], -this.halfSprite, -this.halfSprite);
            this.ctx.restore();
            type = 1;
        }
    }

    drawSnacks(snacks) {
        for (let i = 0; i < snacks.length; i++) {
            let snack = snacks[i];
            this.ctx.save();
            this.ctx.translate(snack.position[0] - this.halfSnackSize, snack.position[1] - this.halfSnackSize);
            this.ctx.drawImage(this.snackImages[snack.nameIndex], 0, 0, this.snackSize, this.snackSize);
            this.ctx.restore();
        }
    }

    fadeArena() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    roundToSpriteSize(size) {
        return Math.floor(size / this.spriteSize) * this.spriteSize + this.halfSprite;
    }

    setDomVars($arena, snakeImages, snackImages) {
        this.canvas = $('#arena')[0];
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvasCenter = {
            x: this.roundToSpriteSize($arena.width() / 2),
            y: this.roundToSpriteSize($arena.height() / 2)
        };
        this.limits = {
            right: this.canvas.width,
            bottom: this.canvas.height,
            left: 0,
            top: 0
        };
        this.snakeImages = snakeImages;
        this.snackImages = snackImages;
    }

}