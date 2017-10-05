import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class GameScreenCustomElement {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
    }

}
