import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import $ from 'jquery';
import { KeystrokeService } from './keystroke-service';

@inject(KeystrokeService, EventAggregator)

export class App {

    constructor(keystrokeService, eventAggregator) {
        this.keystrokeService = keystrokeService;
        this.ea = eventAggregator;
        this.message = 'Snake by ashWare';
        this.spriteSize = 16;
        this.stepTimerHandle = null;
        this.snake = {
            directions: [
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1]
            ],
            images: [],
            segments: [],
            stepInterval: 100
        }
    }

    crawl() {
        this.stepTimerHandle = setInterval(() => {
            this.stepNdraw();
        }, this.snake.stepInterval);
    }

    stepNdraw() {
        this.fadeArena();
        for (let i = 0; i < this.snake.segments.length; i++) {
            let segment = this.snake.segments[i];
            (i == 0) ? this.advanceSegment(i) : this.followSegment(i, i - 1);
            this.drawSegment(segment, i);
        }
    }

    advanceSegment(i) {
        let segment = this.snake.segments[i];
        segment.position[0] += this.snake.directions[segment.direction][0];
        segment.position[1] += this.snake.directions[segment.direction][1];
    }

    followSegment(i, j) {
        let segment = this.snake.segments[i];
        let preceder = this.snake.segments[j];
        let dx = preceder.position[0] - segment.position[0];
        let dy = preceder.position[1] - segment.position[1];
        if (dx !== 0) {
            let absDx = Math.abs(dx)
            let stepX = Math.round(absDx / dx);
            (absDx > this.spriteSize) ? segment.position[0] += stepX : null;
        }
        if (dy !== 0) {
            let absDy = Math.abs(dy)
            let stepY = Math.round(absDy / dy);
            (absDy > this.spriteSize) ? segment.position[1] += stepY : null;
        }
    }

    drawSegment(segment, i) {
        let ctx = this.ctx;
        let imageIndex = 1;
        switch (i) {
            case 0: imageIndex = 0;
                break;
            case this.snake.segments.length: imageIndex = 2;
                break;
        }
        ctx.save();
        ctx.translate(segment.position[0], segment.position[1]);
        ctx.rotate(segment.direction * Math.PI / 2);
        ctx.drawImage(this.snake.images[imageIndex], -this.spriteSize / 2, -this.spriteSize / 2);
        ctx.restore();
    }

    fadeArena() {
        let ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setSubscribers() {
        let head = this.snake.segments[0];
        this.ea.subscribe('keyPressed', response => {
            switch (response) {
                case 'ArrowRight': head.direction = 0;
                    break;
                case 'ArrowDown': head.direction = 1;
                    break;
                case 'ArrowLeft': head.direction = 2;
                    break;
                case 'ArrowUp': head.direction = 3;
                    break;
                default: null;
            }
        });
    }

    initSnake() {
        let canvasCenter = {
            x: parseInt(this.$arena.width() / 2, 10),
            y: parseInt(this.$arena.height() / 2, 10)
        };
        let segment = {
            direction: 0,
            position: [canvasCenter.x, canvasCenter.y]
        }
        this.snake.segments.push(segment);
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
        this.setSubscribers();
        $(() => {
            this.crawl();
        });
    }

}
