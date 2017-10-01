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
        this.accelleration = 1.01;
        this.message = 'Snake by ashWare';
        this.pause = false;
        this.crawling = false;
        this.spriteSize = 16;
        this.stepTimerHandle = null;
        this.fallTimerHandle = null;
        this.snake = {
            directions: [
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1],
                [0, 0]
            ],
            deadSegments: 0,
            growInterval: 10 * this.spriteSize,
            images: [],
            speedUpInterval: 100 * this.spriteSize,
            segments: [],
            stepInterval: 10,
            steps: 0,
            turnSteps: 0
        }
    }

    crawl() {
        this.stepTimerHandle = setInterval(() => {
            this.stepNdraw();
        }, this.snake.stepInterval);
        this.crawling = true;
    }

    fall() {
        this.snake.segments.forEach((segment) => {
            segment.direction = 1;
            segment.speedFactor = 1;
        });
        this.fallTimerHandle = setInterval(() => {
            this.fallNdraw();
        }, 0);
    }

    stepNdraw() {
        this.fadeArena();
        this.snake.steps++;
        // limit the rate at which turns are accepted
        (this.snake.turnSteps > 0) && this.snake.turnSteps--;
        (this.snake.steps % this.snake.growInterval == 0) && this.grow();
        (this.snake.steps % this.snake.speedUpInterval == 0) && this.speedup();
        this.snake.segments.forEach((segment, i) => {
            (i == 0) ? this.advanceSegment(i) : this.followSegment(i, i - 1);
            this.drawSegment(segment, i);
        });
        (this.hitSnake() || this.hitWall()) && this.die();
    }

    fallNdraw() {
        this.fadeArena();
        this.snake.segments.forEach((segment, i) => {
            (segment.direction < 4) && this.advanceSegment(i, true);
            this.drawSegment(segment, i);
            if (segment.direction < 4 && this.floorHit(segment)) {
                this.snake.deadSegments++;
                segment.direction = 4;
            }
        });
        if (this.snake.deadSegments >= this.snake.segments.length) {
            clearInterval(this.fallTimerHandle);
            this.keysOn();
            this.gameOver();
        }
    }

    floorHit(segment) {
        return segment.position[1] + this.spriteSize / 2 > this.canvas.height;
    }

    hitWall() {
        let head = this.snake.segments[0];
        let halfSprite = this.spriteSize / 2;
        return head.position[0] > this.canvas.width - halfSprite ||
            head.position[0] < 0 + halfSprite ||
            head.position[1] > this.canvas.height - halfSprite ||
            head.position[1] < 0 + halfSprite;
    }

    hitSnake() {
        let self = this;
        let head = this.snake.segments[0];
        function overlap(segPos, headPos) {
            let dx = Math.abs(segPos[0] - headPos[0]);
            let dy = Math.abs(segPos[1] - headPos[1]);
            let xOverlap = dx < self.spriteSize / 2;
            let yOverlap = dy < self.spriteSize / 2;
            return xOverlap && yOverlap;
        }
        for (let i = 1; i < this.snake.segments.length - 1; i++) {
            let segment = this.snake.segments[i];
            if (overlap(segment.position, head.position)) {
                return true;
            }
        }
        return false;
    }

    speedup() {
        if (this.snake.stepInterval > 0) {
            this.snake.stepInterval--;
        } else {
            this.snake.segments.forEach((segment) => {
                segment.speedFactor += 1;
            });
            this.snake.stepInterval = 7;
        }
        this.pauseGame();
        this.pauseGame();
        this.ea.publish('speedup');
    }

    die() {
        this.keysOff();
        this.crawling = false;
        clearInterval(this.stepTimerHandle);
        this.fall();
    }

    gameOver() {
        this.ea.publish('gameOver');
    }

    advanceSegment(i, accellerate) {
        let segment = this.snake.segments[i];
        (accellerate) && (segment.speedFactor *= this.accelleration);
        segment.position[0] += parseInt(this.snake.directions[segment.direction][0] * segment.speedFactor, 10);
        segment.position[1] += parseInt(this.snake.directions[segment.direction][1] * segment.speedFactor, 10);
    }

    followSegment(i, j) {
        let segment = this.snake.segments[i];
        let preceder = this.snake.segments[j];
        let dx = Math.abs(preceder.position[0] - segment.position[0]);
        let dy = Math.abs(preceder.position[1] - segment.position[1]);
        let axis = (segment.direction % 2 == 0) ? 'x' : 'y';
        if (preceder.direction !== segment.direction) {
            if (axis == 'x') {
                if (dx < this.spriteSize && dy > this.spriteSize) {
                    segment.direction = preceder.direction;
                    segment.position[0] = preceder.position[0];
                }
            } else {
                if (dy < this.spriteSize && dx > this.spriteSize) {
                    segment.direction = preceder.direction;
                    segment.position[1] = preceder.position[1];
                }
            }
        }
        this.advanceSegment(i);
    }

    grow() {
        let tail = this.snake.segments[this.snake.segments.length - 1];
        let dir = tail.direction;
        let factor = tail.speedFactor;
        let x = tail.position[0] - this.snake.directions[dir][0] * this.spriteSize;
        let y = tail.position[1] - this.snake.directions[dir][1] * this.spriteSize;
        this.snake.segments.push(this.segment(dir, factor, x, y));
        this.ea.publish('grow');
    }

    drawSegment(segment, i) {
        let ctx = this.ctx;
        let imageIndex = 1;
        switch (i) {
            case 0: imageIndex = 0;
                break;
            case this.snake.segments.length - 1: imageIndex = 2;
                break;
        }
        ctx.save();
        ctx.translate(segment.position[0], segment.position[1]);
        (imageIndex !== 1) && ctx.rotate(segment.direction * Math.PI / 2);
        ctx.drawImage(this.snake.images[imageIndex], -this.spriteSize / 2, -this.spriteSize / 2);
        ctx.restore();
    }

    fadeArena() {
        let ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setSubscribers() {
        let direction = 0;
        this.ea.subscribe('keyPressed', response => {
            if (response.startsWith('Arrow') && this.snake.turnSteps == 0) {
                this.snake.turnSteps = 17;
                switch (response) {
                    case 'ArrowRight': direction = 0;
                        break;
                    case 'ArrowDown': direction = 1;
                        break;
                    case 'ArrowLeft': direction = 2;
                        break;
                    case 'ArrowUp': direction = 3;
                        break;
                }
                (((direction + 2) % 4) !== this.snake.segments[0].direction) && (this.snake.segments[0].direction = direction);
            }
            switch (response) {
                case 'Enter': this.ea.publish('restart');
                    break;
                case ' ': if (this.crawling) { this.ea.publish('pause'); }
                    break;
            }
        });
        this.ea.subscribe('restart', response => {
            this.restart();
        });
        this.ea.subscribe('pause', response => {
            this.pauseGame();
        });
    }

    segment(direction, speedFactor, x, y) {
        return {
            direction: direction,
            position: [x, y],
            speedFactor: speedFactor
        }
    }

    pauseGame() {
        this.pause = !this.pause;
        if (this.pause) {
            clearInterval(this.stepTimerHandle);
            clearInterval(this.fallTimerHandle);
        } else {
            this.crawl();
        }
    }

    restart() {
        if (!this.pause) {
            clearInterval(this.stepTimerHandle);
            clearInterval(this.fallTimerHandle);
            this.initSnake();
            this.crawl();
        }
    }

    keysOn() {
        this.ea.publish('keysOn');
    }

    keysOff() {
        this.ea.publish('keysOff');
    }

    initSnake() {
        let canvasCenter = {
            x: parseInt(this.$arena.width() / 2, 10),
            y: parseInt(this.$arena.height() / 2, 10)
        };
        this.snake.segments = [];
        this.snake.deadSegments = 0;
        this.snake.stepInterval = 10;
        this.snake.steps = 0;
        this.snake.turnSteps = 0;
        this.snake.segments.push(this.segment(0, 1, canvasCenter.x, canvasCenter.y));
    }

    setDomVars() {
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
        }
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
