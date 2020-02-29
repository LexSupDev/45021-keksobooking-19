'use strict';

var AD_NUM = 8;
var pin = {width: 50, height: 70, tailHeight: 17};
var ads = [];
var map = document.querySelector('.map');
var mapWidth = map.offsetWidth - 1; // ширина блока с картой для установки пинов

// массивы с данными
var AD_TYPE = {'palace': {ru: 'Дворец'}, 'flat': {ru: 'Квартира'}, 'house': {ru: 'Дом'}, 'bungalo': {ru: 'Бунгало'}};
var AD_TYPES_NAME = ['palace', 'flat', 'house', 'bungalo'];
var AD_CHECK = ['12:00', '13:00', '14:00'];
var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var adForm = document.querySelector('.ad-form');
var mapFilters = document.querySelectorAll('.map__filter');
var adFormField = adForm.querySelectorAll('input, select');
var mapPinMain = document.querySelector('.map__pin--main');
var roomsNumber = adForm.querySelector('#room_number');
var capacity = adForm.querySelector('#capacity');

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
  for (var i = 0; i < AD_NUM; i++) {
    var rooms = getRandom(1, 5, 0);
    var photos = getPhotos();
    ads.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Мой дом' + (i + 1),
        address: '600, 350',
        price: getRandom(2000, 10000, 0),
        type: AD_TYPES_NAME[getRandom(0, AD_TYPES_NAME.length, 0)],
        rooms: rooms, guests: 2 * rooms,
        checkin: AD_CHECK[getRandom(0, AD_CHECK.length, 0)],
        checkout: AD_CHECK[getRandom(0, AD_CHECK.length, 0)],
        features: getShuffleFeatures(AD_FEATURES).slice(0, getRandom(1, AD_FEATURES.length, 0)),
        description: 'Тут будет описание.',
        photos: photos
      },
      location: {
        x: getRandom(1, mapWidth, 0),
        y: getRandom(130, 630, 0)
      }
    });
  }
  return ads;
};

var addPinClickHandler = function (mapPin, ad) {
  var pinCard = createCard(ad);
  var popupClose = pinCard.querySelector('.popup__close');

  var pinClick = function () {
    var openedCard = document.querySelector('.map__card');
    if (openedCard) {
      openedCard.querySelector('.popup__close').click();
    }

    map.insertBefore(pinCard, mapFilters);
    popupClose.addEventListener('click', closeCard);
    mapPin.classList.add('map__pin--active');
    document.addEventListener('keydown', popupEscPress);
    mapPin.removeEventListener('click', pinClick);
  };

  var popupEscPress = function (evt) {
    if(evt.key === 'Escape') {
      closeCard();
    }
  };

  var closeCard = function () {
    pinCard.remove();
    mapPin.addEventListener('click', pinClick);
    mapPin.classList.remove('map__pin--active');
    document.removeEventListener('keydown', popupEscPress);
  };

  mapPin.addEventListener('click', pinClick);
};

var mapPins = document.querySelector('.map__pins');

var createPins = function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var fillPinInfo = function (ad) {
    var pinElem = pinTemplate.cloneNode(true);

    pinElem.style.left = ad.location.x - (pin.width / 2) + 'px';
    pinElem.style.top = ad.location.y - (pin.height) + 'px';
    pinElem.querySelector('img').src = ad.author.avatar;
    pinElem.querySelector('img').alt = ad.offer.title;
    return pinElem;
  };

  var fragmentPin = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    var mapPin = fillPinInfo(ads[i]);
    addPinClickHandler(mapPin, ads[i]);
    fragmentPin.appendChild(mapPin);
  }

  mapPins.appendChild(fragmentPin);
};

var createCard = function (ad) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  mapFilters = document.querySelector('.map__filters-container');

  var cardElem = cardTemplate.cloneNode(true);

  cardElem.querySelector('.popup__title').textContent = ad.offer.title;
  cardElem.querySelector('.popup__text--address').textContent = ad.offer.address;
  cardElem.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь.';
  cardElem.querySelector('.popup__type').textContent = AD_TYPE[ad.offer.type].ru;
  cardElem.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardElem.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  cardElem.querySelector('.popup__features').innerHTML = '';
  for (var i = 0; i < ad.offer.features.length; i++) {
    var newFeatures = document.createElement('li');
    newFeatures.className = 'popup__feature popup__feature--' + ad.offer.features[i];
    cardElem.querySelector('.popup__features').appendChild(newFeatures);
  }
  cardElem.querySelector('.popup__description').textContent = ad.offer.description;
  cardElem.querySelector('.popup__photos').innerHTML = '';
  for (i = 0; i < ad.offer.photos.length; i++) {
    var photo = document.createElement('img');
    photo.src = ad.offer.photos[i];
    photo.className = 'popup__photo';
    photo.width = 45;
    photo.height = 40;
    cardElem.querySelector('.popup__photos').appendChild(photo);
  }
  cardElem.querySelector('.popup__avatar').src = ad.author.avatar;
  return cardElem;
};

var disableFormActions = function () {
  for (var i = 0; i < mapFilters.length; i++) {
    mapFilters[i].setAttribute('disabled', 'disabled');
  }

  for (i = 0; i < adFormField.length; i++) {
    adFormField[i].setAttribute('disabled', 'disabled');
  }
};

var enableFormActions = function () {
  for (var i = 0; i < mapFilters.length; i++) {
    mapFilters[i].removeAttribute('disabled', 'disabled');
  }

  for (i = 0; i < adFormField.length; i++) {
    adFormField[i].removeAttribute('disabled', 'disabled');
  }
};

var setPinMainAddress = function (targetPin) {
  var addressField = document.querySelector('#address');
  addressField.value = Math.round(targetPin.offsetLeft + targetPin.offsetWidth / 2);
  if (map.classList.contains('map--faded')) {
    addressField.value += ', ' + Math.round(targetPin.offsetTop + targetPin.offsetHeight / 2);
  } else {
    addressField.value += ', ' + Math.round(targetPin.offsetTop + targetPin.offsetHeight + pin.tailHeight);
  }
};

var pinMainMousedownHandler = function (evt) {
  if (evt.button === 0) {
    activePage();
    mapPinMain.removeEventListener('mousedown', pinMainMousedownHandler);
    mapPinMain.removeEventListener('keydown', pinMainEnterPressHandler);
    setPinMainAddress(mapPinMain);
  }
};

var pinMainEnterPressHandler = function (evt) {
  if (evt.key === 'Enter') {
    activePage();
    mapPinMain.removeEventListener('mousedown', pinMainMousedownHandler);
    mapPinMain.removeEventListener('keydown', pinMainEnterPressHandler);
  }
};

var disablePage = function () {
  if (!map.classList.contains('map--faded')) {
    map.classList.add('map--faded');
  }
  if (!adForm.classList.contains('ad-form--disabled')) {
    adForm.classList.add('ad-form--disabled');
  }

  disableFormActions();
  setPinMainAddress(mapPinMain);
  mapPinMain.addEventListener('mousedown', pinMainMousedownHandler);
  mapPinMain.addEventListener('keydown', pinMainEnterPressHandler);
};

var checkQuantityRoomstoGuests = function () {
  var rooms = Number(roomsNumber.value);
  var guests = Number(capacity.value);
  if (rooms < guests) {
    capacity.setCustomValidity('Количество гостей не может превышать количество комнат!');
  } else if (rooms === 100 && guests !== 0) {
    capacity.setCustomValidity('Такое количество комнат не предназначено для размещения гостей. Укажите значение "не для гостей"');
  } else {
    capacity.setCustomValidity('');
  }
};

var validation = function () {
  roomsNumber.addEventListener('change', function () {
    checkQuantityRoomstoGuests();
  });

  capacity.addEventListener('change', function () {
    checkQuantityRoomstoGuests();
  });

  var adFormTypes = document.querySelector('#type');
  var adFormPrice = document.querySelector('#price');
  console.log(adFormTypes);
};

disablePage();

function activePage() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  enableFormActions();
  validation();
  ads = getOffers(); // заполнение массива случайными данными
  createPins(); // создание и отрисовка пинов
}
