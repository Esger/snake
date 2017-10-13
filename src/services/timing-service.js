import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SnakeService } from './snake-service';
import { SnackService } from './snack-service';
import { ScreenService } from './screen-service';

@inject(EventAggregator, SnakeService, SnackService, ScreenService)

export class TimingService {
    constructor(eventAggregator, snakeService, snackService, screenService) {
        this.ea = eventAggregator;
        this.snakeService = snakeService;
        this.snackService = snackService;
        this.screenService = screenService;

        this.crawling = false;
        this.steps = 0;
        this.speed = 1;
        this.fallTimerHandle = null;
        this.stepTimerHandle = null;
        this.pause = false;

        this.baseGrowInterval = 10;
        this.baseScoreInterval = 10;
        this.baseSnackInterval = 10;
        this.baseSpeedupInterval = 50;
        this.baseStepInterval = 400;
        this.dropInterval = 0;

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
        grow && this.ea.publish('grow', this.snakeService.snake.segments.length);
        (this.steps % this.speedupInterval == 0) && this.speedUp();
        (this.steps % this.snackInterval == 0) && this.snackService.addSnack();
        this.snakeService.step(grow);
        this.screenService.fadeArena();
        this.screenService.drawSnacks(this.snackService.snacks);
        this.screenService.drawSnake(this.snakeService.snake);
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

    growHarder() {
        if (this.growInterval > baseGrowInterval) {
            this.growInterval -= 2;
            setTimeout(() => {
                this.growInterval += 2;
            }, 15000);
        }
    }

    growSlower() {
        this.growInterval += 2;
        setTimeout(() => {
            this.growInterval -= 2;
        }, 15000);
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
        this.ea.subscribe('snack', response => {
            let method = response.split(':')[0];
            this[method].call();
        });

    }

    resetIntervals() {
        this.stepInterval = this.baseStepInterval;
        this.scoreInterval = this.baseSoreInterval;
        this.growInterval = this.baseGrowInterval;
        this.speedupInterval = this.baseSpeedupInterval;
        this.snackInterval = this.baseSnackInterval;
        this.speed = 1;
    }

}