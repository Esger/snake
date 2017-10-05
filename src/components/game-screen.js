import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import { ScreenService } from '../services/screen-service'
import { SnakeService } from '../services/snake-service'

@inject(EventAggregator, ScreenService, SnakeService)

export class GameScreenCustomElement {

    constructor(eventAggregator, screenService, snakeService) {
        this.ea = eventAggregator;
        this.screenService = screenService;
        this.snakeService = snakeService;
        this.snakeImages = [];
        this.snackImages = [];
        // images with these names.jpg should exist in /images/..
        this.snakeParts = [
            'head',
            'body',
            'tail'
        ];
        this.snacks = [
            'axe',
            'beer',
            'bunny',
            'diamond',
            'gold',
            'ruby',
            'skull',
            'snail',
            'trash',
            'viagra'
        ]
    }

    attached() {
        let self = this;
        this.$arena = $('.arena');
        this.canvas = document.getElementById('arena');
        $('.snakeImages img').each(function () {
            self.snakeImages.push(this);
        });
        $('.snackImages img').each(function () {
            self.snackImages.push(this);
        });
        $(() => {
            this.screenService.setDomVars(this.$arena, this.canvas, this.snakeImages, this.snackImages)
            this.snakeService.setCenter();
        });
    }

}
