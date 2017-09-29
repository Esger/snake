import {
    inject,
    bindable
} from 'aurelia-framework';

import $ from 'jquery';

export class App {

    constructor() {
        this.message = 'Snake by ashWare';
        this.spriteSize = 16;
        this.stepTimerHandle = null;
        this.snake = {
            direction: 0,
            directions: [
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1]
            ],
            images: [],
            segments: [],
            stepInterval: 10
        }
    }

    crawl() {
        this.stepTimerHandle = setInterval(() => {
            this.drawSnake();
        }, this.snake.stepInterval);
    }

    drawSnake() {
        this.fadeArena();
        for (let i = 0; i < this.snake.segments.length; i++) {
            let segment = this.snake.segments[i];
            (i == 0) ? this.advanceSegment(i) : this.followSegment(i, i - 1);
            this.drawSegment(segment);
        }
    }

    advanceSegment(i) {
        this.snake.segments[i].position[0] += this.snake.directions[this.snake.direction][0];
        this.snake.segments[i].position[1] += this.snake.directions[this.snake.direction][1];
    }

    followSegment(i, j) {
        let segment = this.snake.segments[i];
        let preceder = this.snake.segments[j];
        let dx = preceder.position[0] - segment.position[0];
        if (dx !== 0) {
            let absDx = Math.abs(dx)
            let stepX = Math.round(absDx / dx);
            (absDx > this.spriteSize) ? segment.position[0] += stepX : null;
        }
    }

    drawSegment(imgObj) {
        let ctx = this.ctx;
        ctx.save();
        ctx.translate(imgObj.position[0], imgObj.position[1]);
        ctx.drawImage(this.snake.images[imgObj.imgIndex], this.spriteSize, this.spriteSize);
        ctx.restore();
    }

    fadeArena() {
        let ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initSnake() {
        let canvasCenter = {
            x: parseInt(this.$arena.width() / 2, 10),
            y: parseInt(this.$arena.height() / 2, 10)
        };
        for (let i = 0; i < this.snake.images.length; i++) {
            let $img = this.snake.images[i];
            let segment = {
                imgIndex: i,
                position: [canvasCenter.x, canvasCenter.y]
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
        this.snake.images = [
            $('.head')[0],
            $('.body')[0],
            $('.tail')[0]
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
