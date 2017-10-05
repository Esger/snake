import {
    inject
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class SnackService {
    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.snacks = {
            images: [],
            onBoard: [],
            methods: {
                'axe': 'cutSnake',
                'beer': 'growSlower',
                'bunny': 'speedup',
                'diamond': 'score100',
                'gold': 'score10',
                'ruby': 'scoreX10',
                'skull': 'die',
                'snail': 'slowdown',
                'trash': 'trashSnacks',
                'viagra': 'growHarder'
            }
        }

        this.setSubscribers();
    }

    newSnack(x, y, name, i) {
        let snack = {
            position: [x, y],
            name: name,
            index: i
        }
        return snack;
    }

    addSnack() {
        let snack = Math.floor(Math.random() * this.snacks.images.length);
        let name = this.snacks.images[snack].className;
        // compensate for border width (24);
        let x = Math.floor(Math.random() * this.canvas.width - 24) + 24;
        let y = Math.floor(Math.random() * this.canvas.height - 24) + 24;
        this.snacks.onBoard.push(this.newSnack(x, y, name, snack));
    }

    initStuff() {
        this.snacks.onBoard = [];
    }


}