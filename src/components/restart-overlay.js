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
        this.showOverlay = false;
        this.pause = false;
    }

    restart() {
        this.ea.publish('restart');
        this.showOverlay = false;
    }

    addEventListeners() {
        this.ea.subscribe('gameOver', response => {
            this.showOverlay = true;
        });
        this.ea.subscribe('restart', response => {
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
