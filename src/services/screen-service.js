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
        this.setSubscribers();
    }

    drawSegment(segment) {
        let ctx = this.ctx;
        ctx.save();
        ctx.translate(segment.position[0], segment.position[1]);
        (segment.type !== 1) && ctx.rotate(segment.direction * Math.PI / 2);
        ctx.drawImage(this.snakeImages[segment.type], -this.halfSprite, -this.halfSprite);
        ctx.restore();
    }

    drawSnack(snack) {
        let ctx = this.ctx;
        ctx.save();
        // ctx.strokeStyle = 'goldenrod';
        // ctx.rect(snack.position[0], snack.position[1], this.snackSize, this.snackSize);
        // ctx.stroke();
        ctx.translate(snack.position[0], snack.position[1]);
        // snacks are 2x larger
        ctx.drawImage(this.snacksImages[snack.index], 0, 0, this.snackSize, this.snackSize);
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

    attached() {
        this.$arena = $('.arena');
        this.canvas = document.getElementById('arena');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.wallSize = parseInt(this.$arena.css('borderWidth'), 10);
        this.limits = {
            right: this.canvas.width - this.wallSize,
            bottom: this.canvas.height - this.wallSize,
            left: this.wallSize,
            top: this.wallSize
        };
        this.spriteSize = 16;
        this.halfSprite = this.spriteSize / 2;
        this.snackSize = 24;
        this.halfSnackSize = this.snackSize / 2;
        this.snakeImages = [
            $('.head')[0],
            $('.body')[0],
            $('.tail')[0]
        ];
        this.snacksImages = [
            $('.axe')[0],
            $('.beer')[0],
            $('.bunny')[0],
            $('.diamond')[0],
            $('.gold')[0],
            $('.ruby')[0],
            $('.skull')[0],
            $('.snail')[0],
            $('.trash')[0],
            $('.viagra')[0]
        ];
    }
}