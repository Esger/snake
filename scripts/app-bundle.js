define('app',['exports', 'aurelia-framework', 'jquery'], function (exports, _aureliaFramework, _jquery) {
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

    var App = exports.App = function () {
        function App() {
            _classCallCheck(this, App);

            this.message = 'Snake by ashWare';
            this.spriteSize = 16;
            this.stepTimerHandle = null;
            this.snake = {
                direction: 0,
                directions: [[1, 0], [0, 1], [-1, 0], [0, -1]],
                images: [],
                segments: [],
                stepInterval: 10
            };
        }

        App.prototype.crawl = function crawl() {
            var _this = this;

            this.stepTimerHandle = setInterval(function () {
                _this.drawSnake();
            }, this.snake.stepInterval);
        };

        App.prototype.drawSnake = function drawSnake() {
            this.fadeArena();
            for (var i = 0; i < this.snake.segments.length; i++) {
                var segment = this.snake.segments[i];
                i == 0 ? this.advanceSegment(i) : this.followSegment(i, i - 1);
                this.drawSegment(segment);
            }
        };

        App.prototype.advanceSegment = function advanceSegment(i) {
            this.snake.segments[i].position[0] += this.snake.directions[this.snake.direction][0];
            this.snake.segments[i].position[1] += this.snake.directions[this.snake.direction][1];
        };

        App.prototype.followSegment = function followSegment(i, j) {
            var segment = this.snake.segments[i];
            var preceder = this.snake.segments[j];
            var dx = preceder.position[0] - segment.position[0];
            if (dx !== 0) {
                var absDx = Math.abs(dx);
                var stepX = Math.round(absDx / dx);
                absDx > this.spriteSize ? segment.position[0] += stepX : null;
            }
        };

        App.prototype.drawSegment = function drawSegment(imgObj) {
            var ctx = this.ctx;
            ctx.save();
            ctx.translate(imgObj.position[0], imgObj.position[1]);
            ctx.drawImage(this.snake.images[imgObj.imgIndex], this.spriteSize, this.spriteSize);
            ctx.restore();
        };

        App.prototype.fadeArena = function fadeArena() {
            var ctx = this.ctx;
            ctx.fillStyle = 'rgba(0,0,0,.1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };

        App.prototype.initSnake = function initSnake() {
            var canvasCenter = {
                x: parseInt(this.$arena.width() / 2, 10),
                y: parseInt(this.$arena.height() / 2, 10)
            };
            for (var i = 0; i < this.snake.images.length; i++) {
                var $img = this.snake.images[i];
                var segment = {
                    imgIndex: i,
                    position: [canvasCenter.x, canvasCenter.y]
                };
                this.snake.segments.push(segment);
            }
        };

        App.prototype.setDomVars = function setDomVars() {
            this.$arena = (0, _jquery2.default)('.arena');
            this.canvas = document.getElementById('arena');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.snake.images = [(0, _jquery2.default)('.head')[0], (0, _jquery2.default)('.body')[0], (0, _jquery2.default)('.tail')[0]];
        };

        App.prototype.attached = function attached() {
            var _this2 = this;

            this.setDomVars();
            this.initSnake();
            (0, _jquery2.default)(function () {
                _this2.crawl();
            });
        };

        return App;
    }();
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
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"reset.css\"></require>\n    <require from=\"app.css\"></require>\n    <h1 class=\"gameTitle\">${message}</h1>\n    <canvas id=\"arena\"\n            class=\"arena\"></canvas>\n    <div class=\"snakeImages\">\n        <img class=\"head\"\n             src=\"/images/head.png\">\n        <img class=\"body\"\n             src=\"/images/body.png\">\n        <img class=\"tail\"\n             src=\"/images/tail.png\">\n    </div>\n</template>"; });
define('text!app.css', ['module'], function(module) { module.exports = "body {\n    position: relative;\n}\n\n.gameTitle {\n    position      : absolute;\n    z-index       : 2;\n    top           : 0;\n    width         : 100vw;\n    font-family   : 'Trebuchet MS', sans-serif;\n    letter-spacing: 1px;\n    font-size     : 20px;\n    line-height   : 30px;\n    text-align    : center;\n    color         : whitesmoke;\n}\n\n.arena {\n    position        : relative;\n    z-index         : 1;\n    width           : calc(100vw - 60px);\n    height          : calc(100vh - 60px);\n    background-color: black;\n    border          : 30px solid crimson;\n}\n\n.snakeImages {\n    display : none;\n    position: absolute;\n    top     : 0;\n    left    : 0;\n    z-index : 0;\n}\n"; });
define('text!reset.css', ['module'], function(module) { module.exports = "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\n    margin        : 0;\n    padding       : 0;\n    border        : 0;\n    font-size     : 100%;\n    font          : inherit;\n    vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n    display: block;\n}\n\nbody {\n    line-height: 1;\n}\n\nol, ul {\n    list-style: none;\n}\n\nblockquote, q {\n    quotes: none;\n}\n\nblockquote:after, blockquote:before, q:after, q:before {\n    content: '';\n    content: none;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing : 0;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map