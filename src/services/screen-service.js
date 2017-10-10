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
        for (var i = 0; i < snake.segments.length; i++) {
            let segment = snake.segments[i];
            this.ctx.save();
            this.ctx.translate(segment[0], segment[1]);
            (segment.type !== 1) && this.ctx.rotate(snake.direction * Math.PI / 2);
            this.ctx.drawImage(this.snakeImages[type], -this.halfSprite, -this.halfSprite);
            this.ctx.restore();
            type = 1;
        }
    }

    drawSnack(snack) {
        this.ctx.save();
        // ctx.strokeStyle = 'goldenrod';
        // ctx.rect(snack.position[0], snack.position[1], this.snackSize, this.snackSize);
        // ctx.stroke();
        this.ctx.translate(snack.position[0], snack.position[1]);
        // snacks are 2x larger
        this.ctx.drawImage(this.snackImages[snack.index], 0, 0, this.snackSize, this.snackSize);
        this.ctx.restore();
    }

    drawSnacks() {
        this.snacks.onBoard.forEach((snack) => {
            gameScreen.drawSnack(snack);
        })
    }

    fadeArena() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    roundToSpriteSize(size) {
        return Math.floor(size / this.spriteSize) * this.spriteSize;
    }

    setDomVars($arena, snakeImages, snackImages) {
        this.canvas = $('#arena')[0];
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.roundToSpriteSize(this.canvas.clientWidth);
        this.canvas.height = this.roundToSpriteSize(this.canvas.clientHeight);
        this.wallSize = parseInt($arena.css('borderWidth'), 10);
        this.canvasCenter = {
            x: this.roundToSpriteSize($arena.width() / 2),
            y: this.roundToSpriteSize($arena.height() / 2)
        };
        this.limits = {
            right: this.canvas.width - this.wallSize,
            bottom: this.canvas.height - this.wallSize,
            left: this.wallSize,
            top: this.wallSize
        };
        this.snakeImages = snakeImages;
        this.snackImages = snackImages;
    }

}