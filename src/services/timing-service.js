import {
    inject
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class TimingService {
    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.pause = false;
        this.crawling = false;
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
        this.setSubscribers();
    }

    startGame() {
        // this.stepTimerHandle = setInterval(() => {
        //     this.stepNdraw();
        // }, this.stepInterval);
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
        this.crawling = true;
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
                this.startGame();
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
            this.initStuff();
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

    initStuff() {
        this.stepInterval = 10;
    }

    // gameScreen.fadeArena();
    // gameScreen.drawSnacks();

}