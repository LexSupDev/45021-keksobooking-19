'use strict';

var OFFER_TITLES = ['Уютный дом с видом на сад', 'Стильная комната в лучшем районе города', 'Квартира рядом с метро', 'Сдается комната на 3 месяца', 'Квартира для семьи из трех человек', 'Комната с отдельной ванной', 'Комната с балконом и видом на парк', 'Дворец для пары без детей'];
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_DESCRIPTIONS = ['A comfortable space that can accommodate up to 2 people. This apartment is 3mins from Shinjuku by train and also close to Shibuya ! It is a 6-minute walk from the nearest station of the apartment.The apartment is in a residential area so you can sleep peacefully and sleep at night.', 'We have permission for business as hotel, Japan visitors can legally stay* >3 metro stations nearby take you directly to the best Tokyo spots >Bus to Tokyo airports (Tokyo City Air Terminal) is a short walk distance >Neighborhood has traditional shops, pubs, restaurants for true local experience >Grocery&drug stores, ¥100 shops nearby to fill your shopping needs >Ideal for short stay, but we have had many satisfied long-term guests >Checkin until 12am, convenient in case of arrival by late flight', 'Tateishi Tokyo,Quaint Neighborhood around the Station. Many Bars still exist since right after the World War near the station. You can feel what Tokyo was like back in 1940s. Good access to Major spot (15mins-50mins )'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var OFFERS_NUMBER = 8;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var ENTER_KEY = 'Enter';
var ESC_KEY = 'Escape';
// Начальные размеры метки на карте.
var MAIN_PIN_INITIAL_WIDTH = 65;
var MAIN_PIN_INITIAL_HEIGHT = 65;
var MAIN_PIN_IMAGE_HEIGHT = 62;
var MAIN_PIN_POINT_HEIGHT = 22;
var MAIN_PIN_WITH_POINT_HEIGHT = MAIN_PIN_IMAGE_HEIGHT + MAIN_PIN_POINT_HEIGHT;
// Режимы страницы
var MODE_ACTIVE = 'active';
var MODE_INACTIVE = 'inactive';

/**
 * @description Function always returns a random number between min and max (both included).
 * @param {number} min - Minimun number from a range of numbers.
 * @param {number} max - Maximum number from a range of numbers.
 * @return {number} A random integer between min (included) and max (included).
 */
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @description Function returns a random item from an array.
 * @param {Array} array, from which you want to get a random item.
 * @return {*} - random array item
 */
var getRandomElemenFromArray = function (array) {
  return array[getRandomInteger(0, array.length - 1)];
};

/**
 * @description Function generates avatar image URL.
 * @param {number} index - Index of the offer.
 * @return {string} URL address of avatar image
 */
var generateAvatarUrl = function (index) {
  return 'img/avatars/user0' + (index + 1) + '.png';
};

/**
 * @description Function returns an object with x an y coordinates to place the pin on map.
 * @return {object} Object represents location with coordinates of an offer.
 */
var generateLocation = function () {
  return {
    'x': getRandomInteger(130, 630),
    'y': getRandomInteger(130, 630)
  };
};

/**
 * @description Function generates an array of strings from the strings included in the dictionary.
 * @param {array} dictionary - Array of strings.
 * @return {array} New array of strings of various length from 1 string to the same number of string as the length of the dictionary.
 */
var generateArrayOfStrings = function (dictionary) {
  var resultArrayLength = getRandomInteger(1, dictionary.length);
  var resultArray = [];

  for (var i = 0; i < resultArrayLength; i++) {
    resultArray[i] = getRandomElemenFromArray(dictionary);
  }

  return resultArray;
};

/**
 * @description Function generates an offer.
 * @param {number} index of an offer.
 * @return {object} One offer.
 */
var generateOneOffer = function (index) {
  var location = generateLocation();

  return {
    'author': {
      'avatar': generateAvatarUrl(index)
    },
    'offer': {
      'title': getRandomElemenFromArray(OFFER_TITLES),
      'address': location.x + ', ' + location.y,
      'price': getRandomInteger(0, 1000000),
      'type': getRandomElemenFromArray(OFFER_TYPES),
      'rooms': getRandomInteger(0, 100),
      'guests': getRandomInteger(0, 3),
      'checkin': getRandomElemenFromArray(OFFER_CHECKINS),
      'checkout': getRandomElemenFromArray(OFFER_CHECKOUTS),
      'features': generateArrayOfStrings(OFFER_FEATURES),
      'description': getRandomElemenFromArray(OFFER_DESCRIPTIONS),
      'photos': generateArrayOfStrings(OFFER_PHOTOS)
    },

    'location': {
      'x': location.x,
      'y': location.y
    }
  };
};

/**
 * @description Function generates an array of offers.
 * @param {number} number - Quantity of offers to generate.
 * @return {array} An array of offer objects.
 */
var generateOffers = function (number) {
  var offers = [];
  for (var i = 0; i < number; i++) {
    offers[i] = generateOneOffer(i);
  }

  return offers;
};

/**
 * @description Function renders one pin on the map.
 * @param {object} offer - Object with offer data.
 * @param {object} mapPin - HTML element object that will contain a pin.
 * @return {object} HTML element of one map pin.
 */
var renderOneMapPin = function (offer, mapPin) {
  var mapPinElement = mapPin.cloneNode(true);

  mapPinElement.style.left = (offer.location.x - (PIN_WIDTH / 2)) + 'px';
  mapPinElement.style.top = offer.location.y - PIN_HEIGHT + 'px';
  mapPinElement.querySelector('img').src = offer.author.avatar;
  mapPinElement.querySelector('img').alt = offer.offer.title;

  return mapPinElement;
};

var addClickListener = function (pin, offer) {
  // Находим шаблон карточки предложения
  var mapCardTemplate = document.querySelector('#card').content.querySelector('.popup');
  // Создаем карточку предложения на основе элемента из массива предложений
  var cardElement = renderOneMapCard(offer, mapCardTemplate);
  // Находим кнопку закрытия на карточке.
  var cardCloseButton = cardElement.querySelector('.popup__close');

  var pinClick = function () {
    var openedCard = document.querySelector('.map__card');
    if (openedCard) {
      openedCard.querySelector('.popup__close').click();
    }
    // Выводим карточку предложения перед блоком с классом .map__filters-container.
    map.insertBefore(cardElement, map.querySelector('.map__filters-container'));
    // Добавляем обработчик клика кнопке закрытия карточки предложения.
    cardCloseButton.addEventListener('click', closeCard);
    // Добавить класс к пину, по которому кликнули.
    pin.classList.add('map__pin--active');
    document.addEventListener('keydown', onCardEscPress);
    pin.removeEventListener('click', pinClick);
  };

  var onCardEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      closeCard();
    }
  };

  var closeCard = function () {
    cardElement.remove();
    pin.addEventListener('click', pinClick);
    pin.classList.remove('map__pin--active');
    document.removeEventListener('keydown', onCardEscPress);
  };

  pin.addEventListener('click', pinClick);
};

/**
 * @description Function renders all map pins in the HTML block with a class 'map__pins'.
 * @param {array} offers - An array of offer objects;
 */
var renderAllMapPins = function (offers) {
  var mapPin = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsBlock = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    var pin = renderOneMapPin(offers[i], mapPin);
    addClickListener(pin, offers[i]);
    fragment.appendChild(pin);
  }

  mapPinsBlock.appendChild(fragment);
};

/**
 * @description Function returns Russian word for offer type;
 * @param {object} offer - An object with offer data.
 * @return {string} - a Russian word for the offer type.
 */
var getOfferType = function (offer) {
  switch (offer.offer.type) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
    case 'palace': return 'Дворец';
  }

  return offer.offer.type;
};

/**
 * @description Function returns a string with guests and rooms number if both pieces of information present in the offer object.
 * @param {object} offer - Offer object.
 * @return {string} Offer data with rooms and guests number.
 */
var getRoomsAndGuestsString = function (offer) {
  var roomsAndGuests = '';
  if (offer.offer.rooms && offer.offer.guests) {
    roomsAndGuests = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей';
  }
  return roomsAndGuests;
};

/**
 * @description Function returns a string with checkin and checkout time if both pieces of information present in the offer object.
 * @param {object} offer - Offer object.
 * @return {string} Offer data with checkin and checkout time.
 */
var getCheckinAndCheckoutTime = function (offer) {
  var checkinAndCheckout = '';
  if (offer.offer.checkin && offer.offer.checkout) {
    checkinAndCheckout = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;
  }
  return checkinAndCheckout;
};

/**
 * @description Function hides HTML element if the offer does not contain information for that element. If offer has text content for the element, function adds that text content in the element and shows the element in HTML.
 * @param {object} element - HTML block with text content.
 * @param {string} elementText Text from the offer that should be in the element's textContent.
 */
var hideEmptyTextElement = function (element, elementText) {
  if (elementText) {
    element.textContent = elementText;
  } else {
    element.classList.add('hidden');
  }
};

/**
 * @description Function creates one offer card.
 * @param {object} offer - An object with offer data.
 * @param {object} cardTemplate - HTML object with a template markup.
 * @return {object} HTML object with one map card.
 */
var renderOneMapCard = function (offer, cardTemplate) {
  var mapCardElement = cardTemplate.cloneNode(true);
  var mapCardTitle = mapCardElement.querySelector('.popup__title');
  var mapCardAddress = mapCardElement.querySelector('.popup__text--address');
  var mapCardPrice = mapCardElement.querySelector('.popup__text--price');
  var mapCardType = mapCardElement.querySelector('.popup__type');
  var mapCardDescription = mapCardElement.querySelector('.popup__description');
  var mapCardCapacity = mapCardElement.querySelector('.popup__text--capacity');
  var mapCardTime = mapCardElement.querySelector('.popup__text--time');

  hideEmptyTextElement(mapCardTitle, offer.offer.title);
  hideEmptyTextElement(mapCardAddress, offer.offer.address);
  hideEmptyTextElement(mapCardPrice, offer.offer.price);
  hideEmptyTextElement(mapCardType, getOfferType(offer));
  hideEmptyTextElement(mapCardCapacity, getRoomsAndGuestsString(offer));
  hideEmptyTextElement(mapCardTime, getCheckinAndCheckoutTime(offer));

  if (offer.offer.features.length > 0) {
    var features = mapCardElement.querySelector('.popup__features');
    var featureFromHTML = features.querySelector('.popup__feature');
    features.innerHTML = '';
    for (var featureIndex = 0; featureIndex < offer.offer.features.length; featureIndex++) {
      var feature = featureFromHTML.cloneNode(true);
      feature.classList.remove('popup__feature--wifi');
      feature.classList.add('popup__feature--' + offer.offer.features[featureIndex]);
      features.appendChild(feature);
    }
  } else {
    features.classList.add('hidden');
  }

  hideEmptyTextElement(mapCardDescription, offer.offer.description);

  if (offer.offer.photos.length > 0) {
    var photos = mapCardElement.querySelector('.popup__photos');
    var photoFromHTML = photos.querySelector('.popup__photo');
    photos.innerHTML = '';
    for (var photoIndexInOffer = 0; photoIndexInOffer < offer.offer.photos.length; photoIndexInOffer++) {
      var photo = photoFromHTML.cloneNode(true);
      photo.src = offer.offer.photos[photoIndexInOffer];
      photos.appendChild(photo);
    }
  } else {
    photos.classList.add('hidden');
  }

  if (offer.author.avatar) {
    mapCardElement.querySelector('.popup__avatar').src = offer.author.avatar;
  } else {
    mapCardElement.querySelector('.popup__avatar').classList.add('hidden');
  }

  return mapCardElement;
};

/**
 * @description Function sets 'disabled' attribute on the element from elements array. If element is a fieldset, it will get 'disabled' attribute.
 * @param {array} elements Array of HTML form elements.
 */
var disableFormElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttribute('disabled', '');
  }
};

/**
 * @description Function removes attribute 'disabled' of every element from array of elements.
 * @param {array} elements - HTML elements
 */
var enableFormElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].removeAttribute('disabled');
  }
};

/**
 * @description Function adds class to hide the element.
 * @param {object} element HTML element.
 * @param {string} className Name of class, that hides the element.
 */
var hide = function (element, className) {
  element.classList.add(className);
};

/**
 * @description Function removes a class, that hides the element.
 * @param {object} element HTML element.
 * @param {string} className Name of class, should be removed to show the element.
 */
var show = function (element, className) {
  element.classList.remove(className);
};

// Переводит страницу в неактивное состояние.
var deactivatePage = function (mapElement, formElement, formFielsets) {
  hide(mapElement, 'map--faded');
  hide(formElement, 'ad-form--disabled');
  disableFormElements(formFielsets);
};

// Переводит страницу в активное состояние.
var activatePage = function (mapElement, formElement, formFielsets) {
  show(mapElement, 'map--faded');
  show(formElement, 'ad-form--disabled');
  enableFormElements(formFielsets);
};

/**
 * @description Function returns x and y coordinates of the main pin.
 * @param {stiring} mode - Page mode - 'active' or 'inactive'.
 * @param {object} pin - HTML element - main pin of a map.
 * @return {object} - x and y coordinates of main pin.
 */
var getMainPinCoordinates = function (mode, pin) {
  var x = Math.round(pin.offsetLeft + MAIN_PIN_INITIAL_WIDTH / 2);
  var y = 0;
  if (mode === MODE_INACTIVE) {
    y = Math.round(pin.offsetTop + MAIN_PIN_INITIAL_HEIGHT / 2);
  } else {
    y = Math.round(pin.offsetTop + MAIN_PIN_WITH_POINT_HEIGHT);
  }

  return {x: x, y: y};
};

/**
 * @description Function sets address in the ad-form address field as a string {x, y}.
 * @param {object} location - Object with x and y coordinates.
 * @param {object} addressField - Input field with address value.
 */
var setAddress = function (location, addressField) {
  addressField.value = location.x + ', ' + location.y;
};

/**
 * @description Function returns an option, that has 'selected' attribute.
 * @param {object} selectElement - HTML select element.
 * @return {object} - HTML option element that is selected.
 */
var getSelectedOption = function (selectElement) {
  var opt;
  for (var i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].selected) {
      opt = selectElement.options[i];
      break;
    }
  }

  return opt;
};

// Находим главную метку.
var mapPinMain = document.querySelector('.map__pin--main');
// Получаем начальные координаты главной метки, когда у него нет острого указателя.
var initialMainPinCoordinates = getMainPinCoordinates(MODE_INACTIVE, mapPinMain);
// Находим форму ad-form.
var adForm = document.querySelector('.ad-form');
// Находим поле адреса в форме ad-form.
var adFormAddress = adForm.querySelector('input[name = address]');
// Устанавливаем изначальные точки координат в поле адрес. Это точка центра главной метки карты до активации карты. То есть главная метка карты в этот момент является кругом без острого указателя.
setAddress(initialMainPinCoordinates, adFormAddress);

// Генерируем массив предложений (моки)
var offers = generateOffers(OFFERS_NUMBER);
// Находим блок с картой.
var map = document.querySelector('.map');

// Находим fieldsets формы .ad-form.
var adFormFieldsets = adForm.querySelectorAll('fieldset');
// Получаем начальные координаты главной метки при активации страницы. То есть у метки уже есть указатель.
var afterActivationMainPinCoordinates = getMainPinCoordinates(MODE_ACTIVE, mapPinMain);

mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0 && (map.classList.contains('map--faded'))) {
    activatePage(map, adForm, adFormFieldsets);
    renderAllMapPins(offers);
    setAddress(afterActivationMainPinCoordinates, adFormAddress);
  }
});

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    activatePage(map, adForm, adFormFieldsets);
    renderAllMapPins(offers);
    setAddress(afterActivationMainPinCoordinates, adFormAddress);
  }
});

// Находим поле для ввода количества комнат в форме ad-form.
var adFormRooms = adForm.querySelector('select[name = rooms]');
// Находим поле для ввода количества гостей в форме ad-form.
var adFormGuests = adForm.querySelector('select[name = capacity]');
// Функция проверяет соответствие количества комнат количеству гостей.
var checkRoomsAndGuestsValidity = function (guestsValue, roomsValue) {
  if (guestsValue === 0 && roomsValue === 100) {
    adFormGuests.setCustomValidity('');
  } else if ((guestsValue !== 0) && (roomsValue !== 100) && (guestsValue <= roomsValue)) {
    adFormGuests.setCustomValidity('');
  } else {
    adFormGuests.setCustomValidity('Количество гостей не соответствует количеству комнат.');
  }
};

// Обработчик для изменения полей количества комнат и количества гостей.
// parseInt используется для приведения к числовому типу.
var onRoomsOrGuestsChange = function () {
  var guestsCurrentValue = parseInt(getSelectedOption(adFormGuests).value, 10);
  var roomsCurrentValue = parseInt(getSelectedOption(adFormRooms).value, 10);
  checkRoomsAndGuestsValidity(guestsCurrentValue, roomsCurrentValue);
};

adFormGuests.addEventListener('change', onRoomsOrGuestsChange);
adFormRooms.addEventListener('change', onRoomsOrGuestsChange);

// Находим поле для выбора типа жилья.
var adFormTypes = adForm.querySelector('select[name = type]');
// Находим поле для ввода цены за ночь.
var adFormPrice = adForm.querySelector('input[name = price]');

// Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»
var getMinPriceForOfferType = function () {
  var typeValue = getSelectedOption(adFormTypes).value;
  var minPrice = 0;
  switch (typeValue) {
    case 'flat': return 1000;
    case 'bungalo': return 0;
    case 'house': return 5000;
    case 'palace': return 10000;
  }
  return minPrice;
};

var onOfferTypeChange = function () {
  adFormPrice.min = getMinPriceForOfferType();
  adFormPrice['placeholder'] = adFormPrice.min;
};

adFormTypes.addEventListener('change', onOfferTypeChange);

// Находим поля для выбора времени въезда и выезда.
var adCheckinTimes = adForm.querySelector('select[name = timein]');
var adCheckoutTimes = adForm.querySelector('select[name = timeout]');

var onTimeChange = function (element) {
  var checkinTime = getSelectedOption(adCheckinTimes).value;
  var checkoutTime = getSelectedOption(adCheckoutTimes).value;
  if (checkinTime !== checkoutTime) {
    if (element === adCheckinTimes) {
      adCheckoutTimes.value = checkinTime;
    } else {
      adCheckinTimes.value = checkoutTime;
    }
  }
};

adCheckinTimes.addEventListener('change', function (evt) {
  var target = evt.target;
  onTimeChange(target);
});

adCheckoutTimes.addEventListener('change', function (evt) {
  var target = evt.target;
  onTimeChange(target);
});

// Переводим страницу в неактивное состояние.
deactivatePage(map, adForm, adFormFieldsets);
