window.addEventListener("DOMContentLoaded",function(){document.body.parentNode.$data={},require("main")});var require=function(){var e={};return function(r,o){var n;if(o=window["#"+r],"undefined"==typeof o){var t=new Error("Required module not found: "+r);throw console.error(t.stack),t}if(n=e[r],"undefined"==typeof n){n={exports:{}};var i=n.exports;o(i,n),e[r]=n.exports,n=n.exports,console.log("Module initialized: "+r)}return n}}();
window['#$']=function(exports,module){exports.config={name:"ToloGameDev",version:"0.0.24",major:0,minor:0,revision:24,date:new Date(2015,0,7,12,34,10)};var currentLang=null;exports.lang=function(n){return void 0===n&&(n=window.localStorage.getItem("Language"),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),currentLang=n,window.localStorage.setItem("Language",n),n},exports.intl=function(n,r){var e,t,a,o,i,g,s=n[exports.lang()],l=r[0];if(!s)return console.error('Missing internationalization for language : "'+exports.lang()+'"!'),l;if(e=s[l],!e)return console.error("Missing internationalization ["+exports.lang()+']: "'+l+'"!'),l;if(r.length>1){for(t="",i=0,a=0;a<e.length;a++)o=e.charAt(a),"$"===o?(t+=e.substring(i,a),a++,g=e.charCodeAt(a)-48,t+=0>g||g>=r.length?"$"+e.charAt(a):r[g],i=a+1):"\\"===o&&(t+=e.substring(i,a),a++,t+=e.charAt(a),i=a+1);t+=e.substr(i),e=t}return e};};
window['#main']=function(exports,module){var _intl_ = {"en":{"welcome":"Welcome in the world of"},"fr":{"welcome":"Bienvenue dans le monde de"}}, _$ = require("$").intl; function _() {return _$(_intl_, arguments);}function $(e){return window.document.getElementById(e)}function setLanguage(e){require("$").lang(e),window.location="index.html"}$("welcome").textContent=_("welcome"),$("fr").addEventListener("click",function(){setLanguage("fr")},!1),$("en").addEventListener("click",function(){setLanguage("en")},!1);};