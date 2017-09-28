import {
    inject,
    bindable
} from 'aurelia-framework';

import $ from 'jquery';

export class App {

    constructor() {
        this.message = 'Snake by ashWare';
        this.stepTimerHandle = null;
        this.snake = {
            segments: []
        }
    }

    crawl() {
        this.stepTimerHandle = setInterval(() => {
            this.snake.segments[0].x++;
            this.drawSnake();
            this.drawSegment(this.snake.segments[0]);
        }, 100);
    }

    drawSnake() {
        for (let i = 0; i < this.snake.segments.length; i++) {
            let segment = this.snake.segments[i];
            this.drawSegment(segment);
        }
    }

    drawSegment(imgObj) {
        let ctx = this.ctx;
        let offsetX = -imgObj.img.clientWidth;
        let offsetY = -imgObj.img.clientHeight;
        ctx.save();
        ctx.translate(imgObj.x, imgObj.y);
        ctx.drawImage(imgObj.img, offsetX, offsetY);
        ctx.restore();
    }

    initSnake() {
        let canvasCenter = {
            x: parseInt(this.$arena.width() / 2, 10),
            y: parseInt(this.$arena.height() / 2, 10)
        };
        for (let i = 0; i < this.snakeImages.length; i++) {
            let $img = this.snakeImages[i];
            let segment = {
                img: $img[0],
                x: canvasCenter.x,
                y: canvasCenter.y
            }
            this.snake.segments.push(segment);
        }
    }

    setDomVars() {
        this.$arena = $('.arena');
        this.canvas = document.getElementById('arena');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.snakeImages = [
            $('.body'),
            $('.head'),
            $('.tail')
        ]
    }

    attached() {
        this.setDomVars();
        this.initSnake();
        $(() => {
            this.crawl();
        });
    }
}
