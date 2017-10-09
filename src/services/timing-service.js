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
        this.stepSize = 1;
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
        this.snakeService.step();
        this.screenService.fadeArena();
        this.screenService.drawSnake(this.snakeService.snake);
        (this.steps % this.growInterval == 0) && (this.snakeService.grow());
        (this.steps % this.speedupInterval == 0) && (this.speedUp());
    }

    speedUp() {
        if (this.stepSize <= 16) {
            this.stepSize = this.snakeService.doubleSpeed();
            this.clearTimedEvents();
            this.stepInterval += 20;
            this.resumeGame();
            this.ea.publish('speedChange', this.stepSize);
        }
    }

    // fall() {
    //     this.fallTimerHandle = setInterval(() => {
    //         this.fallNdraw();
    //     }, 0);
    // }

    clearTimedEvents() {
        clearInterval(this.stepTimerHandle);
        clearInterval(this.growTimerHandle);
        clearInterval(this.speedupTimerHandle);
        // clearInterval(this.fallTimerHandle);
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
        this.ea.subscribe('start', response => {
            this.restart();
        });
        this.ea.subscribe('pause', response => {
            this.pauseGame();
        });
    }

    resetIntervals() {
        this.stepInterval = 20;
        this.scoreInterval = 10;
        this.growInterval = 30;
        this.speedupInterval = 100;
        // this.snackInterval = 2500;
        this.speed = 0;
    }

}