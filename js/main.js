'use strict';

var OFFERS_NUM = 8;
var pin = {width: 50, height: 70, tailHeight: 17};
var offers = [];
var map = document.querySelector('.map');
var mapWidth = map.offsetWidth - 1; // ширина блока с картой для установки пинов

// массивы с данными
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

var getOffers = function () {
  for (var i = 0; i < OFFERS_NUM; i++) {
    var rooms = getRandom(1, 5, 0);
    var photos = getPhotos();
    offers.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Мой дом' + (i + 1),
        address: '600, 350', price: getRandom(2000, 10000, 0),
        type: OFFER_TYPES_NAME[getRandom(0, OFFER_TYPES_NAME.length, 0)],
        rooms: rooms, guests: 2 * rooms,
        checkin: OFFER_CHECK[getRandom(0, OFFER_CHECK.length, 0)],
        checkout: OFFER_CHECK[getRandom(0, OFFER_CHECK.length, 0)],
        features: getShuffleFeatures(OFFER_FEATURES).slice(0, getRandom(1, OFFER_FEATURES.length, 0)),
        description: 'Тут будет описание.',
        photos: photos
      },
      location: {
        x: getRandom(1, mapWidth, 0),
        y: getRandom(130, 630, 0)
      }
    });
  }
  return offers;
};

offers = getOffers(); // заполнение массива случайными данными

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var createPins = function () {
  var fillPinInfo = function (offer) {
    var pinElem = pinTemplate.cloneNode(true);
    
    pinElem.style.left = offer.location.x - (pin.width / 2) + 'px';
    pinElem.style.top = offer.location.y - (pin.height) + 'px';
    pinElem.querySelector('img').src = offer.author.avatar;
    pinElem.querySelector('img').alt = offer.offer.title;
    return pinElem;
  };

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(fillPinInfo(offers[i]));
  }
  mapPins.appendChild(fragment);
};

createPins();