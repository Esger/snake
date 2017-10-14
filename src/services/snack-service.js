import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ScreenService } from './screen-service'

@inject(EventAggregator, ScreenService)

export class SnackService {
    constructor(eventAggregator, screenService) {
        this.ea = eventAggregator;
        this.screenService = screenService;
        this.snacks = [];
        this.names = [
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

    newSnack(x, y, name, i) {
        let snack = {
            position: [x, y],
            name: name,
            nameIndex: i
        }
        return snack;
    }

    samePosition(pos1, pos2) {
        return pos1[0] == pos2[0] && pos1[1] == pos2[1];
    }

    hitSnack(head) {
        for (let i = 0; i < this.snacks.length - 1; i++) {
            let snack = this.snacks[i];
            if (this.samePosition(snack.position, head)) {
                this.removeSnack(i);
                return snack.name;
            }
        }
        return 'nope';
    }

    addSnack() {
        let randomIndex = Math.floor(Math.random() * this.names.length);
        let snack = this.names[randomIndex];
        let x = this.screenService.roundToSpriteSize(Math.floor(Math.random() * (this.screenService.limits.right - this.screenService.spriteSize)))
        let y = this.screenService.roundToSpriteSize(Math.floor(Math.random() * (this.screenService.limits.bottom - this.screenService.spriteSize)))
        this.snacks.push(this.newSnack(x, y, snack, randomIndex));
    }

    removeSnack(index) {
        this.snacks.splice(index, 1);
    }

    initSnacks() {
        this.snacks = [];
    }

}