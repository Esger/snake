import {
    inject
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class ScreenService {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.spriteSize = 16;
        this.halfSprite = this.spriteSize / 2;
        this.snackSize = 24;
        this.halfSnackSize = this.snackSize / 2;
        this.canvasCenter = {};
    }

    roundToSpriteSize(size) {
        return Math.floor(size / this.spriteSize) * this.spriteSize;
    }

    setDomVars($arena) {
        this.canvas = $('#arena')[0];
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvasCenter = {
            x: this.roundToSpriteSize($arena.width() / 2),
            y: this.roundToSpriteSize($arena.height() / 2)
        };
        this.limits = {
            right: this.canvas.width,
            bottom: this.canvas.height,
            left: 0,
            top: 0
        };
    }

}