(function () { //视窗控制
    var calcRem = function () {
        var dpr = window.devicePixelRatio || 1;
        var docWidth = Math.min(750, document.documentElement.clientWidth, window.screen.availWidth);
        var calcFontSize = docWidth * dpr / 10;
        var scale = parseFloat(1 / dpr).toFixed(2);
        var viwPortEle = document.querySelector('meta[name=viewport]');
        // document.body.style.width=docWidth+'px';
        document.querySelector('html').setAttribute('style', 'font-size:' + calcFontSize.toFixed(2) + 'px');
        viwPortEle.setAttribute('content', 'width=' + docWidth * dpr.toFixed(2) + ', user-scalable=no, initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale);
    };
    document.addEventListener('DOMContentLoaded', function () {
        calcRem();
    });
    window.addEventListener('resize', function () {
        setTimeout(function () {
            calcRem()
        }, 0);
    });
}());

document.addEventListener('DOMContentLoaded', function () {
    window.speechSynthesis.cancel();
    var utter = new window.SpeechSynthesisUtterance();
    utter.addEventListener('end', function () {
        speaker.setStatus('REPLAY', 0)
    })
    var speaker = new Vue({
        el: '#speech',
        data: {
            support:!!new window.SpeechSynthesisUtterance(),
            speechText: '你好！念一首诗给你听，好不好？床前明月光，疑是地上霜，举头望明月，低头思故乡',
            voices: [],
            voiceObj: {},
            pitch: '7',//0-2
            rate: '8',//0.1-10 speed
            volume: '10',//0-1 
            status: {
                text: 'PLAY',
                type: 0
            },
            showSet:false
        },
        watch: {
            pitch: function () {
                utter.pitch = parseFloat(this.pitch / 10).toFixed(1);
            },
            rate: function () {
                utter.rate = parseFloat(this.rate / 10).toFixed(1);
            },
            volume: function () {
                utter.volume = parseFloat(this.volume / 10).toFixed(1);
            }
        },
        methods: {
            getVoice: function () {
                if (this.voices.length) {
                    this.showSet=!this.showSet;
                } else {
                    var voices = this.voices = [];
                    this.showSet=true;
                    window.speechSynthesis.getVoices().forEach(function (obj) {
                        if (/zh-[a-z]*/i.test(obj.lang)) {
                            voices.push(obj)
                        }
                    });
                }

            },
            setVoice: function (voice, index) {
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.pause();
                    this.setStatus('RESUME', 2);
                }
                utter.voice = this.voiceObj = voice

            },
            setText: function (num) {
                this.stop();
                var str = '';
                if (num != 100) {
                    for (var i = 0; i < num; i++) {
                        str = str + (i + 1) + ',2,3,4,5,6,7,8.\r\n'
                        if (i == num - 1) {
                            this.speechText = str;
                        }
                    }
                } else {
                    for (var i = 0; i < num; i++) {
                        if (!((i + 1) % 10)) {
                            str = str + (i + 1) + '.\r\n';
                        } else {
                            str = str + (i + 1) + ',';
                        }
                        if (i == num - 1) {
                            this.speechText = str;
                        }
                    }
                }
                
            },
            setStatus: function (str, num) {
                console.log(this.status);
                this.status.text = str;
                this.status.type = num;
            },
            play: function () {
                console.log(utter)
                switch (this.status.type) {
                    case 0:
                        utter.text = '现在开始:'+this.speechText+'......结束';
                        window.speechSynthesis.speak(utter);
                        this.setStatus('PAUSE', 1)
                        break;
                    case 1:
                        window.speechSynthesis.pause();
                        this.setStatus('RESUME', 2)
                        break;
                    case 2:
                        if (window.speechSynthesis.speaking) {
                            window.speechSynthesis.resume();
                            this.setStatus('PAUSE', 1)
                        } else {
                            window.speechSynthesis.cancel();
                            this.setStatus('REPLAY', 0)
                        }
                    default:
                        break;
                }
            },
            stop: function () {
                window.speechSynthesis.cancel();
                this.setStatus('PLAY', 0)
            }
        }
    });
    utter.pitch = parseFloat(speaker.pitch / 10).toFixed(1);
    utter.rate = parseFloat(speaker.rate / 10).toFixed(1);
    utter.volume = parseFloat(speaker.volume / 10).toFixed(1);

})