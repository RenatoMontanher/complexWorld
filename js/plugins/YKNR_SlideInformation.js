//============================================================================
// YKNR_SlideInformation.js - ver.2.0.0
// ---------------------------------------------------------------------------
// Copyright (c) 2017 Yakinori
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//============================================================================
/*:
 * ===========================================================================
 * @plugindesc Information window that displays texts by sliding from the right
 * @author Yakinori
 * ===========================================================================
 *
 * @param InfomationData
 * @text Set text to show
 * @desc Texts to be displayed in the notification window.
 * Select a blank line in the list and enter Keyword and Texts to go with.
 * @type struct<StructInfoData>[]
 * @default ["{\"Keyword\":\"test\",\"Texts\":\"\\\\C[1]Notice \\\\C[0]This is a test message.\"}"]
 *
 * @param WindowData
 * @text Notification window settings
 * @type struct<StructInfoWindow>
 * @desc Set the window position, size, and appearance.
 * @default {"posX":"340","posY":"0","width":"0","visibleLine":"1","lineHeight":"30","padding":"10","opacity":"-1","backOpacity":"-1","fontFace":"GameFont","fontSize":"22","skin":"Window"}
 *
 * @param SoundData
 * @text SE settings for playback
 * @desc Play a sound when the notification window opens
 * If the SE name is set to “None”, it will not play.
 * @type struct<StructSoundEffect>
 * @default {"name":"Item1","volume":"90","pitch":"100","pan":"0"}
 *
 * @param SlideData
 * @text Slide in / out settings
 * @desc Set the text behavior in the notification window.
 * @type struct<StructSlideParams>
 * @default {"inDur":"60","inSpd":"0","enableEaseCubicOut":"true","outDur":"0","outSpd":"2.5","interval":"120"}
 *
 * @help
 * ===========================================================================
 *【！Attention！】
 * ※This plugin doesn't work for MV version 1.4.X or earlier.
 * ===========================================================================
 * A notification window that allows text to slide from the right.
 * By default, it;s displayed at the top of the screen without covering the map.
 * ===========================================================================
 *【About】
 * ・Plugin parameters for position and width of the screen.
 * ・Slide text from right to left can be displayed on the map or during battle
 *
 * ---------------------------------------------------------------------------
 *【Game specifications】
 * ・Characters can be moved while the notification is displayed.
 * ・ The scenes where the notification window functions in maps/ battles.
 * ・ If the following occurs while the notification window is active:
 * 　CLOSE even if the texts is not fully displayed
 * 　・Execute event
 * 　・Battle begins
 * 　・Return from the battle
 * ・If the following occurs while the notification window is active:
 * 　Display text again
 * 　・Move to another map
 * 　・Open the menu
 * ・If a notification is displayed while the map name is shown,
 * 　Depending on the display position, it may overlap map name.
 *
 * ---------------------------------------------------------------------------
 *【Plugin commands】
 * Two types of commands are available.
 *
 * --------------------------------------
 * notif keyword
 * --------------------------------------
 * Displays texts using the keyword in the plugin parameter.
 *
 * --------------------------------------
 * recall
 * --------------------------------------
 * Displays the previous notification again.
 *
 * ---------------------------------------------------------------------------
 *
 *【Parameter setting example】
 *
 * ■ Value set by default
 * 　　Slide in time: 60
 * 　　Slide in_speed: 0
 * 　　Slide in_constant speed: OFF
 * 　　Slide out_time: 0
 * 　　Slide out_speed: 2.5
 * 　　Slide interval: 120
 *
 * ■ Moves from right to left at a constant speed.。
 * 　Close after displaying all
 * 　　Slide in time: 0
 * 　　Slide in_speed: 3
 * 　　Slide in_constant speed: ON
 * 　　Slide out_time: 0
 * 　　Slide out_speed: 3
 * 　　Slide interval: 0
 *
 * ■ Displays without sliding and closes without sliding after 150F.
 * 　Text longer than the window can be cut off
 * 　　Slide in time: 0
 * 　　Slide in_speed: 0
 * 　　Slide in_constant speed: ON
 * 　　Slide out_time: 0
 * 　　Slide out_speed: 0
 * 　　Slide interval: 150
 *
 *
 * ---------------------------------------------------------------------------
 *【Changelog】
 * [2017/10/15] [2.0.0] ・Parameters correspond with specifications after 1.5.0.
 *                        Parameter names has been changed and must be set again.
 *                      ・Notification text without using external data
 *                        Changed parameter to use the setting function.
 * [2017/03/05] [1.0.0] Release
 *
 * ===========================================================================
 * [Blog]   : http://mata-tuku.ldblog.jp/
 * [Twitter]: https://twitter.com/Noritake0424
 * ---------------------------------------------------------------------------
 * Licensed under MIT License. Feel free to use.
 * http://opensource.org/licenses/mit-license.php
*/
/*~struct~StructInfoData:
 * @param Keyword
 * @desc Register keyword to call texts.
 * Make sure it ’s unique.
 * @default Insert keyword here
 *
 * @param Texts
 * @desc Register texts to correspond with Keyword.
 * Control characters can also be used.
 * @default Insert message here
 */
/*~struct~StructInfoWindow:
 * @param posX
 * @text X coordinate
 * @desc Set X coordinate for info window.
 * Upper left corner of the window is the origin.
 * @type number
 * @default 340
 *
 * @param posY
 * @text Y coordinate
 * @desc Set Y coordinate for info window.
 * Upper left corner of the window is the origin.
 * @type number
 * @default 0
 *
 * @param width
 * @text Window width
 * @desc Set window width.
 * If 0, the size from the X coordinate to the screen edge.
 * @type number
 * @min 0
 * @default 0
 *
 * @param visibleLine
 * @text # of lines to display
 * @desc Set the number of lines to show.
 * The window height is adjusted by specified number of lines.
 * @type number
 * @min 1
 * @default 1
 *
 * @param lineHeight
 * @text Height per line
 * @desc Set here to change the window height.
 * If 0, refer to LineHeight of Window_Base.
 * @type number
 * @min 0
 * @default 30
 *
 * @param padding
 * @text Padding
 * @desc Set here to change the window padding.
 * If -1, refer to standardPadding of Window_Base.
 * @type number
 * @min -1
 * @default 10
 *
 * @param opacity
 * @text Window transparency
 * @desc Set here to change the transparency for window.
 * -1 defaults to 255.
 * @type number
 * @min -1
 * @max 255
 * @default -1
 *
 * @param backOpacity
 * @text Window background transparency
 * @desc Set here to change the transparency of the window background.
 * If -1, refer to the standardBackOpacity of Window_Base.
 * @type number
 * @min -1
 * @max 255
 * @default -1
 *
 * @param fontFace
 * @text FontFace
 * @desc Set here to change the font.
 * If not specified, reference standardFontFace of Window_Base.
 * @type string
 * @default GameFont
 *
 * @param fontSize
 * @text Font size
 * @desc Set here to change the font size.
 * If 0, refer to the standardFontSize of Window_Base.
 * @type number
 * @min 0
 * @default 22
 *
 * @param skin
 * @text Window skin
 * @desc If you want to use another skin, set the file name here.
 * If not specified, the default Window is set.
 * @type file
 * @require 1
 * @dir img/system/
 * @default Window
 */
/*~struct~StructSoundEffect:
 * @param name
 * @text SE name
 * @desc Set the SE to play when the window is opened.
 * If not specified, playback will not be performed.
 * @type file
 * @require 1
 * @dir audio/se/
 * @default Item1
 *
 * @param volume
 * @text Volume
 * @desc Sets the volume of SE to play when the window is opened.
 * If not specified, defaults to 90.
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param pitch
 * @text Pitch
 * @desc Sets the SE pitch to play when the window is opened.
 * If not specified, the default is 100.
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param pan
 * @text Pan
 * @desc Sets the pan of SE to play when the window is opened.
 * If not specified, it defaults to 0.
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */
/*~struct~StructSlideParams:
 * @param inDur
 * @text Slide in_time
 * @desc Set the slide in time by frames.
 * Speed will not work unless it is set to 0.
 * @type number
 * @min 0
 * @default 60
 *
 * @param inSpd
 * @text Slide in_speed
 * @desc Set the slide in speed.
 * Time will not work unless it is set to 0.
 * @type number
 * @min 0
 * @decimals 2
 * @default 0
 *
 * @param enableEaseCubicOut
 * @text Apply ease effect
 * @desc You can select whether the slide in action is curve or constant speed.
 * The curve uses “Cubic Out”.
 * @type boolean
 * @on Curve
 * @off Constant speed
 * @default true
 *
 * @param outDur
 * @text slide out_time
 * @desc Set the slifde out time by frames.
 * Speed will not work unless it is set to 0.
 * @type number
 * @min 0
 * @default 0
 *
 * @param outSpd
 * @text slide out_speed
 * @desc Set the speed to slide out.
 * Time will not work unless it is set to 0.
 * @type number
 * @min 0
 * @decimals 2
 * @default 2.5
 *
 * @param interval
 * @text slide interval
 * @desc Pause time between slide in and slide out
 * Specify in frames.
 * @type number
 * @min 0
 * @default 150
 */

(function() {
    'use strict';

    //------------------------------------------------------------------------
    /**
     * Jsonをパースし, プロパティの値を変換して返す
     *
     * @method jsonParamsParse
     * @param {String} json JSON文字列
     * @return {Object} パース後のオブジェクト
     */
    var jsonParamsParse = function(json) {
        return JSON.parse(json, parseRevive);
    };

    var parseRevive = function(key, value) {
        if (key === '') { return value; }
        try {
            return JSON.parse(value, parseRevive);
        } catch (e) {
            return value;
        }
    };

    /**
     * Jsonをパースして変換後, 配列ならば連想配列に変換して返す
     *
     * @method parseArrayToHash
     * @param {String} json JSON文字列
     * @param {String} keyName 連想配列のキーとする要素のあるプロパティ名
     * @param {String} valueName 連想配列の値とする要素のあるプロパティ名
     * @return {Object} パース後の連想配列
     */
    var parseArrayToHash = function(json, keyName, valueName) {
        var hash = {};
        var array = jsonParamsParse(json);
        if (Array.isArray(array)) {
            for (var i = 0; i < array.length; i++) {
                var key = array[i][keyName];
                if (key && key !== '') {
                    hash[key] = array[i][valueName] || null;
                }
            }
        }
        return hash;
    };


    //------------------------------------------------------------------------
    // パラメータを受け取る.
    var parameters = PluginManager.parameters('YKNR_SlideInformation');

    var infomationTable = parameters['InfomationData'];
    var infomationData = parseArrayToHash(infomationTable, 'Keyword', 'Texts');
    var windowData = jsonParamsParse(parameters['WindowData']);
    var seData = jsonParamsParse(parameters['SoundData']);
    var slideData = jsonParamsParse(parameters['SlideData']);

    //------------------------------------------------------------------------
    var _informationMessage = '';
    var _openInformation = false;

    //------------------------------------------------------------------------
    // 拡張プラグインコマンドの任意の引数判定用文字列.
    var VAR = '%$';
    var pluginCommands = [
        ['notif', VAR, function(args) { setInformationMessage(args[0]); openInformation(); }],
        ['recall', function(args) { openInformation(); }],
    ];

    /**
     * リストから一致する拡張プラグインコマンドの走査と実行
     *
     * @method executeExtendPluginCommand
     * @param {Game_Interpreter} thisArg インスタンス
     * @param {Array<Array>} list [コマンド名, 各引数名, 実行関数] からなる2次元配列
     * @param {String} command コマンド名
     * @param {Array<String>} args コマンドの引数
     * @return {Boolean} 実行されたら true を返します
     */
    var executeExtendPluginCommand = function(thisArg, list, command, args) {
        for (var i = 0; i < list.length; i++) {
            var extData = list[i];
            var extCommand = extData[0];
            var extArgs = extData.slice(1, -1);
            if (!checkExtendPluginCommand(extCommand, extArgs, command, args)) {
                continue;
            }

            // 実行.
            var method = extData[extData.length - 1];
            if (typeof method === "string") {
                thisArg[method](args);
            } else {
                method.call(thisArg, args);
            }
            return true;
        }
        return false;
    };

    /**
     * 対象の拡張プラグインコマンドか判定
     *
     * @method checkExtendPluginCommand
     * @param {String} extCommand 拡張プラグインコマンド名
     * @param {Array<String>} extArgs 拡張プラグインコマンド引数
     * @param {String} command コマンド名
     * @param {Array<String>} args コマンドの引数
     * @return {Boolean} 実行可能なら true を返します
    */
    var checkExtendPluginCommand = function(extCommand, extArgs, command, args) {
        // コマンド名が一致しているか判定.
        if (extCommand !== command) {
            return false;
        }

        // 引数が一致しているか判定.
        for (var i = 0; i < extArgs.length; i++) {
            var extArg = extArgs[i];

            // 任意の引数ではないなら次の判定へ.
            if (extArg !== VAR) {
                // 引数が一致していないなら実行できない.
                if (extArg !== args[i]) {
                    return false;
                }
            }
        }

        return true;
    };

    //------------------------------------------------------------------------
    var _Game_Interpreter_prototype_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        if (!executeExtendPluginCommand(this, pluginCommands, command, args)) {
            _Game_Interpreter_prototype_pluginCommand.call(this, command, args);
        }
    };

    //------------------------------------------------------------------------
    /**
     * お知らせのテキストを設定.
     *
     * @method setInformationMessage
     * @param {String} key 表示するお知らせのKey.
    */
    var setInformationMessage = function(key) {
        if (key) {
            _informationMessage = infomationData[key] || '';
        } else {
            _informationMessage = '';
        }
    };

    /**
     * notif開始. 事前にテキスト設定済みであれば有効化される.
     *
     * @method openInformation
    */
    var openInformation = function() {
        _openInformation = !!_informationMessage;
    };

    /**
     * お知らせを閉じる.
     *
     * @method closeInformation
    */
    var closeInformation = function() {
        _openInformation = false;
    };

    //------------------------------------------------------------------------
    /**
     * お知らせ一覧を取得する.
     *
     * @method getInfomationTable
    */
    Game_System.prototype.getInfomationTable = function() {
        return infomationTable;
    };

    /**
     * -----------------------------------------------------------------------
     * Window_Information
     *
     * お知らせ表示用のウィンドウ. テキストのスライド処理も含まれている.
     * @constructor
     */
    function Window_Information() {
        this.initialize.apply(this, arguments);
    }

    Window_Information.prototype = Object.create(Window_Base.prototype);
    Window_Information.prototype.constructor = Window_Information;

    /**
     * 初期化処理
     *
     * @method Window_Information.prototype.initialize
    */
    Window_Information.prototype.initialize = function() {
        var x = windowData.posX;
        var y = windowData.posY;
        var w = windowData.width;
        w = (w > 0) ? w : Graphics.boxWidth - x;
        var num = windowData.visibleLine;
        var h = this.fittingHeight(num);
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this.hide();
        this.openness = 0;

        if (windowData.opacity >= 0) {
            this.opacity = windowData.opacity;
        }
        this.initMembers();
    };

    /**
     * メンバー変数の初期化処理
     *
     * @method Window_Information.prototype.initMembers
    */
    Window_Information.prototype.initMembers = function() {
        this._text = '';
        this._textState = null;
        this._endClose = false;
        this._isRunningCurrentEvent = false;
        this._isObserveEvent = false;
    };

    Window_Information.prototype.lineHeight = function() {
        if (windowData.lineHeight > 0) {
            return windowData.lineHeight;
        } else {
            return Window_Base.prototype.lineHeight.call(this);
        }
    };

    Window_Information.prototype.standardFontFace = function() {
        if (windowData.fontFace) {
            return windowData.fontFace;
        } else {
            return Window_Base.prototype.standardFontFace.call(this);
        }
    };

    Window_Information.prototype.standardFontSize = function() {
        if (windowData.fontSize > 0) {
            return windowData.fontSize;
        } else {
            return Window_Base.prototype.standardFontSize.call(this);
        }
    };

    Window_Information.prototype.standardPadding = function() {
        if (windowData.padding >= 0) {
            return windowData.padding;
        } else {
            return Window_Base.prototype.standardPadding.call(this);
        }
    };

    Window_Information.prototype.standardBackOpacity = function() {
        if (windowData.backOpacity >= 0) {
            return windowData.backOpacity;
        } else {
            return Window_Base.prototype.standardBackOpacity.call(this);
        }
    };

    Window_Information.prototype.loadWindowskin = function() {
        var skin = windowData.skin;
        if (skin) {
            this.windowskin = ImageManager.loadSystem(skin);
        } else {
            Window_Base.prototype.loadWindowskin.call(this);
        }
    };

    Window_Information.prototype.close = function() {
        Window_Base.prototype.close.call(this);
        this.terminateMessage();
    };

    /**
     * テキスト表示関連のメンバー変数を削除します.
     *
     * @method Window_Information.prototype.terminateMessage
    */
    Window_Information.prototype.terminateMessage = function() {
        if (this._endClose) {
            closeInformation();
        }
        this._textState = null;
        this._isRunningCurrentEvent = false;
        this._isObserveEvent = false;
    };

    Window_Information.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.updateInformation();
    };

    /**
     * 閉じるときに更新する処理. 閉じ終えたら非表示にします.
     *
     * @method Window_Information.prototype.updateClose
    */
    Window_Information.prototype.updateClose = function() {
        if (this.isClosing()) {
            Window_Base.prototype.updateClose.call(this);
            if (this.isClosed()) {
                this.hide();
            }
        }
    };

    /**
    * お知らせ全体の更新処理. パラメーターを監視して自動で開閉処理を行います.
    *
    * @method Window_Information.prototype.updateInformation
   */
    Window_Information.prototype.updateInformation = function() {
        while (!this.isOpening() && !this.isClosing()) {
            this.updateObserveEventRunning();

            if (this.updateMessage()) {
                return;
            } else if (this.canStart()) {
                this.startMessage();
            } else if (this.isAutoEndMessage()) {
                this._endClose = false;
                this.endMessage();
                return;
            } else {
                return;
            }
        }
    };

    /**
    * お知らせを設定したイベントの終了を監視する処理.
    *
    * @method Window_Information.prototype.updateObserveEventRunning
   */
    Window_Information.prototype.updateObserveEventRunning = function() {
        if (this._isObserveEvent) {
            if ($gameMap.isEventRunning() || $gameTroop.isEventRunning()) {
                this._isRunningCurrentEvent = true;
            } else {
                this._isRunningCurrentEvent = false;
                this._isObserveEvent = false;
            }
        }
    };

    /**
     * お知らせ表示処理の開始が可能か判定.
     *
     * @method Window_Information.prototype.canStart
     * @return {Boolean} 開始可能なら true を返します
    */
    Window_Information.prototype.canStart = function() {
        if (!$gameMap.isEventRunning() && !$gameTroop.isEventRunning()) {
            return !!_openInformation && !!_informationMessage;
        }
        return false;
    };

    /**
     * お知らせ表示開始処理.
     *
     * @method Window_Information.prototype.startMessage
    */
    Window_Information.prototype.startMessage = function() {
        this._isObserveEvent = true;
        this._text = _informationMessage;
        var convert_text = this.convertEscapeCharacters(this._text);
        this._textState = {};
        this._textState.phese = 0;
        this._textState.phese1_counter = 0;
        this._textState.width = this.textWidth(convert_text);
        this._textState.width += this.standardFontSize();
        this._textState.slidein = this.createTweenObject();
        this._textState.slidein.from = -this.contentsWidth();
        this._textState.slidein.to = 0;
        this._textState.slidein.speed = slideData.inSpd;
        this._textState.slidein.duration = slideData.inDur;
        if (slideData.enableEaseCubicOut) {
            this._textState.slidein.easing = this.updateSlideCurve;
        }
        this._textState.slideout = this.createTweenObject();
        this._textState.slideout.from = 0;
        this._textState.slideout.to = this._textState.width;
        this._textState.slideout.speed = slideData.outSpd;
        this._textState.slideout.duration = slideData.outDur;

        this.origin.x = this._textState.slidein.calc();

        if (seData.name) {
            AudioManager.playSe(seData);
        }

        this.refresh();
        this.show();
        this.open();
    };

    /**
     * お知らせ表示終了処理.
     *
     * @method Window_Information.prototype.endMessage
    */
    Window_Information.prototype.endMessage = function() {
        this.close();
        this._endClose = false;
    };

    /**
     * お知らせのスライドイン/アウトの更新処理. 
     *
     * @method Window_Information.prototype.updateMessage
     * @return {Boolean} 更新中なら true を返します
    */
    Window_Information.prototype.updateMessage = function() {
        if (this.isRunningMessage()) {
            switch (this._textState.phese) {
                case 0:
                    this.origin.x = this._textState.slidein.calc();
                    if (this._textState.slidein.progress < 1) {
                        return true;
                    }
                    this._textState.phese++;
                case 1:
                    if (++this._textState.phese1_counter < slideData.interval) {
                        return true;
                    }
                    this._textState.phese++;
                case 2:
                    this.origin.x = this._textState.slideout.calc();
                    if (this._textState.slideout.progress < 1) {
                        return true;
                    }
                    this._textState.phese++;
            }
            this._endClose = true;
            this.endMessage();
            return true;
        } else {
            return false;
        }
    };

    /**
     * Tween処理に使用するオブジェクトを取得します.
     *
     * @method Window_Information.prototype.createTweenObject
     * @return {Object} 基本処理やプロパティのオブジェクト を返します
    */
    Window_Information.prototype.createTweenObject = function() {
        return {
            _rate: function(current) {
                var rate = 1;
                if (this.duration > 0 && this.speed === 0) {
                    rate = current / this.duration;
                } else if (this.duration === 0 && this.speed > 0) {
                    var total = (this.to - this.from) / this.speed;
                    rate = current / total;
                }
                return rate.clamp(0, 1);
            },
            calc: function() {
                this.progress = this._rate(this._current++);
                var easing_rate = this.easing(this.progress);
                return this.from + (this.to - this.from) * easing_rate;
            },
            easing: function(rate) { return rate; },
            _current: 0,
            progress: 0,
            from: 0,
            to: 0,
            duration: 0,
            speed: 0,
        };
    };

    /**
     * Tweenのカーブ処理を返します.
     *
     * @method Window_Information.prototype.createTweenObject
     * @param {Number} k : 進行率
     * @return {Number} 進行率からの現在の割合を返します
    */
    Window_Information.prototype.updateSlideCurve = function(k) {
        // Tween Cubic Out.
        return --k * k * k + 1;
    };

    /**
     * お知らせのテキスト処理実行中か判定.
     *
     * @method Window_Information.prototype.isRunningMessage
     * @return {Boolean} 実行中なら true を返します
    */
    Window_Information.prototype.isRunningMessage = function() {
        if (this._textState) {
            return !this.isAutoEndMessage();
        }
        return false;
    };

    /**
     * お知らせのテキスト処理の自動終了判定.
     *
     * @method Window_Information.prototype.isAutoEndMessage
     * @return {Boolean} 自動終了できるなら true を返します
    */
    Window_Information.prototype.isAutoEndMessage = function() {
        if (this.isOpen() && !this._isRunningCurrentEvent) {
            // 新たにイベントが実行されたなら強制終了.
            if ($gameMap.isEventRunning() || $gameTroop.isEventRunning()) {
                return true;
            }
            // 現在と違うテキストが設定されているならば終了.
            return this._text != _informationMessage;
        }
        return false;
    };

    /**
     * ウィンドウの内容の短形のサイズを更新します.
     *
     * @method Window_Information.prototype.resizeContents
    */
    Window_Information.prototype.resizeContents = function(width, height) {
        this.contents.resize(width, height);
        this._windowContentsSprite._refresh();
    };

    /**
     * ウィンドウの内容を更新します.
     *
     * @method Window_Information.prototype.refresh
    */
    Window_Information.prototype.refresh = function() {
        var w = this._textState ? this._textState.width : this.contents.width;
        var h = this.contents.height;
        this.contents.clear();
        this.resizeContents(w, h);
        this.drawTextEx(this._text, this.textPadding(), 0);
    };

    //------------------------------------------------------------------------
    /**
     * お知らせのテキストを返します.
     *
     * @method Game_System.prototype.getInfomation
     * @return {String} 
    */
    Game_System.prototype.getInfomation = function() {
        return this._information |= '';
    };

    /**
     * お知らせのテキストを設定します.
     *
     * @method Game_System.prototype.setInfomation
     * @param {String} new_info 設定するテキスト
    */
    Game_System.prototype.setInfomation = function(new_info) {
        this._information = new_info;
    };

    //------------------------------------------------------------------------
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createInformationWindow();
    };

    /**
     * お知らせウィンドウの作成.
     *
     * @method Scene_Map.prototype.createInformationWindow
    */
    Scene_Map.prototype.createInformationWindow = function() {
        this._informationWindow = new Window_Information();
        this.addChild(this._informationWindow);

        // マップ & メニュー以外のシーンから来た場合はメッセージをリセット.
        if (!SceneManager.isPreviousScene(Scene_Map)) {
            if (!SceneManager.isPreviousScene(Scene_Menu)) {
                setInformationMessage('');
            }
        }
    };

    //------------------------------------------------------------------------
    var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_terminate.call(this);
        // バトル終了時はメッセージをリセット.
        setInformationMessage('');
    };

    var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.createInformationWindow();
    };

    /**
     * お知らせウィンドウの作成.
     *
     * @method Scene_Battle.prototype.createInformationWindow
    */
    Scene_Battle.prototype.createInformationWindow = function() {
        this._informationWindow = new Window_Information();
        this.addWindow(this._informationWindow);
        setInformationMessage('');
    };

})();
