import {
    inject
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class KeystrokeService {
    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.acceptMoves = true;
        this.keys = {
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40
        };
        this.myKeypressCallback = this.keypressInput.bind(this);
        this.setSubscribers();
    }

    keysOff() {
        this.acceptMoves = false;
    }

    keysOn() {
        this.acceptMoves = true;
    }

    setSubscribers() {
        document.addEventListener('keydown', this.myKeypressCallback, false);
        this.ea.subscribe('keysOff', response => {
            this.keysOff();
        });
        this.ea.subscribe('keysOn', response => {
            this.keysOn();
        });
    }

    // This function is called by the aliased method
    keypressInput(e) {
        // console.log(e);
        let keycode = event.key; // also for cross-browser compatible
        this.ea.publish('keyPressed', keycode);
    }
}