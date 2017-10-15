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

        aurelia.use.plugin('aurelia-cookie');

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
            this.snackNames = this.snackService.names;
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
            var $snackImages = $('.snackImages img');
            var targetWidth = this.roundToSpriteSize($body.width() - 48);
            var targetHeight = this.roundToSpriteSize($body.height() - 48);
            this.$arena.width(targetWidth);
            this.$arena.height(targetHeight);
            $snakeImages.each(function () {
                self.snakeImages.push(this);
            });
            $snackImages.each(function () {
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
            this.score = 0;
            this.highScore;
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
                _this.score = response.score;
                _this.highScore = response.highScore;
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

        StatusCustomElement.prototype.resetHighscore = function resetHighscore() {
            this.ea.publish('resetHigh');
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
define('services/score-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-cookie'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaCookie) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ScoreService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var ScoreService = exports.ScoreService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function ScoreService(eventAggregator) {
            var _this = this;

            _classCallCheck(this, ScoreService);

            this.ea = eventAggregator;

            this.multiplier = 1;
            this.score = 0;
            this.highScore = this.readHighscore();
            this.ea.subscribe('gameOver', function (response) {
                _this.saveHighscore();
            });
            this.ea.subscribe('resetHigh', function (response) {
                _this.resetHighscore();
            });
        }

        ScoreService.prototype.update = function update(amount) {
            amount && (this.score += amount * this.multiplier);
            this.highScore = Math.max(this.score, this.highScore);
            this.ea.publish('score', {
                score: this.score,
                highScore: this.highScore
            });
        };

        ScoreService.prototype.setMultiplier = function setMultiplier(factor) {
            if (factor) {
                this.multiplier = factor;
            } else {
                this.multiplier = 10;
            }
        };

        ScoreService.prototype.resetMultiplier = function resetMultiplier() {
            this.multiplier = 1;
        };

        ScoreService.prototype.saveHighscore = function saveHighscore() {
            _aureliaCookie.AureliaCookie.set('highScore', this.highScore, {
                expiry: -1
            });
        };

        ScoreService.prototype.readHighscore = function readHighscore() {
            var hs = _aureliaCookie.AureliaCookie.get('highScore');
            if (hs > 0) {
                return hs;
            }
            return 0;
        };

        ScoreService.prototype.resetHighscore = function resetHighscore() {
            this.highScore = 0;
            this.saveHighscore();
        };

        ScoreService.prototype.initScore = function initScore() {
            this.score = 0;
        };

        return ScoreService;
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

        ScreenService.prototype.drawSnacks = function drawSnacks(snacks) {
            for (var i = 0; i < snacks.length; i++) {
                var snack = snacks[i];
                this.ctx.save();
                this.ctx.translate(snack.position[0] - this.halfSnackSize, snack.position[1] - this.halfSnackSize);
                this.ctx.drawImage(this.snackImages[snack.nameIndex], 0, 0, this.snackSize, this.snackSize);
                this.ctx.restore();
            }
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
define('services/snack-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './screen-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _screenService) {
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

    var SnackService = exports.SnackService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _screenService.ScreenService), _dec(_class = function () {
        function SnackService(eventAggregator, screenService) {
            _classCallCheck(this, SnackService);

            this.ea = eventAggregator;
            this.screenService = screenService;
            this.snacks = [];
            this.names = ['axe', 'beer', 'bunny', 'diamond', 'gold', 'ruby', 'skull', 'snail', 'trash', 'viagra'];
        }

        SnackService.prototype.newSnack = function newSnack(x, y, name, i) {
            var snack = {
                position: [x, y],
                name: name,
                nameIndex: i
            };
            return snack;
        };

        SnackService.prototype.samePosition = function samePosition(pos1, pos2) {
            return pos1[0] == pos2[0] && pos1[1] == pos2[1];
        };

        SnackService.prototype.hitSnack = function hitSnack(head, neck) {
            for (var i = 0; i < this.snacks.length - 1; i++) {
                var snack = this.snacks[i];
                if (this.samePosition(snack.position, head) || this.samePosition(snack.position, neck)) {
                    this.removeSnack(i);
                    return snack.name;
                }
            }
            return 'nope';
        };

        SnackService.prototype.addSnack = function addSnack() {
            var randomIndex = Math.floor(Math.random() * this.names.length);
            var snack = this.names[randomIndex];
            var x = this.screenService.roundToSpriteSize(Math.floor(Math.random() * (this.screenService.limits.right - this.screenService.spriteSize)));
            var y = this.screenService.roundToSpriteSize(Math.floor(Math.random() * (this.screenService.limits.bottom - this.screenService.spriteSize)));
            this.snacks.push(this.newSnack(x, y, snack, randomIndex));
        };

        SnackService.prototype.removeSnack = function removeSnack(index) {
            this.snacks.splice(index, 1);
        };

        SnackService.prototype.initSnacks = function initSnacks() {
            this.snacks = [];
        };

        return SnackService;
    }()) || _class);
});
define('services/snake-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './screen-service', '../services/snack-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _screenService, _snackService) {
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

    var SnakeService = exports.SnakeService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _screenService.ScreenService, _snackService.SnackService), _dec(_class = function () {
        function SnakeService(eventAggregator, screenService, snackService) {
            var _this = this;

            _classCallCheck(this, SnakeService);

            this.ea = eventAggregator;
            this.screenService = screenService;
            this.snackService = snackService;
            this.snakeParts = ['head', 'body', 'tail'];
            this.snake = {
                direction: 0,
                directions: [[1, 0], [0, 1], [-1, 0], [0, -1], [0, 0]],
                segments: [],
                deadSegments: []
            };
            this.snackMethods = {
                nope: function nope() {
                    void 0;
                },
                axe: function axe() {
                    _this.cutSnake();
                    _this.ea.publish('snack', 'Axe: lost half of yourself');
                },
                beer: function beer() {
                    _this.ea.publish('snack', 'Beer: grow slower for 15 seconds');
                },
                bunny: function bunny() {
                    _this.ea.publish('snack', 'Bunny: run faster for 15 seconds');
                },
                diamond: function diamond() {
                    _this.ea.publish('snack', 'Diamond: 10000 points');
                },
                gold: function gold() {
                    _this.ea.publish('snack', 'Gold: 1000 points');
                },
                ruby: function ruby() {
                    _this.ea.publish('snack', 'Ruby: score &times; 10 for 15 seconds');
                },
                skull: function skull() {
                    _this.ea.publish('snack', 'Skull: you die');
                },
                snail: function snail() {
                    _this.ea.publish('snack', 'Snail: run slower for 15 seconds');
                },
                trash: function trash() {
                    _this.ea.publish('snack', 'Trash: trash all extra&rsquo;s');
                },
                viagra: function viagra() {
                    _this.ea.publish('snack', 'Viagra: grow harder for 15 seconds');
                }
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
            var neck = head;
            this.snake.segments.length > 1 && (neck = this.snake.segments[1].slice());
            head[0] += this.snake.directions[this.snake.direction][0] * this.snake.segmentSize;
            head[1] += this.snake.directions[this.snake.direction][1] * this.snake.segmentSize;
            this.snake.segments.unshift(head);
            this.hitWall();
            this.hitSnake();
            var method = this.snackService.hitSnack(head, neck).toLowerCase();
            this.snackMethods[method]();
        };

        SnakeService.prototype.cutSnake = function cutSnake() {
            var halfSnake = Math.floor(this.snake.segments.length / 2);
            this.snake.segments.splice(-halfSnake);
        };

        SnakeService.prototype.fallDown = function fallDown() {
            this.crawling = false;
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

        SnakeService.prototype.hitWall = function hitWall() {
            var head = this.snake.segments[0];
            var wallHit = head[0] > this.screenService.limits.right - this.halfSprite || head[0] < this.screenService.limits.left + this.halfSprite || head[1] > this.screenService.limits.bottom - this.halfSprite || head[1] < this.screenService.limits.top + this.halfSprite;
            wallHit && this.ea.publish('die', 'You hit a wall');
        };

        SnakeService.prototype.hitSnake = function hitSnake() {
            var head = this.snake.segments[0];
            for (var i = 3; i < this.snake.segments.length - 1; i++) {
                var segment = this.snake.segments[i];
                if (this.samePosition(segment, head)) {
                    this.ea.publish('die', 'You tried to bite yourself that&rsquo;s deadly');
                    return true;
                }
            }
            return false;
        };

        SnakeService.prototype.samePosition = function samePosition(pos1, pos2) {
            return pos1[0] == pos2[0] && pos1[1] == pos2[1];
        };

        SnakeService.prototype.setSubscribers = function setSubscribers() {
            var _this2 = this;

            var direction = 0;
            this.ea.subscribe('keyPressed', function (response) {
                if (response.startsWith('Arrow') && _this2.snake.turnSteps == 0) {
                    _this2.snake.turnSteps = 1;
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

                    (direction + 2) % 4 !== _this2.snake.direction && (_this2.snake.direction = direction);
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
define('services/timing-service',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './snake-service', './snack-service', './screen-service', './score-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _snakeService, _snackService, _screenService, _scoreService) {
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

    var TimingService = exports.TimingService = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _snakeService.SnakeService, _snackService.SnackService, _screenService.ScreenService, _scoreService.ScoreService), _dec(_class = function () {
        function TimingService(eventAggregator, snakeService, snackService, screenService, scoreService) {
            var _this = this;

            _classCallCheck(this, TimingService);

            this.ea = eventAggregator;
            this.snakeService = snakeService;
            this.snackService = snackService;
            this.screenService = screenService;
            this.scoreService = scoreService;

            this.crawling = false;
            this.steps = 0;
            this.speed = 1;
            this.fallTimerHandle = null;
            this.stepTimerHandle = null;
            this.pause = false;

            this.baseGrowInterval = 10;
            this.baseScoreInterval = 10;
            this.baseSnackInterval = 10;
            this.baseSpeedupInterval = 100;
            this.maxStepInterval = 400;
            this.minStepInterval = 10;
            this.dropInterval = 0;
            this.snackDuration = 15000;

            this.methods = {
                axe: function axe() {
                    void 0;
                },
                beer: function beer() {
                    _this.growSlower();
                },
                bunny: function bunny() {
                    _this.speedUp();
                },
                diamond: function diamond() {
                    _this.scoreService.update(10000);
                },
                gold: function gold() {
                    _this.scoreService.update(1000);
                },
                ruby: function ruby() {
                    _this.multiPlyScore();
                },
                skull: function skull() {
                    _this.dropSnake();
                },
                snail: function snail() {
                    _this.slowDown();
                },
                trash: function trash() {
                    _this.snackService.initSnacks();
                },
                viagra: function viagra() {
                    _this.growHarder();
                }
            };

            this.setSubscribers();
        }

        TimingService.prototype.startGame = function startGame() {
            this.resetIntervals();
            this.scoreService.initScore();
            this.snakeService.initSnake();
            this.snackService.initSnacks();
            this.crawling = true;
            this.resumeGame();
        };

        TimingService.prototype.resumeGame = function resumeGame() {
            var _this2 = this;

            this.stepTimerHandle = setInterval(function () {
                _this2.drawScreen();
            }, this.stepInterval);
        };

        TimingService.prototype.drawScreen = function drawScreen() {
            this.steps += 1;
            var grow = this.steps % this.growInterval == 0;
            grow && this.ea.publish('grow', this.snakeService.snake.segments.length);
            this.steps % this.speedupInterval == 0 && this.speedUp();
            this.steps % this.snackInterval == 0 && this.snackService.addSnack();
            this.snakeService.step(grow);
            this.screenService.fadeArena();
            this.screenService.drawSnacks(this.snackService.snacks);
            this.screenService.drawSnake(this.snakeService.snake);
            this.scoreService.update(this.snakeService.snake.segments.length);
        };

        TimingService.prototype.dropSnake = function dropSnake() {
            var _this3 = this;

            this.fallTimerHandle = setInterval(function () {
                _this3.snakeService.fallDown();
                _this3.screenService.fadeArena();
                _this3.screenService.drawSnake(_this3.snakeService.snake);
            }, this.dropInterval);
        };

        TimingService.prototype.speedUp = function speedUp() {
            if (this.stepInterval > this.minStepInterval) {
                this.speed += 1;
                this.clearTimedEvents();
                this.stepInterval -= 40;
                this.resumeGame();
                this.ea.publish('speed', this.speed);
            }
        };

        TimingService.prototype.slowDown = function slowDown() {
            if (this.stepInterval < this.maxStepInterval) {
                this.speed -= 1;
                this.clearTimedEvents();
                this.stepInterval += 40;
                this.resumeGame();
                this.ea.publish('speed', this.speed);
            }
        };

        TimingService.prototype.growSlower = function growSlower() {
            var _this4 = this;

            this.growInterval += 5;
            setTimeout(function () {
                _this4.growInterval -= 5;
            }, this.snackDuration);
        };

        TimingService.prototype.growHarder = function growHarder() {
            var _this5 = this;

            if (this.growInterval > this.baseGrowInterval) {
                this.growInterval -= 5;
                setTimeout(function () {
                    _this5.growInterval += 5;
                }, this.snackDuration);
            }
        };

        TimingService.prototype.multiPlyScore = function multiPlyScore() {
            var _this6 = this;

            this.scoreService.setMultiplier();
            setTimeout(function () {
                _this6.scoreService.resetMultiplier();
            }, this.snackDuration);
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
            var _this7 = this;

            var direction = 0;
            this.ea.subscribe('keyPressed', function (response) {
                switch (response) {
                    case 'Enter':
                        _this7.ea.publish('start');
                        break;
                    case ' ':
                        _this7.ea.publish('pause');
                        break;
                }
            });
            this.ea.subscribe('die', function (response) {
                _this7.clearTimedEvents();
                _this7.dropSnake();
            });
            this.ea.subscribe('start', function (response) {
                _this7.restart();
            });
            this.ea.subscribe('pause', function (response) {
                _this7.pauseGame();
            });
            this.ea.subscribe('gameOver', function (response) {
                _this7.clearTimedEvents();
            });
            this.ea.subscribe('snack', function (response) {
                var method = response.split(':')[0].toLowerCase();
                _this7.methods[method]();
            });
        };

        TimingService.prototype.resetIntervals = function resetIntervals() {
            this.stepInterval = this.maxStepInterval;
            this.scoreInterval = this.baseSoreInterval;
            this.growInterval = this.baseGrowInterval;
            this.speedupInterval = this.baseSpeedupInterval;
            this.snackInterval = this.baseSnackInterval;
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
define('aurelia-cookie/aurelia-cookie',["require", "exports"], function (require, exports) {
    "use strict";
    var AureliaCookie = (function () {
        function AureliaCookie() {
        }
        /**
        *
        * Get a cookie by its name
        */
        AureliaCookie.get = function (name) {
            var cookies = this.all();
            if (cookies && cookies[name]) {
                return cookies[name];
            }
            return null;
        };
        /**
        * Set a cookie
        */
        AureliaCookie.set = function (name, value, options) {
            var str = this.encode(name) + "=" + this.encode(value);
            if (value === null) {
                options.expiry = -1;
            }
            /**
            * Expiry date in hours
            */
            if (options.expiry >= 0 && !options.expires) {
                var expires = new Date();
                expires.setHours(expires.getHours() + options.expiry);
                options.expires = expires;
            }
            if (options.path) {
                str += "; path=" + options.path;
            }
            if (options.domain) {
                str += "; domain=" + options.domain;
            }
            if (options.expires) {
                str += "; expires=" + options.expires.toUTCString();
            }
            if (options.secure) {
                str += '; secure';
            }
            document.cookie = str;
        };
        /**
        * Deletes a cookie by setting its expiry date in the past
        */
        AureliaCookie.delete = function (name, domain) {
            if (domain === void 0) { domain = null; }
            var cookieString = name + " =;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            if (domain) {
                cookieString += "; domain=" + domain;
            }
            document.cookie = cookieString;
        };
        /**
        * Get all set cookies and return an array
        */
        AureliaCookie.all = function () {
            return this.parse(document.cookie);
        };
        AureliaCookie.parse = function (str) {
            var obj = {};
            var pairs = str.split(/ *; */);
            var pair;
            if (pairs[0] === '') {
                return obj;
            }
            for (var i = 0; i < pairs.length; ++i) {
                pair = pairs[i].split('=');
                obj[this.decode(pair[0])] = this.decode(pair[1]);
            }
            return obj;
        };
        AureliaCookie.encode = function (value) {
            try {
                return encodeURIComponent(value);
            }
            catch (e) {
                return null;
            }
        };
        AureliaCookie.decode = function (value) {
            try {
                return decodeURIComponent(value);
            }
            catch (e) {
                return null;
            }
        };
        return AureliaCookie;
    }());
    exports.AureliaCookie = AureliaCookie;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"reset.css\"></require>\n    <require from=\"app.css\"></require>\n    <require from=\"components/game-screen\"></require>\n    <require from=\"components/restart-overlay\"></require>\n    <require from=\"components/status\"></require>\n    <h1 class=\"gameTitle\">${message}</h1>\n    <game-screen></game-screen>\n    <restart-overlay></restart-overlay>\n    <status></status>\n</template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "body {\n    position         : relative;\n    user-select      : none;\n    overflow         : hidden;\n    font-family      : 'Trebuchet MS', sans-serif;\n    background-color : crimson;\n    background-image : url(\"/images/border.png\");\n    background-repeat: no-repeat;\n    background-size  : 100% 100%;\n    height           : 100vh;\n}\n\n.gameTitle {\n    position      : absolute;\n    z-index       : 2;\n    top           : 0;\n    width         : 100vw;\n    letter-spacing: 1px;\n    font-size     : 20px;\n    line-height   : 24px;\n    text-align    : center;\n    color         : whitesmoke;\n}\n"; });
define('text!components/game-screen.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/game-screen.css\"></require>\n    <div class=\"snakeImages\">\n        <img repeat.for=\"image of snakeParts\"\n             class.bind=\"image\"\n             src=\"/images/${image}.png\">\n    </div>\n    <div class=\"snackImages\">\n        <img repeat.for=\"image of snackNames\"\n             class.bind=\"image\"\n             src=\"/images/${image}.png\">\n    </div>\n    <canvas id=\"arena\"\n            class=\"arena\"></canvas>\n</template>"; });
define('text!components/restart-overlay.html', ['module'], function(module) { module.exports = "<template class=\"${showOverlay || pause ? 'show' : ''}\"\n          click.delegate=\"start()\">\n    <require from=\"components/restart-overlay.css\"></require>\n    <h2 class=\"restart ${!pause && !firstGame ? 'show' : ''}\">Game over</h2>\n    <h2 class=\"restart ${!pause ? 'show' : ''}\">Click or tap or &lt;enter&gt; to start new game</h2>\n    <h2 class=\"paused ${pause ? 'show' : ''}\">Game paused</h2>\n    <h2 class=\"paused ${pause ? 'show' : ''}\">Press space to continue</h2>\n\n</template>"; });
define('text!reset.css', ['module'], function(module) { module.exports = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\n    margin        : 0;\n    padding       : 0;\n    border        : 0;\n    font-size     : 100%;\n    font          : inherit;\n    vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n    display: block;\n}\n\nbody {\n    line-height: 1;\n}\n\nol, ul {\n    list-style: none;\n}\n\nblockquote, q {\n    quotes: none;\n}\n\nblockquote:after, blockquote:before, q:after, q:before {\n    content: '';\n    content: none;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing : 0;\n}\n"; });
define('text!components/status.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"components/status.css\"></require>\n    <h2 class=\"statusLine\">\n        <span>Speed:</span><span class=\"speed\">${speed}</span>\n        <span>Length:</span><span class=\"length\">${length}</span>\n        <span>Score:</span><span class=\"score\">${score}</span>\n        <span click.delegate=\"resetHighscore()\"><span>High:</span><span class=\"high\">${highScore}</span></span>\n        <span class=\"snack\"\n              innerhtml.bind=\"snack\"></span>\n    </h2>\n</template>"; });
define('text!components/game-screen.css', ['module'], function(module) { module.exports = "game-Screen {\n    display        : flex;\n    flex-direction : column;\n    justify-content: center;\n    align-items    : center;\n    width          : 100vw;\n    height         : 100vh;\n    position       : relative;\n}\n\n.arena {\n    background-color: black;\n}\n\n.snackImages, .snakeImages {\n    display : none;\n    position: absolute;\n    top     : 0;\n    left    : 0;\n    z-index : 0;\n}\n"; });
define('text!components/restart-overlay.css', ['module'], function(module) { module.exports = "restart-overlay {\n    position        : absolute;\n    z-index         : 10;\n    top             : 0;\n    left            : 0;\n    display         : flex;\n    flex-direction  : column;\n    justify-content : space-around;\n    align-items     : center;\n    width           : 100vw;\n    height          : 100vh;\n    background-color: rgba(0,0,0,.7);\n    opacity         : 0;\n    pointer-events  : none;\n    transition      : all .2s;\n}\n\nrestart-overlay.show {\n    opacity       : 1;\n    pointer-events: all;\n}\n\nrestart-overlay h2 {\n    font-size  : 5vh;\n    line-height: 5vh;\n    color      : whitesmoke;\n}\n\n.paused, .restart {\n    display: none;\n}\n\n.paused.show, .restart.show {\n    display: block;\n}\n"; });
define('text!components/status.css', ['module'], function(module) { module.exports = "status {\n    position  : absolute;\n    z-index   : 2;\n    bottom    : 0;\n    width     : 100vw;\n    text-align: center;\n}\n\n.statusLine {\n    font-size  : 18px;\n    line-height: 30px;\n    color      : wheat;\n    /* margin-left: 24px; */\n}\n\n.length, .score, .snack, .speed {\n    margin-right: 10px;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map