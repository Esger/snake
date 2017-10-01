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
    }

    addEventListeners() {
        this.ea.subscribe('speedup', response => {
            this.speed++;
        });
        this.ea.subscribe('grow', response => {
            this.length++;
        });

    }

    attached() {
        this.addEventListeners();
    }

}
