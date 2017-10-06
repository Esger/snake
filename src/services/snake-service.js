import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ScreenService } from './screen-service'

@inject(EventAggregator, ScreenService)

export class SnakeService {
    constructor(eventAggregator, screenService) {
        this.ea = eventAggregator;
        this.screenService = screenService;
        this.snakeParts = [
            'head',
            'body',
            'tail'
        ];
        this.snake = {
            directions: [
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1],
                [0, 0]
            ]
        }
        this.setSubscribers();
    }

    segment(direction, index, x, y) {
        return {
            direction: direction,
            index: index,
            position: [x, y],
            type: 2 // 'tail'
        }
    }

    allDown() {
        this.snake.stepSize = 1;
        this.snake.segments.forEach((segment) => {
            segment.direction = 1;
        });
    }

    step() {
        this.snake.steps += 1;
        // limit the rate at which turns are accepted
        (this.snake.turnSteps > 0) && this.snake.turnSteps--;
        this.snake.segments.forEach((segment, i) => {
            (i == 0) ? this.advanceSegment(i) : this.followSegment(i, i - 1);
        });
        // let snack = this.hitSnack();
        // call the function named with value of snack
        // (snack !== '') && this[snack]();
        // (this.hitSnake() || this.hitWall()) && this.die();
    }

    advanceSegment(i, accellerate) {
        let segment = this.snake.segments[i];
        // when falling accellerate = true
        (accellerate) && (this.snake.stepSize *= this.accelleration);
        segment.position[0] += parseInt(this.snake.directions[segment.direction][0] * this.snake.stepSize, 10);
        segment.position[1] += parseInt(this.snake.directions[segment.direction][1] * this.snake.stepSize, 10);
    }

    followSegment(i, j) {
        let segment = this.snake.segments[i];
        let preceder = this.snake.segments[j];
        let dx = Math.abs(preceder.position[0] - segment.position[0]);
        let dy = Math.abs(preceder.position[1] - segment.position[1]);
        let axis = (segment.direction % 2 == 0) ? 'x' : 'y';
        if (preceder.direction !== segment.direction) {
            if (axis == 'x') {
                if (dx < this.snake.segmentSize && dy > this.snake.segmentSize) {
                    segment.direction = preceder.direction;
                    segment.position[0] = preceder.position[0];
                }
            } else {
                if (dy < this.snake.segmentSize && dx > this.snake.segmentSize) {
                    segment.direction = preceder.direction;
                    segment.position[1] = preceder.position[1];
                }
            }
        }
        this.advanceSegment(i);
    }

    fallNdraw() {
        this.snake.segments.forEach((segment, i) => {
            (segment.direction < 4) && this.advanceSegment(i, true);
            if (segment.direction < 4 && this.hitFloor(segment)) {
                this.snake.deadSegments++;
                segment.direction = 4;
            }
        });

        // Where does this go?
        if (this.snake.deadSegments >= this.snake.segments.length) {
            // this.clearTimedEvents();
            // this.keysOn();
            this.gameOver();
        }
    }

    hitFloor(segment) {
        return segment.position[1] + this.halfSprite > this.canvas.height;
    }

    hitWall() {
        let head = this.snake.segments[0];
        let wallHit = head.position[0] > this.canvas.width - this.halfSprite ||
            head.position[0] < 0 + this.halfSprite ||
            head.position[1] > this.canvas.height - this.halfSprite ||
            head.position[1] < 0 + this.halfSprite;
        if (wallHit) {
            this.ea.publish('snack', 'You hit a wall');
            return wallHit;
        }
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
                this.ea.publish('snack', 'You tried to eat yourself that&rsquo;s deadly');
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
            let xOverlap = dx < (self.snackSize + self.snake.segmentSize) / 2;
            let yOverlap = dy < (self.snackSize + self.snake.segmentSize) / 2;
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
        this.ea.publish('snack', 'Axe: you lost half of your length');
    }

    growHarder() {
        if (this.growInterval > 500) {
            this.growInterval -= 500;
            this.restartIntervals();
            setTimeout(() => {
                this.growInterval += 500;
                this.restartIntervals();
            }, 15000);
            this.ea.publish('snack', 'Blue pill: growing harder for 15 seconds');
        }
    }
    growSlower() {
        this.growInterval += 500;
        this.restartIntervals();
        setTimeout(() => {
            this.growInterval -= 500;
            this.restartIntervals();
        }, 15000);
        this.ea.publish('snack', 'Beer: growing slower for 15 seconds');
    }
    score100() {
        this.scoreUpdate(1000);
        this.ea.publish('snack', 'Diamond: you scored 1000 points');
    }
    score10() {
        this.scoreUpdate(100);
        this.ea.publish('snack', 'Gold: you scored 100 points');
    }
    scoreX10() {
        if (this.scoreInterval > 250) {
            this.scoreInterval -= 250;
            setTimeout(() => {
                this.scoreInterval += 250;
            }, 15000);
            this.ea.publish('snack', 'Ruby: scoring faster for 15 seconds');
        }
    }
    trashSnacks() {
        this.snacks.onBoard = [];
        this.ea.publish('snack', 'Trash: you trashed all extra&rsquo;s');
    }

    speedup() {
        if (this.stepInterval > 0) {
            this.stepInterval -= 1;
            this.restartIntervals();
            this.ea.publish('speedChange', 1);
        }
        this.ea.publish('snack', 'Rabbit: running faster');
    }

    slowdown() {
        console.log('slowdown');
        if (this.stepInterval < 7) {
            this.stepInterval += 1;
            this.restartIntervals();
            this.ea.publish('speedChange', -1);
        }
        this.ea.publish('snack', 'Snail: running slower');
    }

    grow() {
        let lastSegment = this.snake.segments.length;
        let tail = this.snake.segments[lastSegment - 1];
        let dir = tail.direction;
        let x = tail.position[0] - this.snake.directions[dir][0] * this.snake.segmentSize;
        let y = tail.position[1] - this.snake.directions[dir][1] * this.snake.segmentSize;
        (lastSegment > 1) && (tail.type = 1); // body
        this.snake.segments.push(this.segment(dir, lastSegment, x, y));
        this.ea.publish('grow', this.snake.segments.length);
    }

    die() {
        this.keysOff();
        this.crawling = false;
        this.clearTimedEvents()
        this.fall();
    }

    scoreUpdate(amount) {
        if (amount) {
            this.score += amount;
        } else {
            this.score += this.snake.segments.length;
        }
        this.ea.publish('score', this.score);
    }

    gameOver() {
        this.ea.publish('gameOver');
    }

    setSubscribers() {
        let direction = 0;
        this.ea.subscribe('keyPressed', response => {
            if (response.startsWith('Arrow') && this.snake.turnSteps == 0) {
                this.snake.turnSteps = 5;
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
                (((direction + 2) % 4) !== this.snake.segments[0].direction) && (this.snake.segments[0].direction = direction);
            }
        });
    }

    setCenter() {
        this.center = this.screenService.canvasCenter;
    }

    initSnake() {
        this.accelleration = 1.01;
        this.score = 0;
        this.snake.segmentSize = this.screenService.spriteSize;
        this.snake.segments = [];
        this.snake.deadSegments = 0;
        this.snake.steps = 0;
        this.snake.stepSize = 4;
        this.snake.segments.push(this.segment(0, 0, this.center.x, this.center.y));
        this.snake.segments[0].index = 0;
        this.snake.segments[0].type = 0; // head
        this.snake.turnSteps = 0;
    }


}