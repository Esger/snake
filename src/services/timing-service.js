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

        this.pause = false;
        this.crawling = false;
        this.stepTimerHandle = null;
        this.scoreTimerHandle = null;
        this.fallTimerHandle = null;
        this.growTimerHandle = null;
        this.speedupTimerHandle = null;
        this.snackTimerHandle = null;
        this.setSubscribers();
    }

    startGame() {
        this.resetIntervals();
        this.snakeService.initSnake();
        this.crawl();
        // this.growTimerHandle = setInterval(() => {
        //     this.grow();
        // }, this.growInterval);
        // this.speedupTimerHandle = setInterval(() => {
        //     this.speedup();
        // }, this.speedupInterval);
        // this.snackTimerHandle = setInterval(() => {
        //     this.addSnack();
        // }, this.snackInterval);
        // this.scoreTimerHandle = setInterval(() => {
        //     this.scoreUpdate();
        // }, this.scoreInterval);
    }

    crawl() {
        this.crawling = true;
        this.stepTimerHandle = setInterval(() => {
            this.snakeService.step();
            this.screenService.fadeArena();
            this.screenService.drawSnake(this.snakeService.snake.segments);
        }, this.stepInterval);
    }

    fall() {
        this.fallTimerHandle = setInterval(() => {
            this.fallNdraw();
        }, 0);
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
        if (this.crawling) {
            this.pause = !this.pause;
            if (this.pause) {
                this.clearTimedEvents();
            } else {
                this.crawl();
            }
        }
    }

    restartIntervals() {
        this.clearTimedEvents();
        this.crawl();
    }

    restart() {
        if (!this.pause) {
            this.clearTimedEvents();
            this.resetIntervals();
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
        this.stepInterval = 10;
        this.scoreInterval = 1000;
        this.growInterval = 3000;
        this.speedupInterval = 10000;
        this.snackInterval = 2500;
    }

}