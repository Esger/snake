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
        this.halfSprite = this.spriteSize / 2;
        this.snackSize = 24;
        this.halfSnackSize = this.snackSize / 2;
        this.stepTimerHandle = null;
        this.scoreTimerHandle = null;
        this.fallTimerHandle = null;
        this.growTimerHandle = null;
        this.speedupTimerHandle = null;
        this.snackTimerHandle = null;
        this.stepInterval = 10;
        this.scoreInterval = 1000;
        this.growInterval = 3000;
        this.speedupInterval = 10000;
        this.snackInterval = 2500;
        this.score = 0;
        this.snacks = {
            images: [],
            onBoard: [],
            methods: {
                'axe': 'cutSnake',
                'beer': 'growSlower',
                'bunny': 'speedup',
                'diamond': 'score100',
                'gold': 'score10',
                'ruby': 'scoreX10',
                'skull': 'die',
                'snail': 'slowdown',
                'trash': 'trashSnacks',
                'viagra': 'growHarder'
            }
        }
        this.snake = {
            images: [],
            segments: [],
            directions: [
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1],
                [0, 0]
            ],
            steps: 0,
            turnSteps: 0,
            deadSegments: 0
        }
    }

    crawl() {
        this.stepTimerHandle = setInterval(() => {
            this.stepNdraw();
        }, this.stepInterval);
        this.growTimerHandle = setInterval(() => {
            this.grow();
        }, this.growInterval);
        this.speedupTimerHandle = setInterval(() => {
            this.speedup();
        }, this.speedupInterval);
        this.snackTimerHandle = setInterval(() => {
            this.addSnack();
        }, this.snackInterval);
        this.scoreTimerHandle = setInterval(() => {
            this.scoreUpdate();
        }, this.scoreInterval);
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
        this.drawSnacks();
        this.snake.steps += 1;
        // limit the rate at which turns are accepted
        (this.snake.turnSteps > 0) && this.snake.turnSteps--;
        this.snake.segments.forEach((segment, i) => {
            (i == 0) ? this.advanceSegment(i) : this.followSegment(i, i - 1);
            this.drawSegment(segment, i);
        });
        let snack = this.hitSnack();
        // call the function named with value of snack
        (snack !== '') && this[snack]();
        (this.hitSnake() || this.hitWall()) && this.die();
    }

    fallNdraw() {
        this.fadeArena();
        this.snake.segments.forEach((segment, i) => {
            (segment.direction < 4) && this.advanceSegment(i, true);
            this.drawSegment(segment, i);
            if (segment.direction < 4 && this.hitFloor(segment)) {
                this.snake.deadSegments++;
                segment.direction = 4;
            }
        });
        if (this.snake.deadSegments >= this.snake.segments.length) {
            this.clearTimedEvents();
            this.keysOn();
            this.gameOver();
        }
    }

    hitFloor(segment) {
        return segment.position[1] + this.halfSprite > this.canvas.height;
    }

    hitWall() {
        let head = this.snake.segments[0];
        return head.position[0] > this.canvas.width - this.halfSprite ||
            head.position[0] < 0 + this.halfSprite ||
            head.position[1] > this.canvas.height - this.halfSprite ||
            head.position[1] < 0 + this.halfSprite;
    }

    hitSnake() {
        let self = this;
        let head = this.snake.segments[0];
        function overlap(segPos, headPos) {
            let dx = Math.abs(segPos[0] - headPos[0]);
            let dy = Math.abs(segPos[1] - headPos[1]);
            let xOverlap = dx < self.halfSprite;
            let yOverlap = dy < self.halfSprite;
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

    hitSnack() {
        let self = this;
        let head = this.snake.segments[0];
        function overlap(snackPos, headPos) {
            let dx = Math.abs(snackPos[0] - headPos[0]);
            let dy = Math.abs(snackPos[1] - headPos[1]);
            let xOverlap = dx < (self.snackSize + self.spriteSize) / 2;
            let yOverlap = dy < (self.snackSize + self.spriteSize) / 2;
            return xOverlap && yOverlap;
        }
        for (let i = 0; i < this.snacks.onBoard.length - 1; i++) {
            let snack = this.snacks.onBoard[i];
            if (overlap(snack.position, head.position)) {
                (i > -1) && this.snacks.onBoard.splice(i, 1);
                return this.snacks.methods[snack.name];
            }
        }
        return '';
    }

    cutSnake() {
        let halfSnake = Math.floor(this.snake.segments.length / 2)
        this.snake.segments.splice(-halfSnake);
    }

    growSlower() {
        console.log('growSlower');
    }
    score100() {
        console.log('score100');
    }
    score10() {
        console.log('score10');
    }
    scoreX10() {
        console.log('scoreX10');
    }
    trashSnacks() {
        this.snacks.onBoard = [];
    }
    growHarder() {
        console.log('growHarder');
    }

    speedup() {
        if (this.stepInterval > 0) {
            this.stepInterval -= 1;
            this.pauseGame();
            this.pauseGame();
        } else {
            this.snake.segments.forEach((segment) => {
                segment.speedFactor += 1;
            });
            this.stepInterval = 7;
        }
        this.ea.publish('speedChange', 1);
    }

    slowdown() {
        console.log('slowdown');
        if (this.snake.segments[0].speedFactor > 1) {
            this.snake.segments.forEach((segment) => {
                segment.speedFactor -= 1;
            });
            this.ea.publish('speedChange', -7);
        } else {
            if (this.stepInterval < 7) {
                this.stepInterval += 1;
                this.pauseGame();
                this.pauseGame();
                this.ea.publish('speedChange', -1);
            }
        }
    }

    grow() {
        let tail = this.snake.segments[this.snake.segments.length - 1];
        let dir = tail.direction;
        let factor = tail.speedFactor;
        let x = tail.position[0] - this.snake.directions[dir][0] * this.spriteSize;
        let y = tail.position[1] - this.snake.directions[dir][1] * this.spriteSize;
        this.snake.segments.push(this.segment(dir, factor, x, y));
        this.ea.publish('grow', this.snake.segments.length);
    }

    die() {
        this.keysOff();
        this.crawling = false;
        clearInterval(this.stepTimerHandle);
        this.fall();
    }

    scoreUpdate() {
        this.score += this.snake.segments.length;
        this.ea.publish('score', this.score);
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

    newSnack(x, y, name, i) {
        let snack = {
            position: [x, y],
            name: name,
            index: i
        }
        return snack;
    }

    addSnack() {
        let snack = Math.floor(Math.random() * this.snacks.images.length);
        let name = this.snacks.images[snack].className;
        // compensate for border width (24);
        let x = Math.floor(Math.random() * this.canvas.width - 24) + 24;
        let y = Math.floor(Math.random() * this.canvas.height - 24) + 24;
        this.snacks.onBoard.push(this.newSnack(x, y, name, snack));
    }

    drawSnacks() {
        let ctx = this.ctx;
        this.snacks.onBoard.forEach((snack) => {
            ctx.save();
            ctx.translate(snack.position[0], snack.position[1]);
            // snacks are 2x larger
            ctx.drawImage(this.snacks.images[snack.index], -this.halfSnackSize, -this.halfSnackSize, this.snackSize, this.snackSize);
            ctx.restore();
        })
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
        ctx.drawImage(this.snake.images[imageIndex], -this.halfSprite, -this.halfSprite);
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

    clearTimedEvents() {
        clearInterval(this.stepTimerHandle);
        clearInterval(this.fallTimerHandle);
        clearInterval(this.growTimerHandle);
        clearInterval(this.speedupTimerHandle);
        clearInterval(this.snackTimerHandle);
        clearInterval(this.scoreTimerHandle);
    }

    pauseGame() {
        this.pause = !this.pause;
        if (this.pause) {
            this.clearTimedEvents();
        } else {
            this.crawl();
        }
    }

    restart() {
        if (!this.pause) {
            this.clearTimedEvents();
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
        this.stepInterval = 10;
        this.snake.steps = 0;
        this.snake.turnSteps = 0;
        this.snake.segments.push(this.segment(0, 1, canvasCenter.x, canvasCenter.y));
        this.snacks.onBoard = [];
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
        this.snacks.images = [
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
