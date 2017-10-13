define('app',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'jquery', './services/keystroke-service', './services/timing-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _jquery, _keystrokeService, _timingService) {
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

    var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_keystrokeService.KeystrokeService, _timingService.TimingService, _aureliaEventAggregator.EventAggregator), _dec(_class = function App(keystrokeService, timingService, eventAggregator) {
        _classCallCheck(this, App);

        this.keystrokeService = keystrokeService;
        this.timingService = timingService;
        this.ea = eventAggregator;
        this.message = 'Snake by ashWare';
    }) || _class);
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
define('components/game-screen',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../services/screen-service', '../services/snake-service', '../services/snack-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _screenService, _snakeService, _snackService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GameScreenCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var GameScreenCustomElement = exports.GameScreenCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _screenService.ScreenService, _snakeService.SnakeService, _snackService.SnackService), _dec(_class = function () {
        function GameScreenCustomElement(eventAggregator, screenService, snakeService, snackService) {
            _classCallCheck(this, GameScreenCustomElement);

            this.ea = eventAggregator;
            this.screenService = screenService;
            this.snakeService = snakeService;
            this.snackService = snackService;
            this.snakeImages = [];
            this.snackImages = [];
            this.spriteSize = 16;

            this.snakeParts = this.snakeService.snakeParts;
            this.snacks = this.snackService.snacks;
        }

        GameScreenCustomElement.prototype.roundToSpriteSize = function roundToSpriteSize(size) {
            return Math.floor(size / this.spriteSize) * this.spriteSize;
        };

        GameScreenCustomElement.prototype.attached = function attached() {
            var _this = this;

            var self = this;
            this.$arena = $('.arena');
            var $body = $('body');
            var $snakeImages = $('.snakeImages img');
            var targetWidth = this.roundToSpriteSize($body.width() - 48);
            var targetHeight = this.roundToSpriteSize($body.height() - 48);
            this.$arena.width(targetWidth);
            this.$arena.height(targetHeight);
            $snakeImages.each(function () {
                self.snakeImages.push(this);
            });
            $('.snackImages img').each(function () {
                self.snackImages.push(this);
            });
            $(function () {
                _this.screenService.setDomVars(_this.$arena, _this.snakeImages, _this.snackImages);
                _this.snakeService.setCenter();
            });
        };

        return GameScreenCustomElement;
    }()) || _class);
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
            this.showOverlay = true;
            this.firstGame = true;
            this.pause = false;
        }

        RestartOverlayCustomElement.prototype.start = function start() {
            this.ea.publish('start');
            this.showOverlay = false;
            this.firstGame = false;
        };

        RestartOverlayCustomElement.prototype.addEventListeners = function addEventListeners() {
            var _this = this;

            this.ea.subscribe('gameOver', function (response) {
                _this.showOverlay = true;
            });
            this.ea.subscribe('start', function (response) {
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
            this.resetVars();
        }

        StatusCustomElement.prototype.addEventListeners = function addEventListeners() {
            var _this = this;

            this.ea.subscribe('speed', function (response) {
                _this.speed = response;
            });
            this.ea.subscribe('grow', function (response) {
                _this.length = response;
            });
            this.ea.subscribe('start', function (response) {
                _this.resetVars();
            });
            this.ea.subscribe('score', function (response) {
                _this.score = response;
            });
            this.ea.subscribe('snack', function (response) {
                _this.snack = response;
                setTimeout(function () {
                    _this.snack = '';
                }, 15000);
            });
            this.ea.subscribe('die', function (response) {
                _this.snack = response;
            });
        };

        StatusCustomElement.prototype.resetVars = function resetVars() {
            this.speed = 0;
            this.length = 1;
            this.score = 0;
            this.snack = '';
        };

        StatusCustomElement.prototype.attached = function attached() {
            this.addEventListeners();
        };

        return StatusCustomElement;
    }()) || _class);
});
define('services/keystroke-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
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
define('services/screen-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ScreenService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var ScreenService = exports.ScreenService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function ScreenService(eventAggregator) {
            _classCallCheck(this, ScreenService);

            this.ea = eventAggregator;
            this.spriteSize = 16;
            this.halfSprite = this.spriteSize / 2;
            this.snackSize = 24;
            this.halfSnackSize = this.snackSize / 2;
            this.canvasCenter = {};
        }

        ScreenService.prototype.drawSnake = function drawSnake(snake) {
            var type = 0;
            for (var i = 0; i < snake.segments.length; i++) {
                var segment = snake.segments[i];
                this.ctx.save();
                this.ctx.translate(segment[0], segment[1]);
                segment.type !== 1 && this.ctx.rotate(snake.direction * Math.PI / 2);
                this.ctx.drawImage(this.snakeImages[type], -this.halfSprite, -this.halfSprite);
                this.ctx.restore();
                type = 1;
            }
        };

        ScreenService.prototype.drawSnack = function drawSnack(snack) {
            this.ctx.save();

            this.ctx.translate(snack.position[0], snack.position[1]);

            this.ctx.drawImage(this.snackImages[snack.index], 0, 0, this.snackSize, this.snackSize);
            this.ctx.restore();
        };

        ScreenService.prototype.drawSnacks = function drawSnacks() {
            this.snacks.onBoard.forEach(function (snack) {
                gameScreen.drawSnack(snack);
            });
        };

        ScreenService.prototype.fadeArena = function fadeArena() {
            this.ctx.fillStyle = 'rgba(0,0,0,0.95)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };

        ScreenService.prototype.roundToSpriteSize = function roundToSpriteSize(size) {
            return Math.floor(size / this.spriteSize) * this.spriteSize + this.halfSprite;
        };

        ScreenService.prototype.setDomVars = function setDomVars($arena, snakeImages, snackImages) {
            this.canvas = $('#arena')[0];
            this.ctx = this.canvas.getContext('2d');
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
            this.snakeImages = snakeImages;
            this.snackImages = snackImages;
        };

        return ScreenService;
    }()) || _class);
});
define('services/snack-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SnackService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var SnackService = exports.SnackService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function SnackService(eventAggregator) {
            _classCallCheck(this, SnackService);

            this.ea = eventAggregator;
            this.snacks = ['axe', 'beer', 'bunny', 'diamond', 'gold', 'ruby', 'skull', 'snail', 'trash', 'viagra'];
        }

        SnackService.prototype.newSnack = function newSnack(x, y, name, i) {
            var snack = {
                position: [x, y],
                name: name,
                index: i
            };
            return snack;
        };

        SnackService.prototype.addSnack = function addSnack() {
            var snack = Math.floor(Math.random() * this.snacks.images.length);
            var name = this.snacks.images[snack].className;

            var x = Math.floor(Math.random() * this.canvas.width - 24) + 24;
            var y = Math.floor(Math.random() * this.canvas.height - 24) + 24;
            this.snacks.onBoard.push(this.newSnack(x, y, name, snack));
        };

        SnackService.prototype.initStuff = function initStuff() {
            this.snacks.onBoard = [];
        };

        return SnackService;
    }()) || _class);
});
define('services/snake-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './screen-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _screenService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SnakeService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var SnakeService = exports.SnakeService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _screenService.ScreenService), _dec(_class = function () {
        function SnakeService(eventAggregator, screenService) {
            _classCallCheck(this, SnakeService);

            this.ea = eventAggregator;
            this.screenService = screenService;
            this.snakeParts = ['head', 'body', 'tail'];
            this.snake = {
                direction: 0,
                directions: [[1, 0], [0, 1], [-1, 0], [0, -1], [0, 0]],
                segments: [],
                deadSegments: []
            };
            this.setSubscribers();
        }

        SnakeService.prototype.step = function step(grow) {
            this.snake.turnSteps > 0 && this.snake.turnSteps--;
            this.advanceHead();
            !grow && this.snake.segments.pop();
        };

        SnakeService.prototype.advanceHead = function advanceHead() {
            var head = this.snake.segments[0].slice();
            head[0] += this.snake.directions[this.snake.direction][0] * this.snake.segmentSize;
            head[1] += this.snake.directions[this.snake.direction][1] * this.snake.segmentSize;
            this.snake.segments.unshift(head);
            this.hitWall();
            this.hitSnake();
        };

        SnakeService.prototype.hitWall = function hitWall() {
            var head = this.snake.segments[0];
            var wallHit = head[0] >= this.screenService.limits.right - this.halfSprite || head[0] <= this.screenService.limits.left + this.halfSprite || head[1] >= this.screenService.limits.bottom - this.halfSprite || head[1] <= this.screenService.limits.top + this.halfSprite;
            wallHit && this.ea.publish('die', 'You hit a wall');
        };

        SnakeService.prototype.hitSnake = function hitSnake() {
            var head = this.snake.segments[0];
            var samePosition = function samePosition(pos1, pos2) {
                return pos1[0] == pos2[0] && pos1[1] == pos2[1];
            };
            for (var i = 3; i < this.snake.segments.length - 1; i++) {
                var segment = this.snake.segments[i];
                if (samePosition(segment, head)) {
                    this.ea.publish('die', 'You tried to bite yourself that&rsquo;s deadly');
                    return true;
                }
            }
            return false;
        };

        SnakeService.prototype.dropSnake = function dropSnake() {
            for (var i = 0; i < this.snake.segments.length; i++) {
                if (this.snake.deadSegments.indexOf(i) < 0) {
                    var segment = this.snake.segments[i];
                    var newY = (segment[1] + 1) * 1.05;
                    if (newY <= this.screenService.limits.bottom) {
                        segment[1] = newY;
                    } else {
                        this.snake.deadSegments.push(i);
                    }
                }
                if (this.snake.deadSegments.length >= this.snake.segments.length) {
                    this.ea.publish('gameOver');
                }
            }
        };

        SnakeService.prototype.hitSnack = function hitSnack() {
            var self = this;
            var head = this.snake.segments[0];
            function overlap(snackPos, headPos) {
                var dx = Math.abs(snackPos[0] - headPos[0]);
                var dy = Math.abs(snackPos[1] - headPos[1]);
                var xOverlap = dx < (self.snackSize + self.snake.segmentSize) / 2;
                var yOverlap = dy < (self.snackSize + self.snake.segmentSize) / 2;
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

        SnakeService.prototype.cutSnake = function cutSnake() {
            var halfSnake = Math.floor(this.snake.segments.length / 2);
            this.snake.segments.splice(-halfSnake);
            this.ea.publish('snack', 'Axe: you lost half of your length');
        };

        SnakeService.prototype.growHarder = function growHarder() {
            var _this = this;

            if (this.growInterval > 500) {
                this.growInterval -= 500;
                this.restartIntervals();
                setTimeout(function () {
                    _this.growInterval += 500;
                    _this.restartIntervals();
                }, 15000);
                this.ea.publish('snack', 'Blue pill: growing harder for 15 seconds');
            }
        };

        SnakeService.prototype.growSlower = function growSlower() {
            var _this2 = this;

            this.growInterval += 500;
            this.restartIntervals();
            setTimeout(function () {
                _this2.growInterval -= 500;
                _this2.restartIntervals();
            }, 15000);
            this.ea.publish('snack', 'Beer: growing slower for 15 seconds');
        };

        SnakeService.prototype.score100 = function score100() {
            this.scoreUpdate(1000);
            this.ea.publish('snack', 'Diamond: you scored 1000 points');
        };

        SnakeService.prototype.score10 = function score10() {
            this.scoreUpdate(100);
            this.ea.publish('snack', 'Gold: you scored 100 points');
        };

        SnakeService.prototype.scoreX10 = function scoreX10() {
            var _this3 = this;

            if (this.scoreInterval > 250) {
                this.scoreInterval -= 250;
                setTimeout(function () {
                    _this3.scoreInterval += 250;
                }, 15000);
                this.ea.publish('snack', 'Ruby: scoring faster for 15 seconds');
            }
        };

        SnakeService.prototype.trashSnacks = function trashSnacks() {
            this.snacks.onBoard = [];
            this.ea.publish('snack', 'Trash: you trashed all extra&rsquo;s');
        };

        SnakeService.prototype.slowdown = function slowdown() {
            console.log('slowdown');
            if (this.stepInterval < 7) {
                this.stepInterval += 1;
                this.restartIntervals();
                this.ea.publish('speedChange', -1);
            }
            this.ea.publish('snack', 'Snail: running slower');
        };

        SnakeService.prototype.die = function die() {
            this.keysOff();
            this.crawling = false;
            this.clearTimedEvents();
            this.fall();
        };

        SnakeService.prototype.scoreUpdate = function scoreUpdate(amount) {
            if (amount) {
                this.score += amount;
            } else {
                this.score += this.snake.segments.length;
            }
            this.ea.publish('score', this.score);
        };

        SnakeService.prototype.setSubscribers = function setSubscribers() {
            var _this4 = this;

            var direction = 0;
            this.ea.subscribe('keyPressed', function (response) {
                if (response.startsWith('Arrow') && _this4.snake.turnSteps == 0) {
                    _this4.snake.turnSteps = 1;
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

                    (direction + 2) % 4 !== _this4.snake.direction && (_this4.snake.direction = direction);
                }
            });
        };

        SnakeService.prototype.setCenter = function setCenter() {
            this.center = this.screenService.canvasCenter;
        };

        SnakeService.prototype.minTurnSteps = function minTurnSteps() {
            return Math.ceil(this.snake.segmentSize / this.snake.stepSize) + 1;
        };

        SnakeService.prototype.initSnake = function initSnake() {
            this.snake.segmentSize = this.screenService.spriteSize;
            this.halfSprite = Math.round(this.snake.segmentSize / 2);
            this.accelleration = 1.01;
            this.score = 0;
            this.snake.deadSegments = [];
            this.snake.stepSize = 16;
            this.snake.segments = [];
            this.snake.turnSteps = 0;
            var segment = [this.center.x, this.center.y];
            this.snake.segments.push(segment);
        };

        return SnakeService;
    }()) || _class);
});
define('services/timing-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './snake-service', './screen-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _snakeService, _screenService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TimingService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var TimingService = exports.TimingService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _snakeService.SnakeService, _screenService.ScreenService), _dec(_class = function () {
        function TimingService(eventAggregator, snakeService, screenService) {
            _classCallCheck(this, TimingService);

            this.ea = eventAggregator;
            this.snakeService = snakeService;
            this.screenService = screenService;

            this.crawling = false;
            this.steps = 0;
            this.speed = 1;
            this.fallTimerHandle = null;
            this.stepTimerHandle = null;
            this.pause = false;

            this.setSubscribers();
        }

        TimingService.prototype.startGame = function startGame() {
            this.resetIntervals();
            this.snakeService.initSnake(1);
            this.crawling = true;
            this.resumeGame();
        };

        TimingService.prototype.resumeGame = function resumeGame() {
            var _this = this;

            this.stepTimerHandle = setInterval(function () {
                _this.drawScreen();
            }, this.stepInterval);
        };

        TimingService.prototype.drawScreen = function drawScreen() {
            this.steps += 1;
            var grow = this.steps % this.growInterval == 0;
            this.snakeService.step(grow);
            this.screenService.fadeArena();
            this.screenService.drawSnake(this.snakeService.snake);
            this.steps % this.speedupInterval == 0 && this.speedUp();
            grow && this.ea.publish('grow', this.snakeService.snake.segments.length);
        };

        TimingService.prototype.speedUp = function speedUp() {
            if (this.stepInterval > 40) {
                this.speed += 1;
                this.clearTimedEvents();
                this.stepInterval -= 40;
                this.resumeGame();
                this.ea.publish('speed', this.speed);
            }
        };

        TimingService.prototype.dropSnake = function dropSnake() {
            var _this2 = this;

            this.fallTimerHandle = setInterval(function () {
                _this2.snakeService.dropSnake();
                _this2.screenService.fadeArena();
                _this2.screenService.drawSnake(_this2.snakeService.snake);
            }, this.dropInterval);
        };

        TimingService.prototype.clearTimedEvents = function clearTimedEvents() {
            clearInterval(this.stepTimerHandle);
            clearInterval(this.fallTimerHandle);
        };

        TimingService.prototype.pauseGame = function pauseGame() {
            if (this.crawling) {
                this.pause = !this.pause;
                if (this.pause) {
                    this.clearTimedEvents();
                } else {
                    this.resumeGame();
                }
            }
        };

        TimingService.prototype.restart = function restart() {
            if (!this.pause) {
                this.clearTimedEvents();
                this.startGame();
            }
        };

        TimingService.prototype.setSubscribers = function setSubscribers() {
            var _this3 = this;

            var direction = 0;
            this.ea.subscribe('keyPressed', function (response) {
                switch (response) {
                    case 'Enter':
                        _this3.ea.publish('start');
                        break;
                    case ' ':
                        _this3.ea.publish('pause');
                        break;
                }
            });
            this.ea.subscribe('die', function (response) {
                _this3.clearTimedEvents();
                _this3.dropSnake();
            });
            this.ea.subscribe('start', function (response) {
                _this3.restart();
            });
            this.ea.subscribe('pause', function (response) {
                _this3.pauseGame();
            });
            this.ea.subscribe('gameOver', function (response) {
                _this3.clearTimedEvents();
            });
        };

        TimingService.prototype.resetIntervals = function resetIntervals() {
            this.stepInterval = 400;
            this.scoreInterval = 10;
            this.growInterval = 10;
            this.speedupInterval = 10;
            this.dropInterval = 0;

            this.speed = 1;
        };

        return TimingService;
    }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"reset.css\"></require>\n    <require from=\"app.css\"></require>\n    <require from=\"components/game-screen\"></require>\n    <require from=\"components/restart-overlay\"></require>\n    <require from=\"components/status\"></require>\n    <h1 class=\"gameTitle\">${message}</h1>\n    <game-screen></game-screen>\n    <restart-overlay></restart-overlay>\n    <status></status>\n</template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "body {\n    position        : relative;\n    user-select     : none;\n    overflow        : hidden;\n    font-family     : 'Trebuchet MS', sans-serif;\n    background-color: crimson;\n    height          : 100vh;\n}\n\n.gameTitle {\n    position      : absolute;\n    z-index       : 2;\n    top           : 0;\n    width         : 100vw;\n    letter-spacing: 1px;\n    font-size     : 20px;\n    line-height   : 24px;\n    text-align    : center;\n    color         : whitesmoke;\n}\n"; });
define('text!components/game-screen.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/game-screen.css\"></require>\n    <div class=\"snakeImages\">\n        <img repeat.for=\"image of snakeParts\"\n             class.bind=\"image\"\n             src=\"/images/${image}.png\">\n    </div>\n    <div class=\"snackImages\">\n        <img repeat.for=\"image of snacks\"\n             class.bind=\"image\"\n             src=\"/images/${image}.png\">\n    </div>\n    <canvas id=\"arena\"\n            class=\"arena\"></canvas>\n</template>"; });
define('text!reset.css', ['module'], function(module) { module.exports = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\n    margin        : 0;\n    padding       : 0;\n    border        : 0;\n    font-size     : 100%;\n    font          : inherit;\n    vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n    display: block;\n}\n\nbody {\n    line-height: 1;\n}\n\nol, ul {\n    list-style: none;\n}\n\nblockquote, q {\n    quotes: none;\n}\n\nblockquote:after, blockquote:before, q:after, q:before {\n    content: '';\n    content: none;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing : 0;\n}\n"; });
define('text!components/restart-overlay.html', ['module'], function(module) { module.exports = "<template class=\"${showOverlay || pause ? 'show' : ''}\"\n          click.delegate=\"start()\">\n    <require from=\"components/restart-overlay.css\"></require>\n    <h2 class=\"restart ${!pause && !firstGame ? 'show' : ''}\">Game over</h2>\n    <h2 class=\"restart ${!pause ? 'show' : ''}\">Click or tap or &lt;enter&gt; to start new game</h2>\n    <h2 class=\"paused ${pause ? 'show' : ''}\">Game paused</h2>\n    <h2 class=\"paused ${pause ? 'show' : ''}\">Press space to continue</h2>\n\n</template>"; });
define('text!components/game-screen.css', ['module'], function(module) { module.exports = "game-Screen {\n    display        : flex;\n    flex-direction : column;\n    justify-content: center;\n    align-items    : center;\n    width          : 100vw;\n    height         : 100vh;\n    position       : relative;\n}\n\n.arena {\n    background-color: black;\n}\n\n.snackImages, .snakeImages {\n    display : none;\n    position: absolute;\n    top     : 0;\n    left    : 0;\n    z-index : 0;\n}\n"; });
define('text!components/status.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/status.css\"></require>\n    <h2 class=\"statusLine\">\n        <span>Speed:</span><span class=\"speed\">${speed}</span>\n        <span>Length:</span><span class=\"length\">${length}</span>\n        <span>Score:</span><span class=\"score\">${score}</span>\n        <span class=\"snack\"\n              innerhtml.bind=\"snack\"></span>\n    </h2>\n</template>"; });
define('text!components/restart-overlay.css', ['module'], function(module) { module.exports = "restart-overlay {\n    position        : absolute;\n    z-index         : 10;\n    top             : 0;\n    left            : 0;\n    display         : flex;\n    flex-direction  : column;\n    justify-content : space-around;\n    align-items     : center;\n    width           : 100vw;\n    height          : 100vh;\n    background-color: rgba(0,0,0,.7);\n    opacity         : 0;\n    pointer-events  : none;\n    transition      : all .2s;\n}\n\nrestart-overlay.show {\n    opacity       : 1;\n    pointer-events: all;\n}\n\nrestart-overlay h2 {\n    font-size  : 5vh;\n    line-height: 5vh;\n    color      : whitesmoke;\n}\n\n.paused, .restart {\n    display: none;\n}\n\n.paused.show, .restart.show {\n    display: block;\n}\n"; });
define('text!components/status.css', ['module'], function(module) { module.exports = "status {\n    position  : absolute;\n    z-index   : 2;\n    bottom    : 0;\n    width     : 100vw;\n    text-align: center;\n}\n\n.statusLine {\n    font-size  : 18px;\n    line-height: 30px;\n    color      : wheat;\n    /* margin-left: 24px; */\n}\n\n.length, .score, .snack, .speed {\n    margin-right: 10px;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map