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

    drawSnake(segments) {
        let ctx = this.ctx;
        segments.forEach((segment) => {
            ctx.save();
            ctx.translate(segment.position[0], segment.position[1]);
            (segment.type !== 1) && ctx.rotate(segment.direction * Math.PI / 2);
            ctx.drawImage(this.snakeImages[segment.type], -this.halfSprite, -this.halfSprite);
            ctx.restore();
        });
    }

    drawSnack(snack) {
        let ctx = this.ctx;
        ctx.save();
        // ctx.strokeStyle = 'goldenrod';
        // ctx.rect(snack.position[0], snack.position[1], this.snackSize, this.snackSize);
        // ctx.stroke();
        ctx.translate(snack.position[0], snack.position[1]);
        // snacks are 2x larger
        ctx.drawImage(this.snackImages[snack.index], 0, 0, this.snackSize, this.snackSize);
        ctx.restore();
    }

    drawSnacks() {
        this.snacks.onBoard.forEach((snack) => {
            gameScreen.drawSnack(snack);
        })
    }

    fadeArena() {
        let ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setDomVars($arena, snakeImages, snackImages) {
        this.canvas = $('#arena')[0];
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.wallSize = parseInt($arena.css('borderWidth'), 10);
        this.canvasCenter = {
            x: parseInt($arena.width() / 2, 10),
            y: parseInt($arena.height() / 2, 10)
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