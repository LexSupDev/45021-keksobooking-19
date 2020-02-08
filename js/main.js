'use strict';

var AD_NUM = 8; // количество объявлений
var PIN_WIDTH = 50; // ширина метки
var PIN_HEIGHT = 70; // высота метки
var ads = []; // массив с объявлениями
var pinTailHeight = 17;

// массивы с данными
var AD_TYPE = {'palace': {ru: 'Дворец'}, 'flat': {ru: 'Квартира'}, 'house': {ru: 'Дом'}, 'bungalo': {ru: 'Бунгало'}};
var AD_TYPES_NAME = ['palace', 'flat', 'house', 'bungalo'];
var AD_CHECK = ['12:00', '13:00', '14:00'];
var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var map = document.querySelector('.map');
var mapWidth = map.offsetWidth - 1; // ширина блока с картой для установки пинов
var similarListElement = map.querySelector('.map__pins');
var similarPinTemplate = document.querySelector('#pin').content;

var card = document.querySelector('#card');
var cardTemplate = card.content.querySelector('.map__card');
var cardPlaceBefore = document.querySelector('.map__filters-container');

// генератор случайного числа с numCount цифрами после запятой
var getRandom = function (min, max, numCount) {
  return Math.floor((Math.random() * (max - min) + min) * Math.pow(10, numCount)) / Math.pow(10, numCount);
};

// генератор массива features на основе shuffle
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

// генератор масива photos
var getPhotos = function () {
  var photosArr = [];
  for (var i = 0; i < getRandom(1, 4, 0); i++) {
    photosArr.push('http://o0.github.io/assets/images/tokyo/hotel' + (i + 1) + '.jpg');
  }
  return photosArr;
};

// генератор объявления
var getAds = function () {
  for (var i = 0; i < AD_NUM; i++) {
    var rooms = getRandom(1, 5, 0);
    var photos = getPhotos();
    ads.push({author: {avatar: 'img/avatars/user0' + (i + 1) + '.png'}, offer: {title: 'Мой дом' + (i + 1), address: '600, 350', price: getRandom(2000, 10000, 0),
      type: AD_TYPES_NAME[getRandom(0, AD_TYPES_NAME.length, 0)], rooms: rooms, guests: 2 * rooms, checkin: AD_CHECK[getRandom(0, AD_CHECK.length, 0)], checkout: AD_CHECK[getRandom(0, AD_CHECK.length, 0)],
      features: getShuffleFeatures(AD_FEATURES).slice(0, getRandom(1, AD_FEATURES.length, 0)), description: 'Тут будет описание.', photos: photos}, location: {x: getRandom(1, mapWidth, 0), y: getRandom(130, 630, 0)}});
  }
  // console.log(JSON.stringify(ads, 0, ' '));
  return ads;
};

// рендер меток
var renderPin = function (adsarr) {
  var pinElement = similarPinTemplate.cloneNode(true);

  pinElement.querySelector('.map__pin').style.left = adsarr.location.x - (PIN_WIDTH / 2) + 'px';
  pinElement.querySelector('.map__pin').style.top = adsarr.location.y - (PIN_HEIGHT) + 'px';
  pinElement.querySelector('.map__pin img').src = adsarr.author.avatar;
  pinElement.querySelector('.map__pin img').alt = adsarr.offer.title;

  return pinElement;
};

// рендер карточек объявлений
var renderCard = function (adsarr) {
  var cardElement = cardTemplate.cloneNode(true);
  console.log(adsarr);
  cardElement.querySelector('.popup__title').textContent = adsarr.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = adsarr.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = adsarr.offer.price + '₽/ночь.';
  cardElement.querySelector('.popup__type').textContent = AD_TYPE[adsarr.offer.type].ru;
  cardElement.querySelector('.popup__text--capacity').textContent = adsarr.offer.rooms + ' комнаты для ' + adsarr.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsarr.offer.checkin + ', выезд до ' + adsarr.offer.checkout;
  cardElement.querySelector('.popup__features').innerHTML = '';
  for (var i = 0; i < adsarr.offer.features.length; i++) {
    var newFeatures = document.createElement('li');
    newFeatures.className = 'popup__feature popup__feature--' + adsarr.offer.features[i];
    cardElement.querySelector('.popup__features').appendChild(newFeatures);
  }
  cardElement.querySelector('.popup__description').textContent = adsarr.offer.description;
  cardElement.querySelector('.popup__photos').innerHTML = '';
  for (i = 0; i < adsarr.offer.photos.length; i++) {
    var photo = document.createElement('img');
    photo.src = adsarr.offer.photos[i];
    photo.className = 'popup__photo';
    photo.width = 45;
    photo.height = 40;
    cardElement.querySelector('.popup__photos').appendChild(photo);
  }
  cardElement.querySelector('.popup__avatar').src = adsarr.author.avatar;

  return cardElement;
};

var fragment = document.createDocumentFragment();
var fragment2 = document.createDocumentFragment();
ads  = getAds();

// создание объявлений (с меткой)
for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderPin(ads[i]));
}
// создание карточек объявлений
fragment2.appendChild(renderCard(ads[0]));

var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var mapFilters = document.querySelectorAll('.map__filter');
var adFormField = adForm.querySelectorAll('input, select');

for (i = 0; i < mapFilters.length; i++) {
  mapFilters[i].setAttribute('disabled', 'disabled');
}

for (i = 0; i < adFormField.length; i++) {
  adFormField[i].setAttribute('disabled', 'disabled');
}
console.log(ads);
var getCard = function () {
  var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  // console.log(mapPins);

  var onShowCard = function (index) {
    var activeCard = map.querySelector('.map__card');
    if (activeCard) {
      activeCard.remove();
    }
    renderCard(ads, index);
  };
  mapPins.forEach(function (item, index) {
    console.log(index);
    item.addEventListener('click', function () {
      onShowCard(index);
    });
  });
};

var active = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (i = 0; i < mapFilters.length; i++) {
    mapFilters[i].removeAttribute('disabled', 'disabled');
  }

  for (i = 0; i < adFormField.length; i++) {
    adFormField[i].removeAttribute('disabled');
  }

  similarListElement.appendChild(fragment); // вставка меток на страницу
  map.insertBefore(fragment2, cardPlaceBefore); // вставка карточек объявлений на страницу */

  var cardPopup = document.querySelector('.map__card');
  var cardClosePopup = cardPopup.querySelector('.popup__close');

  cardClosePopup.addEventListener('click', function () {
    cardPopup.classList.add('hidden');
  });

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27) {
      cardPopup.classList.add('hidden');
    }
  });

  getCard();
};

var fillPinAddress = function (pin) {
  var addressField = adForm.querySelector('#address');
  addressField.value = Math.round(pin.offsetLeft + pin.offsetWidth / 2);
  addressField.value += ', ' + Math.round(pin.offsetTop + pin.offsetHeight + pinTailHeight);
};

fillPinAddress(mapPinMain);

var roomsNumber = adForm.querySelector('#room_number');
var capacity = adForm.querySelector('#capacity');

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

mapPinMain.addEventListener('mousedown', function (e) {
  if (e.button === 0) {
    active();
  }
});

mapPinMain.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    active();
  }
});

roomsNumber.addEventListener('change', function () {
  checkQuantityRoomstoGuests();
});

capacity.addEventListener('change', function () {
  checkQuantityRoomstoGuests();
});
