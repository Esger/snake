import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class StatusCustomElement {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.speed = 0;
        this.length = 1;
        this.score = 0;
        this.snack = '';
    }

    addEventListeners() {
        this.ea.subscribe('speedChange', response => {
            this.speed += response;
        });
        this.ea.subscribe('grow', response => {
            this.length = response;
        });
        this.ea.subscribe('restart', response => {
            this.length = 1;
            this.speed = 0;
        });
        this.ea.subscribe('score', response => {
            this.score = response;
        });
        this.ea.subscribe('snack', response => {
            this.snack = response;
            setTimeout(() => {
                this.snack = '';
            }, 15000);
        });

    }

    attached() {
        this.addEventListeners();
    }

}
