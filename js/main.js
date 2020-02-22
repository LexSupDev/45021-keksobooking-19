'use strict';

var OFFERS_NUM = 8;
var pin = {width: 50, height: 70, tailHeight: 17};
var offers = {};

//массивы с данными
var OFFER_TYPE = {'palace': {ru: 'Дворец'}, 'flat': {ru: 'Квартира'}, 'house': {ru: 'Дом'}, 'bungalo': {ru: 'Бунгало'}};
var OFFER_TYPES_NAME = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECK = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// генератор случайного числа с numCount цифрами после запятой
var getRandom = function (min, max, numCount) {
  return Math.floor((Math.random() * (max - min) + min) * Math.pow(10, numCount)) / Math.pow(10, numCount);
};

var getShuffleFeatures = function (shuffleArr) {
  var j;
  var x;
  var i;
  for (i = shuffleArr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = shuffleArr[i];
    shuffleArr[i] = shuffleArr[j];
    shuffleArr[j] = x;
  }
  return shuffleArr;
};

var getPhotos = function () {
  var photosArr = [];
  for (var i = 0; i < getRandom(1, 4, 0); i++) {
    photosArr.push('http://o0.github.io/assets/images/tokyo/hotel' + (i + 1) + '.jpg');
  }
  return photosArr;
};