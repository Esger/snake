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
        this.resetVars();
    }

    addEventListeners() {
        this.ea.subscribe('speed', response => {
            this.speed = response;
        });
        this.ea.subscribe('grow', response => {
            this.length = response;
        });
        this.ea.subscribe('start', response => {
            this.resetVars();
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
        this.ea.subscribe('die', response => {
            this.snack = response;
        });

    }

    resetVars() {
        this.speed = 0;
        this.length = 1;
        this.score = 0;
        this.snack = '';
    }

    attached() {
        this.addEventListeners();
    }

}
