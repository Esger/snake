import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SnakeService } from './snake-service';
import { ScreenService } from './screen-service';

@inject(EventAggregator, SnakeService, ScreenService)

export class TimingService {
    constructor(eventAggregator, snakeService, screenService) {
        this.ea = eventAggregator;
        this.snakeService = snakeService;
        this.screenService = screenService;

        this.crawling = false;
        this.steps = 0;
        this.speed = 1;
        this.fallTimerHandle = null;
        this.stepTimerHandle = null;
        this.pause = false;

        this.setSubscribers();
    }

    startGame() {
        this.resetIntervals();
        this.snakeService.initSnake(1);
        this.crawling = true;
        this.resumeGame();
    }

    resumeGame() {
        this.stepTimerHandle = setInterval(() => {
            this.drawScreen()
        }, this.stepInterval);
    }

    drawScreen() {
        this.steps += 1;
        let grow = (this.steps % this.growInterval == 0);
        this.snakeService.step(grow);
        this.screenService.fadeArena();
        this.screenService.drawSnake(this.snakeService.snake);
        (this.steps % this.speedupInterval == 0) && (this.speedUp());
        grow && this.ea.publish('grow', this.snakeService.snake.segments.length);
    }

    speedUp() {
        if (this.stepInterval > 40) {
            this.speed += 1;
            this.clearTimedEvents();
            this.stepInterval -= 40;
            this.resumeGame();
            this.ea.publish('speed', this.speed);
        }
    }

    dropSnake() {
        this.fallTimerHandle = setInterval(() => {
            this.snakeService.dropSnake();
            this.screenService.fadeArena();
            this.screenService.drawSnake(this.snakeService.snake);
        }, this.dropInterval);
    }

    clearTimedEvents() {
        clearInterval(this.stepTimerHandle);
        clearInterval(this.fallTimerHandle);
        // clearInterval(this.snackTimerHandle);
        // clearInterval(this.scoreTimerHandle);
    }

    pauseGame() {
        if (this.crawling) {
            this.pause = !this.pause;
            if (this.pause) {
                this.clearTimedEvents();
            } else {
                this.resumeGame();
            }
        }
    }

    restart() {
        if (!this.pause) {
            this.clearTimedEvents();
            this.startGame();
        }
    }

    setSubscribers() {
        let direction = 0;
        this.ea.subscribe('keyPressed', response => {
            switch (response) {
                case 'Enter': this.ea.publish('start');
                    break;
                case ' ': this.ea.publish('pause');
                    break;
            }
        });
        this.ea.subscribe('die', response => {
            this.clearTimedEvents();
            this.dropSnake();
        });
        this.ea.subscribe('start', response => {
            this.restart();
        });
        this.ea.subscribe('pause', response => {
            this.pauseGame();
        });
        this.ea.subscribe('gameOver', response => {
            this.clearTimedEvents();
        });

    }

    resetIntervals() {
        this.stepInterval = 400;
        this.scoreInterval = 10;
        this.growInterval = 10;
        this.speedupInterval = 10;
        this.dropInterval = 0;
        // this.snackInterval = 2500;
        this.speed = 1;
    }

}