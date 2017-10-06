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
        // this.fallTimerHandle = null;
        // this.growTimerHandle = null;
        // this.scoreTimerHandle = null;
        // this.stepTimerHandle = null;
        this.pause = false;
        // this.snackTimerHandle = null;
        this.speed = 0;
        // this.speedupTimerHandle = null;

        this.setSubscribers();
    }

    startGame() {
        this.resetIntervals();
        this.snakeService.initSnake();
        this.resumeGame();
        // this.snackTimerHandle = setInterval(() => {
        //     this.addSnack();
        // }, this.snackInterval);
        // this.scoreTimerHandle = setInterval(() => {
        //     this.scoreUpdate();
        // }, this.scoreInterval);
    }

    resumeGame() {
        this.crawl();
        this.grow();
        // this.speedUp();
        this.drawScreen();
    }

    drawScreen() {
        this.screenService.fadeArena();
        this.screenService.drawSnake(this.snakeService.snake.segments);
        this.animationHandle = requestAnimationFrame(() => { this.drawScreen() });
    }

    crawl() {
        this.crawling = true;
        this.stepTimerHandle = setInterval(() => {
            this.snakeService.step();
        }, this.stepInterval);
    }

    grow() {
        this.growTimerHandle = setInterval(() => {
            this.snakeService.grow();
        }, this.growInterval);
    }

    // speedUp() {
    //     this.speedupTimerHandle = setInterval(() => {
    //         if (this.stepInterval > 0) {
    //             this.speed += 1;
    //             this.stepInterval -= 1;
    //             this.clearTimedEvents();
    //             this.resumeGame();
    //             this.ea.publish('speedChange', this.speed);
    //         }
    //     }, this.speedupInterval);
    // }

    // fall() {
    //     this.fallTimerHandle = setInterval(() => {
    //         this.fallNdraw();
    //     }, 0);
    // }

    clearTimedEvents() {
        cancelAnimationFrame(this.drawScreen);
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
        this.stepInterval = 40;
        this.scoreInterval = 1000;
        this.growInterval = 3000;
        this.speedupInterval = 1000;
        this.snackInterval = 2500;
        this.speed = 0;
    }

}