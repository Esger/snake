import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import $ from 'jquery';
import { KeystrokeService } from './services/keystroke-service';
import { TimingService } from './services/timing-service';

@inject(KeystrokeService, TimingService, EventAggregator)

export class App {

    constructor(keystrokeService, timingService, eventAggregator) {
        this.keystrokeService = keystrokeService;
        this.timingService = timingService;
        this.ea = eventAggregator;
        this.message = 'Snake by ashWare';
    }

}
