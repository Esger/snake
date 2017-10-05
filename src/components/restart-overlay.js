import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class RestartOverlayCustomElement {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.showOverlay = true;
        this.firstGame = true;
        this.pause = false;
    }

    start() {
        this.ea.publish('start');
        this.showOverlay = false;
        this.firstGame = false;
    }

    addEventListeners() {
        this.ea.subscribe('gameOver', response => {
            this.showOverlay = true;
        });
        this.ea.subscribe('start', response => {
            this.showOverlay = false;
        });
        this.ea.subscribe('pause', response => {
            this.pause = !this.pause;
        });
    }

    attached() {
        this.addEventListeners();
    }

}
