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
            this.spriteSize = 16;
            this.stepTimerHandle = null;
            this.snake = {
                directions: [[1, 0], [0, 1], [-1, 0], [0, -1], [0, 0]],
                deadSegments: 0,
                growInterval: 10 * this.spriteSize,
                images: [],
                segments: [],
                stepInterval: 10,
                steps: 0,
                turnSteps: 0
            };
        }

        App.prototype.crawl = function crawl() {
            var _this = this;

            this.stepTimerHandle = setInterval(function () {
                _this.stepNdraw();
            }, this.snake.stepInterval);
        };

        App.prototype.fall = function fall() {
            var _this2 = this;

            this.stepTimerHandle = setInterval(function () {
                _this2.fallNdraw();
            }, 0);
        };

        App.prototype.stepNdraw = function stepNdraw() {
            this.fadeArena();
            this.snake.steps++;
            this.snake.turnSteps > 0 && this.snake.turnSteps--;
            this.snake.steps % this.snake.growInterval == 0 && this.grow();
            for (var i = 0; i < this.snake.segments.length; i++) {
                var segment = this.snake.segments[i];
                i == 0 ? this.advanceSegment(i) : this.followSegment(i, i - 1);
                this.drawSegment(segment, i);
            }
            this.wallHit() && this.die();
        };

        App.prototype.fallNdraw = function fallNdraw() {
            this.fadeArena();
            for (var i = 0; i < this.snake.segments.length; i++) {
                var segment = this.snake.segments[i];
                segment.direction < 4 && this.advanceSegment(i, true);
                this.drawSegment(segment, i);
                if (segment.direction < 4 && this.floorHit(segment)) {
                    this.snake.deadSegments++;
                    segment.direction = 4;
                }
            }
            if (this.snake.deadSegments >= this.snake.segments.length) {
                clearInterval(this.stepTimerHandle);
                this.gameOver();
            }
        };

        App.prototype.floorHit = function floorHit(segment) {
            return segment.position[1] + this.spriteSize / 2 > this.canvas.height;
        };

        App.prototype.wallHit = function wallHit() {
            var head = this.snake.segments[0];
            return head.position[0] > this.canvas.width || head.position[0] < 0 || head.position[1] > this.canvas.height || head.position[1] < 0;
        };

        App.prototype.die = function die() {
            clearInterval(this.stepTimerHandle);
            for (var i = 0; i < this.snake.segments.length; i++) {
                this.snake.segments[i].direction = 1;
            }
            this.fall();
        };

        App.prototype.gameOver = function gameOver() {
            console.log('Game Over');
        };

        App.prototype.advanceSegment = function advanceSegment(i, accellerate) {
            var segment = this.snake.segments[i];
            accellerate && (segment.speedFactor *= this.accelleration);
            segment.position[0] += this.snake.directions[segment.direction][0] * segment.speedFactor;
            segment.position[1] += this.snake.directions[segment.direction][1] * segment.speedFactor;
        };

        App.prototype.followSegment = function followSegment(i, j) {
            var segment = this.snake.segments[i];
            var preceder = this.snake.segments[j];
            var dx = preceder.position[0] - segment.position[0];
            var dy = preceder.position[1] - segment.position[1];
            var axis = segment.direction % 2 == 0 ? 'x' : 'y';
            if (preceder.direction !== segment.direction) {
                if (axis == 'x') {
                    segment.direction = dx == 0 ? preceder.direction : segment.direction;
                } else {
                    segment.direction = dy == 0 ? preceder.direction : segment.direction;
                }
            }
            this.advanceSegment(i);
        };

        App.prototype.grow = function grow() {
            var tail = this.snake.segments[this.snake.segments.length - 1];
            var dir = tail.direction;
            var x = tail.position[0] - this.snake.directions[dir][0] * this.spriteSize;
            var y = tail.position[1] - this.snake.directions[dir][1] * this.spriteSize;
            this.snake.segments.push(new this.segment(dir, x, y));
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
            ctx.drawImage(this.snake.images[imageIndex], -this.spriteSize / 2, -this.spriteSize / 2);
            ctx.restore();
        };

        App.prototype.fadeArena = function fadeArena() {
            var ctx = this.ctx;
            ctx.fillStyle = 'rgba(0,0,0,.1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };

        App.prototype.setSubscribers = function setSubscribers() {
            var _this3 = this;

            var head = this.snake.segments[0];
            this.ea.subscribe('keyPressed', function (response) {
                if (_this3.snake.turnSteps == 0) {
                    _this3.snake.turnSteps = 17;
                    switch (response) {
                        case 'ArrowRight':
                            head.direction = 0;
                            break;
                        case 'ArrowDown':
                            head.direction = 1;
                            break;
                        case 'ArrowLeft':
                            head.direction = 2;
                            break;
                        case 'ArrowUp':
                            head.direction = 3;
                            break;
                        default:
                            null;
                    }
                }
            });
        };

        App.prototype.segment = function segment(direction, x, y) {
            return {
                direction: direction,
                position: [x, y],
                speedFactor: 1
            };
        };

        App.prototype.initSnake = function initSnake() {
            var canvasCenter = {
                x: parseInt(this.$arena.width() / 2, 10),
                y: parseInt(this.$arena.height() / 2, 10)
            };
            this.snake.segments.push(new this.segment(0, canvasCenter.x, canvasCenter.y));
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
        };

        App.prototype.attached = function attached() {
            var _this4 = this;

            this.setDomVars();
            this.initSnake();
            this.setSubscribers();
            (0, _jquery2.default)(function () {
                _this4.crawl();
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
            this.keys = {
                'left': 37,
                'up': 38,
                'right': 39,
                'down': 40
            };
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
            this.ea.publish('keyPressed', keycode);
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
    exports.BoardCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var BoardCustomElement = exports.BoardCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function BoardCustomElement(eventAggregator) {
            _classCallCheck(this, BoardCustomElement);

            this.ea = eventAggregator;
            this.showOverlay = true;
        }

        BoardCustomElement.prototype.attached = function attached() {};

        return BoardCustomElement;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"reset.css\"></require>\n    <require from=\"app.css\"></require>\n    <require from=\"components/restart-overlay\"></require>\n    <h1 class=\"gameTitle\">${message}</h1>\n    <canvas id=\"arena\"\n            class=\"arena\"></canvas>\n    <div class=\"snakeImages\">\n        <img class=\"head\"\n             src=\"/images/head.png\">\n        <img class=\"body\"\n             src=\"/images/body.png\">\n        <img class=\"tail\"\n             src=\"/images/tail.png\">\n    </div>\n    <restart-overlay></restart-overlay>\n</template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "body {\n    position   : relative;\n    user-select: none;\n    overflow   : hidden;\n}\n\n.gameTitle {\n    position      : absolute;\n    z-index       : 2;\n    top           : 0;\n    width         : 100vw;\n    font-family   : 'Trebuchet MS', sans-serif;\n    letter-spacing: 1px;\n    font-size     : 20px;\n    line-height   : 24px;\n    text-align    : center;\n    color         : whitesmoke;\n}\n\n.arena {\n    position        : relative;\n    z-index         : 1;\n    width           : calc(100vw - 48px);\n    height          : calc(100vh - 48px);\n    background-color: black;\n    border          : 24px solid crimson;\n}\n\n.snakeImages {\n    display : none;\n    position: absolute;\n    top     : 0;\n    left    : 0;\n    z-index : 0;\n}\n"; });
define('text!reset.css', ['module'], function(module) { module.exports = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\n    margin        : 0;\n    padding       : 0;\n    border        : 0;\n    font-size     : 100%;\n    font          : inherit;\n    vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n    display: block;\n}\n\nbody {\n    line-height: 1;\n}\n\nol, ul {\n    list-style: none;\n}\n\nblockquote, q {\n    quotes: none;\n}\n\nblockquote:after, blockquote:before, q:after, q:before {\n    content: '';\n    content: none;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing : 0;\n}\n"; });
define('text!components/restart-overlay.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/restart-overlay.css\"></require>\n    <h2>Game over.</h2>\n    <h2>Click or tap to start new game</h2>\n</template>"; });
define('text!components/restart-overlay.css', ['module'], function(module) { module.exports = "restart-overlay {\n    position       : absolute;\n    z-index        : 10;\n    top            : 0;\n    left           : 0;\n    display        : flex;\n    flex-direction : column;\n    justify-content: space-around;\n}\n\nh2 {\n    font-size  : 5vh;\n    line-height: 5vh;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map