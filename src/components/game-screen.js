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
        this.spriteSize = 16;
        // images with these names.jpg should exist in /images/..
        this.snakeParts = this.snakeService.snakeParts;
        this.snackNames = this.snackService.names;
        this.snacks = this.snackService.snacks;
    }

    roundToSpriteSize(size) {
        return Math.floor(size / this.spriteSize) * this.spriteSize;
    }

    snakeImage(index) {
        switch (index) {
            case 0: return 'head';
            case this.snakeService.snake.segments.length: return 'tail';
            default: return 'body';
        }
    }

    segmentCSS(index) {
        let segment = this.snakeService.snake.segments[index];
        let rotation = 0;
        if (index == 0) {
            rotation = this.snakeService.snake.direction * 90;
        }
        let css = 'left: ' + segment[0] + 'px; top:' + segment[1] + 'px; transform: rotate(' + rotation + 'deg);'
        return css;
    }

    snackPosition(index) {
        let snack = this.snackService.snacks[index];
        return {
            left: snack.position[0] + 'px',
            top: snack.position[1] + 'px'
        }
    }

    attached() {
        let self = this;
        this.$arena = $('.arena');
        let $body = $('body');
        let targetWidth = this.roundToSpriteSize($body.width() - 48);
        let targetHeight = this.roundToSpriteSize($body.height() - 48);
        this.$arena.width(targetWidth);
        this.$arena.height(targetHeight);
        this.screenService.setDomVars(this.$arena);
        this.snakeService.setCenter();
    }

}
