import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import { ScreenService } from '../services/screen-service';
import { SnakeService } from '../services/snake-service';
import { SnackService } from '../services/snack-service';

@inject(EventAggregator, ScreenService, SnakeService, SnackService)

export class GameScreenCustomElement {

    constructor(eventAggregator, screenService, snakeService, snackService) {
        this.ea = eventAggregator;
        this.screenService = screenService;
        this.snakeService = snakeService;
        this.snackService = snackService;
        this.snakeImages = [];
        this.snackImages = [];
        // images with these names.jpg should exist in /images/..
        this.snakeParts = this.snakeService.snakeParts;
        this.snacks = this.snackService.snacks;
    }

    attached() {
        let self = this;
        this.$arena = $('.arena');
        $('.snakeImages img').each(function () {
            self.snakeImages.push(this);
        });
        $('.snackImages img').each(function () {
            self.snackImages.push(this);
        });
        $(() => {
            this.screenService.setDomVars(this.$arena, this.snakeImages, this.snackImages);
            this.snakeService.setCenter();
        });
    }

}
