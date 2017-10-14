import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ScreenService } from './screen-service'
import { SnackService } from '../services/snack-service';

@inject(EventAggregator, ScreenService, SnackService)

export class SnakeService {
    constructor(eventAggregator, screenService, snackService) {
        this.ea = eventAggregator;
        this.screenService = screenService;
        this.snackService = snackService;
        this.snakeParts = [
            'head',
            'body',
            'tail'
        ];
        this.snake = {
            direction: 0,
            directions: [
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1],
                [0, 0]
            ],
            segments: [],
            deadSegments: []
        }
        this.snackMethods = {
            nope: () => {
                void (0);
            },
            axe: () => {
                this.cutSnake();
                this.ea.publish('snack', 'Axe: you lost half of your length');
            },
            beer: () => {
                this.ea.publish('snack', 'Beer: growing slower for 15 seconds');
            },
            bunny: () => {
                this.ea.publish('snack', 'Bunny: running faster for 15 seconds');
            },
            diamond: () => {
                this.ea.publish('snack', 'Diamond: you scored 10000 points');
            },
            gold: () => {
                this.ea.publish('snack', 'Gold: you scored 1000 points');
            },
            ruby: () => {
                this.ea.publish('snack', 'Ruby: score multiplier for 15 seconds');
            },
            skull: () => {
                this.ea.publish('snack', 'Skull: you die');
            },
            snail: () => {
                this.ea.publish('snack', 'Snail: running slower for 15 seconds');
            },
            trash: () => {
                this.ea.publish('snack', 'Trash: trash all extra&rsquo;s');
            },
            viagra: () => {
                this.ea.publish('snack', 'Viagra: growing harder for 15 seconds');
            }
        }
        this.setSubscribers();
    }

    step(grow) {
        // limit the rate at which turns are accepted
        (this.snake.turnSteps > 0) && this.snake.turnSteps--;
        this.advanceHead();
        (!grow) && (this.snake.segments.pop());
    }

    advanceHead() {
        let head = this.snake.segments[0].slice();
        head[0] += this.snake.directions[this.snake.direction][0] * this.snake.segmentSize;
        head[1] += this.snake.directions[this.snake.direction][1] * this.snake.segmentSize;
        this.snake.segments.unshift(head);
        this.hitWall();
        this.hitSnake();
        let method = this.snackService.hitSnack(head).toLowerCase();
        this.snackMethods[method]();
    }

    cutSnake() {
        let halfSnake = Math.floor(this.snake.segments.length / 2)
        this.snake.segments.splice(-halfSnake);
    }

    fallDown() {
        this.crawling = false;
        for (let i = 0; i < this.snake.segments.length; i++) {
            if (this.snake.deadSegments.indexOf(i) < 0) {
                let segment = this.snake.segments[i];
                let newY = (segment[1] + 1) * 1.05;
                if (newY <= this.screenService.limits.bottom) {
                    segment[1] = newY;
                } else {
                    this.snake.deadSegments.push(i);
                }
            }
            if (this.snake.deadSegments.length >= this.snake.segments.length) {
                this.ea.publish('gameOver');
            }
        }
    }

    hitWall() {
        let head = this.snake.segments[0];
        let wallHit =
            head[0] >= this.screenService.limits.right - this.halfSprite ||
            head[0] <= this.screenService.limits.left + this.halfSprite ||
            head[1] >= this.screenService.limits.bottom - this.halfSprite ||
            head[1] <= this.screenService.limits.top + this.halfSprite;
        wallHit && (this.ea.publish('die', 'You hit a wall'));
    }

    hitSnake() {
        let head = this.snake.segments[0];
        for (let i = 3; i < this.snake.segments.length - 1; i++) {
            let segment = this.snake.segments[i];
            if (this.samePosition(segment, head)) {
                this.ea.publish('die', 'You tried to bite yourself that&rsquo;s deadly');
                return true;
            }
        }
        return false;
    }

    samePosition(pos1, pos2) {
        return pos1[0] == pos2[0] && pos1[1] == pos2[1];
    }

    setSubscribers() {
        let direction = 0;
        this.ea.subscribe('keyPressed', response => {
            if (response.startsWith('Arrow') && this.snake.turnSteps == 0) {
                this.snake.turnSteps = 1;
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
                // prevent going in opposite direction
                (((direction + 2) % 4) !== this.snake.direction) && (this.snake.direction = direction);
            }
        });
    }

    setCenter() {
        this.center = this.screenService.canvasCenter;
    }

    minTurnSteps() {
        return Math.ceil(this.snake.segmentSize / this.snake.stepSize) + 1;
    }

    initSnake() {
        this.snake.segmentSize = this.screenService.spriteSize;
        this.halfSprite = Math.round(this.snake.segmentSize / 2);
        this.accelleration = 1.01;
        this.score = 0;
        this.snake.deadSegments = [];
        this.snake.stepSize = 16;
        this.snake.segments = [];
        this.snake.turnSteps = 0;
        let segment = [this.center.x, this.center.y];
        this.snake.segments.push(segment);
    }
}