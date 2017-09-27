import {
    inject,
    bindable
} from 'aurelia-framework';

import $ from 'jquery';

export class App {

    constructor() {
        this.message = 'Snake by ashWare';
        this.$arena = $('.arena');
        this.snake = {
            segments: []
        }
        this.initSnake();
    }

    initSnake() {
        let self = this;
        let canvasCenter = {
            x: self.$arena.width(),
            y: self.$arena.height()
        };
        let head = {
            img: '/images/head.png',
            x: canvasCenter.x,
            y: canvasCenter.y
        }
    }
}
