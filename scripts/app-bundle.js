define('app',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'jquery', './keystroke-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _jquery, _keystrokeService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = undefined;

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_keystrokeService.KeystrokeService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function App(keystrokeService, eventAggregator) {
            _classCallCheck(this, App);

            this.keystrokeService = keystrokeService;
            this.ea = eventAggregator;
            this.accelleration = 1.01;
            this.message = 'Snake by ashWare';
            this.pause = false;
            this.crawling = false;
            this.spriteSize = 16;
            this.halfSprite = this.spriteSize / 2;
            this.snackSize = 24;
            this.halfSnackSize = this.snackSize / 2;
            this.stepTimerHandle = null;
            this.scoreTimerHandle = null;
            this.fallTimerHandle = null;
            this.growTimerHandle = null;
            this.speedupTimerHandle = null;
            this.snackTimerHandle = null;
            this.stepInterval = 10;
            this.scoreInterval = 1000;
            this.growInterval = 3000;
            this.speedupInterval = 10000;
            this.snackInterval = 2500;
            this.score = 0;
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
            };
            this.snake = {
                images: [],
                segments: [],
                directions: [[1, 0], [0, 1], [-1, 0], [0, -1], [0, 0]],
                steps: 0,
                turnSteps: 0,
                deadSegments: 0
            };
        }

        App.prototype.crawl = function crawl() {
            var _this = this;

            this.stepTimerHandle = setInterval(function () {
                _this.stepNdraw();
            }, this.stepInterval);
            this.growTimerHandle = setInterval(function () {
                _this.grow();
            }, this.growInterval);
            this.speedupTimerHandle = setInterval(function () {
                _this.speedup();
            }, this.speedupInterval);
            this.snackTimerHandle = setInterval(function () {
                _this.addSnack();
            }, this.snackInterval);
            this.scoreTimerHandle = setInterval(function () {
                _this.scoreUpdate();
            }, this.scoreInterval);
            this.crawling = true;
        };

        App.prototype.fall = function fall() {
            var _this2 = this;

            this.snake.segments.forEach(function (segment) {
                segment.direction = 1;
                segment.speedFactor = 1;
            });
            this.fallTimerHandle = setInterval(function () {
                _this2.fallNdraw();
            }, 0);
        };

        App.prototype.stepNdraw = function stepNdraw() {
            var _this3 = this;

            this.fadeArena();
            this.drawSnacks();
            this.snake.steps += 1;

            this.snake.turnSteps > 0 && this.snake.turnSteps--;
            this.snake.segments.forEach(function (segment, i) {
                i == 0 ? _this3.advanceSegment(i) : _this3.followSegment(i, i - 1);
                _this3.drawSegment(segment, i);
            });
            var snack = this.hitSnack();

            snack !== '' && this[snack]();
            (this.hitSnake() || this.hitWall()) && this.die();
        };

        App.prototype.fallNdraw = function fallNdraw() {
            var _this4 = this;

            this.fadeArena();
            this.snake.segments.forEach(function (segment, i) {
                segment.direction < 4 && _this4.advanceSegment(i, true);
                _this4.drawSegment(segment, i);
                if (segment.direction < 4 && _this4.hitFloor(segment)) {
                    _this4.snake.deadSegments++;
                    segment.direction = 4;
                }
            });
            if (this.snake.deadSegments >= this.snake.segments.length) {
                this.clearTimedEvents();
                this.keysOn();
                this.gameOver();
            }
        };

        App.prototype.hitFloor = function hitFloor(segment) {
            return segment.position[1] + this.halfSprite > this.canvas.height;
        };

        App.prototype.hitWall = function hitWall() {
            var head = this.snake.segments[0];
            return head.position[0] > this.canvas.width - this.halfSprite || head.position[0] < 0 + this.halfSprite || head.position[1] > this.canvas.height - this.halfSprite || head.position[1] < 0 + this.halfSprite;
        };

        App.prototype.hitSnake = function hitSnake() {
            var self = this;
            var head = this.snake.segments[0];
            function overlap(segPos, headPos) {
                var dx = Math.abs(segPos[0] - headPos[0]);
                var dy = Math.abs(segPos[1] - headPos[1]);
                var xOverlap = dx < self.halfSprite;
                var yOverlap = dy < self.halfSprite;
                return xOverlap && yOverlap;
            }
            for (var i = 1; i < this.snake.segments.length - 1; i++) {
                var segment = this.snake.segments[i];
                if (overlap(segment.position, head.position)) {
                    return true;
                }
            }
            return false;
        };

        App.prototype.hitSnack = function hitSnack() {
            var self = this;
            var head = this.snake.segments[0];
            function overlap(snackPos, headPos) {
                var dx = Math.abs(snackPos[0] - headPos[0]);
                var dy = Math.abs(snackPos[1] - headPos[1]);
                var xOverlap = dx < (self.snackSize + self.spriteSize) / 2;
                var yOverlap = dy < (self.snackSize + self.spriteSize) / 2;
                return xOverlap && yOverlap;
            }
            for (var i = 0; i < this.snacks.onBoard.length - 1; i++) {
                var snack = this.snacks.onBoard[i];
                if (overlap(snack.position, head.position)) {
                    i > -1 && this.snacks.onBoard.splice(i, 1);
                    return this.snacks.methods[snack.name];
                }
            }
            return '';
        };

        App.prototype.cutSnake = function cutSnake() {
            var halfSnake = Math.floor(this.snake.segments.length / 2);
            this.snake.segments.splice(-halfSnake);
        };

        App.prototype.growSlower = function growSlower() {
            console.log('growSlower');
        };

        App.prototype.score100 = function score100() {
            console.log('score100');
        };

        App.prototype.score10 = function score10() {
            console.log('score10');
        };

        App.prototype.scoreX10 = function scoreX10() {
            console.log('scoreX10');
        };

        App.prototype.trashSnacks = function trashSnacks() {
            this.snacks.onBoard = [];
        };

        App.prototype.growHarder = function growHarder() {
            console.log('growHarder');
        };

        App.prototype.speedup = function speedup() {
            if (this.stepInterval > 0) {
                this.stepInterval -= 1;
                this.pauseGame();
                this.pauseGame();
            } else {
                this.snake.segments.forEach(function (segment) {
                    segment.speedFactor += 1;
                });
                this.stepInterval = 7;
            }
            this.ea.publish('speedChange', 1);
        };

        App.prototype.slowdown = function slowdown() {
            console.log('slowdown');
            if (this.snake.segments[0].speedFactor > 1) {
                this.snake.segments.forEach(function (segment) {
                    segment.speedFactor -= 1;
                });
                this.ea.publish('speedChange', -7);
            } else {
                if (this.stepInterval < 7) {
                    this.stepInterval += 1;
                    this.pauseGame();
                    this.pauseGame();
                    this.ea.publish('speedChange', -1);
                }
            }
        };

        App.prototype.grow = function grow() {
            var tail = this.snake.segments[this.snake.segments.length - 1];
            var dir = tail.direction;
            var factor = tail.speedFactor;
            var x = tail.position[0] - this.snake.directions[dir][0] * this.spriteSize;
            var y = tail.position[1] - this.snake.directions[dir][1] * this.spriteSize;
            this.snake.segments.push(this.segment(dir, factor, x, y));
            this.ea.publish('grow', this.snake.segments.length);
        };

        App.prototype.die = function die() {
            this.keysOff();
            this.crawling = false;
            clearInterval(this.stepTimerHandle);
            this.fall();
        };

        App.prototype.scoreUpdate = function scoreUpdate() {
            this.score += this.snake.segments.length;
            this.ea.publish('score', this.score);
        };

        App.prototype.gameOver = function gameOver() {
            this.ea.publish('gameOver');
        };

        App.prototype.advanceSegment = function advanceSegment(i, accellerate) {
            var segment = this.snake.segments[i];
            accellerate && (segment.speedFactor *= this.accelleration);
            segment.position[0] += parseInt(this.snake.directions[segment.direction][0] * segment.speedFactor, 10);
            segment.position[1] += parseInt(this.snake.directions[segment.direction][1] * segment.speedFactor, 10);
        };

        App.prototype.followSegment = function followSegment(i, j) {
            var segment = this.snake.segments[i];
            var preceder = this.snake.segments[j];
            var dx = Math.abs(preceder.position[0] - segment.position[0]);
            var dy = Math.abs(preceder.position[1] - segment.position[1]);
            var axis = segment.direction % 2 == 0 ? 'x' : 'y';
            if (preceder.direction !== segment.direction) {
                if (axis == 'x') {
                    if (dx < this.spriteSize && dy > this.spriteSize) {
                        segment.direction = preceder.direction;
                        segment.position[0] = preceder.position[0];
                    }
                } else {
                    if (dy < this.spriteSize && dx > this.spriteSize) {
                        segment.direction = preceder.direction;
                        segment.position[1] = preceder.position[1];
                    }
                }
            }
            this.advanceSegment(i);
        };

        App.prototype.newSnack = function newSnack(x, y, name, i) {
            var snack = {
                position: [x, y],
                name: name,
                index: i
            };
            return snack;
        };

        App.prototype.addSnack = function addSnack() {
            var snack = Math.floor(Math.random() * this.snacks.images.length);
            var name = this.snacks.images[snack].className;

            var x = Math.floor(Math.random() * this.canvas.width - 24) + 24;
            var y = Math.floor(Math.random() * this.canvas.height - 24) + 24;
            this.snacks.onBoard.push(this.newSnack(x, y, name, snack));
        };

        App.prototype.drawSnacks = function drawSnacks() {
            var _this5 = this;

            var ctx = this.ctx;
            this.snacks.onBoard.forEach(function (snack) {
                ctx.save();
                ctx.translate(snack.position[0], snack.position[1]);

                ctx.drawImage(_this5.snacks.images[snack.index], -_this5.halfSnackSize, -_this5.halfSnackSize, _this5.snackSize, _this5.snackSize);
                ctx.restore();
            });
        };

        App.prototype.drawSegment = function drawSegment(segment, i) {
            var ctx = this.ctx;
            var imageIndex = 1;
            switch (i) {
                case 0:
                    imageIndex = 0;
                    break;
                case this.snake.segments.length - 1:
                    imageIndex = 2;
                    break;
            }
            ctx.save();
            ctx.translate(segment.position[0], segment.position[1]);
            imageIndex !== 1 && ctx.rotate(segment.direction * Math.PI / 2);
            ctx.drawImage(this.snake.images[imageIndex], -this.halfSprite, -this.halfSprite);
            ctx.restore();
        };

        App.prototype.fadeArena = function fadeArena() {
            var ctx = this.ctx;
            ctx.fillStyle = 'rgba(0,0,0,.1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };

        App.prototype.setSubscribers = function setSubscribers() {
            var _this6 = this;

            var direction = 0;
            this.ea.subscribe('keyPressed', function (response) {
                if (response.startsWith('Arrow') && _this6.snake.turnSteps == 0) {
                    _this6.snake.turnSteps = 17;
                    switch (response) {
                        case 'ArrowRight':
                            direction = 0;
                            break;
                        case 'ArrowDown':
                            direction = 1;
                            break;
                        case 'ArrowLeft':
                            direction = 2;
                            break;
                        case 'ArrowUp':
                            direction = 3;
                            break;
                    }
                    (direction + 2) % 4 !== _this6.snake.segments[0].direction && (_this6.snake.segments[0].direction = direction);
                }
                switch (response) {
                    case 'Enter':
                        _this6.ea.publish('restart');
                        break;
                    case ' ':
                        if (_this6.crawling) {
                            _this6.ea.publish('pause');
                        }
                        break;
                }
            });
            this.ea.subscribe('restart', function (response) {
                _this6.restart();
            });
            this.ea.subscribe('pause', function (response) {
                _this6.pauseGame();
            });
        };

        App.prototype.segment = function segment(direction, speedFactor, x, y) {
            return {
                direction: direction,
                position: [x, y],
                speedFactor: speedFactor
            };
        };

        App.prototype.clearTimedEvents = function clearTimedEvents() {
            clearInterval(this.stepTimerHandle);
            clearInterval(this.fallTimerHandle);
            clearInterval(this.growTimerHandle);
            clearInterval(this.speedupTimerHandle);
            clearInterval(this.snackTimerHandle);
            clearInterval(this.scoreTimerHandle);
        };

        App.prototype.pauseGame = function pauseGame() {
            this.pause = !this.pause;
            if (this.pause) {
                this.clearTimedEvents();
            } else {
                this.crawl();
            }
        };

        App.prototype.restart = function restart() {
            if (!this.pause) {
                this.clearTimedEvents();
                this.initSnake();
                this.crawl();
            }
        };

        App.prototype.keysOn = function keysOn() {
            this.ea.publish('keysOn');
        };

        App.prototype.keysOff = function keysOff() {
            this.ea.publish('keysOff');
        };

        App.prototype.initSnake = function initSnake() {
            var canvasCenter = {
                x: parseInt(this.$arena.width() / 2, 10),
                y: parseInt(this.$arena.height() / 2, 10)
            };
            this.snake.segments = [];
            this.snake.deadSegments = 0;
            this.stepInterval = 10;
            this.snake.steps = 0;
            this.snake.turnSteps = 0;
            this.snake.segments.push(this.segment(0, 1, canvasCenter.x, canvasCenter.y));
            this.snacks.onBoard = [];
        };

        App.prototype.setDomVars = function setDomVars() {
            this.$arena = (0, _jquery2.default)('.arena');
            this.canvas = document.getElementById('arena');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.wallSize = parseInt(this.$arena.css('borderWidth'), 10);
            this.limits = {
                right: this.canvas.width - this.wallSize,
                bottom: this.canvas.height - this.wallSize,
                left: this.wallSize,
                top: this.wallSize
            };
            this.snake.images = [(0, _jquery2.default)('.head')[0], (0, _jquery2.default)('.body')[0], (0, _jquery2.default)('.tail')[0]];
            this.snacks.images = [(0, _jquery2.default)('.axe')[0], (0, _jquery2.default)('.beer')[0], (0, _jquery2.default)('.bunny')[0], (0, _jquery2.default)('.diamond')[0], (0, _jquery2.default)('.gold')[0], (0, _jquery2.default)('.ruby')[0], (0, _jquery2.default)('.skull')[0], (0, _jquery2.default)('.snail')[0], (0, _jquery2.default)('.trash')[0], (0, _jquery2.default)('.viagra')[0]];
        };

        App.prototype.attached = function attached() {
            var _this7 = this;

            this.setDomVars();
            this.initSnake();
            this.setSubscribers();
            (0, _jquery2.default)(function () {
                _this7.crawl();
            });
        };

        return App;
    }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('keystroke-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.KeystrokeService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var KeystrokeService = exports.KeystrokeService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function KeystrokeService(eventAggregator) {
            _classCallCheck(this, KeystrokeService);

            this.ea = eventAggregator;
            this.acceptMoves = true;
            this.myKeypressCallback = this.keypressInput.bind(this);
            this.setSubscribers();
        }

        KeystrokeService.prototype.keysOff = function keysOff() {
            this.acceptMoves = false;
        };

        KeystrokeService.prototype.keysOn = function keysOn() {
            this.acceptMoves = true;
        };

        KeystrokeService.prototype.setSubscribers = function setSubscribers() {
            var _this = this;

            document.addEventListener('keydown', this.myKeypressCallback, false);
            this.ea.subscribe('keysOff', function (response) {
                _this.keysOff();
            });
            this.ea.subscribe('keysOn', function (response) {
                _this.keysOn();
            });
        };

        KeystrokeService.prototype.keypressInput = function keypressInput(e) {
            var keycode = event.key;
            this.acceptMoves && this.ea.publish('keyPressed', keycode);
        };

        return KeystrokeService;
    }()) || _class);
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('components/restart-overlay',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RestartOverlayCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var RestartOverlayCustomElement = exports.RestartOverlayCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function RestartOverlayCustomElement(eventAggregator) {
            _classCallCheck(this, RestartOverlayCustomElement);

            this.ea = eventAggregator;
            this.showOverlay = false;
            this.pause = false;
        }

        RestartOverlayCustomElement.prototype.restart = function restart() {
            this.ea.publish('restart');
            this.showOverlay = false;
        };

        RestartOverlayCustomElement.prototype.addEventListeners = function addEventListeners() {
            var _this = this;

            this.ea.subscribe('gameOver', function (response) {
                _this.showOverlay = true;
            });
            this.ea.subscribe('restart', function (response) {
                _this.showOverlay = false;
            });
            this.ea.subscribe('pause', function (response) {
                _this.pause = !_this.pause;
            });
        };

        RestartOverlayCustomElement.prototype.attached = function attached() {
            this.addEventListeners();
        };

        return RestartOverlayCustomElement;
    }()) || _class);
});
define('components/status',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StatusCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var StatusCustomElement = exports.StatusCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function StatusCustomElement(eventAggregator) {
            _classCallCheck(this, StatusCustomElement);

            this.ea = eventAggregator;
            this.speed = 0;
            this.length = 1;
            this.score = 0;
        }

        StatusCustomElement.prototype.addEventListeners = function addEventListeners() {
            var _this = this;

            this.ea.subscribe('speedChange', function (response) {
                _this.speed += response;
            });
            this.ea.subscribe('grow', function (response) {
                _this.length = response;
            });
            this.ea.subscribe('restart', function (response) {
                _this.length = 1;
                _this.speed = 0;
            });
            this.ea.subscribe('score', function (response) {
                _this.score = response;
            });
        };

        StatusCustomElement.prototype.attached = function attached() {
            this.addEventListeners();
        };

        return StatusCustomElement;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"reset.css\"></require>\n    <require from=\"app.css\"></require>\n    <require from=\"components/restart-overlay\"></require>\n    <require from=\"components/status\"></require>\n    <h1 class=\"gameTitle\">${message}</h1>\n    <canvas id=\"arena\"\n            class=\"arena\"></canvas>\n    <div class=\"snakeImages\">\n        <img class=\"head\"\n             src=\"/images/head.png\">\n        <img class=\"body\"\n             src=\"/images/body.png\">\n        <img class=\"tail\"\n             src=\"/images/tail.png\">\n        <img class=\"axe\"\n             src=\"/images/axe.png\">\n        <img class=\"beer\"\n             src=\"/images/beer.png\">\n        <img class=\"bunny\"\n             src=\"/images/bunny.png\">\n        <img class=\"diamond\"\n             src=\"/images/diamond.png\">\n        <img class=\"gold\"\n             src=\"/images/gold.png\">\n        <img class=\"ruby\"\n             src=\"/images/ruby.png\">\n        <img class=\"skull\"\n             src=\"/images/skull.png\">\n        <img class=\"snail\"\n             src=\"/images/snail.png\">\n        <img class=\"trash\"\n             src=\"/images/trash.png\">\n        <img class=\"viagra\"\n             src=\"/images/viagra.png\">\n    </div>\n    <restart-overlay></restart-overlay>\n    <status></status>\n</template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "body {\n    position   : relative;\n    user-select: none;\n    overflow   : hidden;\n    font-family: 'Trebuchet MS', sans-serif;\n}\n\n.gameTitle {\n    position      : absolute;\n    z-index       : 2;\n    top           : 0;\n    width         : 100vw;\n    letter-spacing: 1px;\n    font-size     : 20px;\n    line-height   : 24px;\n    text-align    : center;\n    color         : whitesmoke;\n}\n\n.arena {\n    position        : relative;\n    z-index         : 1;\n    width           : calc(100vw - 48px);\n    height          : calc(100vh - 48px);\n    background-color: black;\n    border          : 24px solid crimson;\n}\n\n.snakeImages {\n    display : none;\n    position: absolute;\n    top     : 0;\n    left    : 0;\n    z-index : 0;\n}\n"; });
define('text!reset.css', ['module'], function(module) { module.exports = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\n    margin        : 0;\n    padding       : 0;\n    border        : 0;\n    font-size     : 100%;\n    font          : inherit;\n    vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n    display: block;\n}\n\nbody {\n    line-height: 1;\n}\n\nol, ul {\n    list-style: none;\n}\n\nblockquote, q {\n    quotes: none;\n}\n\nblockquote:after, blockquote:before, q:after, q:before {\n    content: '';\n    content: none;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing : 0;\n}\n"; });
define('text!components/restart-overlay.html', ['module'], function(module) { module.exports = "<template class=\"${showOverlay || pause ? 'show' : ''}\"\n          click.delegate=\"restart()\">\n    <require from=\"components/restart-overlay.css\"></require>\n    <h2 class=\"restart ${!pause ? 'show' : ''}\">Game over.</h2>\n    <h2 class=\"restart ${!pause ? 'show' : ''}\">Click or tap or &lt;enter&gt; to start new game</h2>\n    <h2 class=\"paused ${pause ? 'show' : ''}\">Game paused.</h2>\n    <h2 class=\"paused ${pause ? 'show' : ''}\">Press space to continue</h2>\n\n</template>"; });
define('text!components/restart-overlay.css', ['module'], function(module) { module.exports = "restart-overlay {\n    position        : absolute;\n    z-index         : 10;\n    top             : 0;\n    left            : 0;\n    display         : flex;\n    flex-direction  : column;\n    justify-content : space-around;\n    align-items     : center;\n    width           : 100vw;\n    height          : 100vh;\n    background-color: rgba(0,0,0,.7);\n    opacity         : 0;\n    pointer-events  : none;\n    transition      : all .2s;\n}\n\nrestart-overlay.show {\n    opacity       : 1;\n    pointer-events: all;\n}\n\nrestart-overlay h2 {\n    font-size  : 5vh;\n    line-height: 5vh;\n    color      : whitesmoke;\n}\n\n.paused, .restart {\n    display: none;\n}\n\n.paused.show, .restart.show {\n    display: block;\n}\n"; });
define('text!components/status.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/status.css\"></require>\n    <h2 class=\"statusLine\">Speed: ${speed}&emsp;Length: ${length}&emsp;Score: ${score}</h2>\n</template>"; });
define('text!components/status.css', ['module'], function(module) { module.exports = "status {\n    position: absolute;\n    z-index : 2;\n    bottom  : 0;\n    width   : 100vw;\n}\n\n.statusLine {\n    font-size  : 18px;\n    line-height: 30px;\n    color      : wheat;\n    margin-left: 24px;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map