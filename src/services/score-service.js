import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class ScoreService {
    constructor(eventAggregator, screenService) {
        this.ea = eventAggregator;
        this.multiplier = 1;
        this.score = 0;
    }

    update(amount) {
        (amount) && (this.score += amount * this.multiplier);
        this.ea.publish('score', this.score);
    }

    setMultiplier(factor) {
        if (factor) {
            this.multiplier = factor;
        } else {
            this.multiplier = 10;
        }
    }

    resetMultiplier() {
        this.multiplier = 1;
    }

    initScore() {
        this.score = 0;
    }

}