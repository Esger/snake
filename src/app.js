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
        let self = this;
        // setTimeout(function () {
        self.drawSegment(self.snake.segments[0]);
        self.stepTimerHandle = setInterval(function () {
            self.snake.segments[0].x++;
            self.drawSegment(self.snake.segments[0]);
        }, 100);
        // }, 100);
    }

    initSnake() {
        let canvasCenter = {
            x: parseInt(this.$arena.width() / 2, 10),
            y: parseInt(this.$arena.height() / 2, 10)
        };
        let head = {
            img: this.$head[0],
            x: canvasCenter.x,
            y: canvasCenter.y
        }
        this.snake.segments.push(head);
    }

    drawSegment(imgObj) {
        let ctx = this.canvas.getContext('2d');
        let offsetX = -imgObj.img.clientWidth;
        let offsetY = -imgObj.img.clientHeight;
        ctx.save();
        ctx.translate(imgObj.x, imgObj.y);
        ctx.drawImage(imgObj.img, offsetX, offsetY);
        ctx.restore();
    }

    setDomVars() {
        this.$arena = $('.arena');
        this.canvas = document.getElementById('arena');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.$head = $('.head');
    }

    attached() {
        let self = this;
        this.setDomVars();
        this.initSnake();
        $(function () {
            self.crawl();
        });
    }
}
