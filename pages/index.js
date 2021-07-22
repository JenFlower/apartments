
import Api from '../scripts/Api.js'
const sliderPrice = document.querySelector('#slider-price')
const sliderArea = document.querySelector('#slider-area')
// const sliderTheme = document.querySelector('filter__range')
const apartmentContent = document.querySelector('.apartment-content')
const btnResultLoad = document.querySelector('.result__load')

let currentApartment = 0

const api = new Api()

const createSlider = (name, from, to, min, max) => {
  noUiSlider.create(name, {
    start: [from, to],
    connect: true,
    step: 1,
    range: {
        'min': min,
        'max': max
    }
  });
  // вывод в консоль значений ползунков
  name.noUiSlider.on('update', function (values) {
    // console.log(values.join(', '))
  });
}

createSlider(sliderPrice, 9_000_000, 15_000_000, 5_500_000, 18_900_000)
createSlider(sliderArea, 57, 97, 33, 123)

const getData = (from, to) => {
  api.getData().then(res => {
    const arr= res.slice(from, to)  // первые 5 элементов
    arr.forEach(item => {

      addApartment(createApartment(item))
      currentApartment = item.id
      console.log(res.length)
      if(currentApartment === res.length)
        btnResultLoad.classList.add('result__load_disabled')
    })
  })
}
// загрузка первых 5 элементов
getData(0, 5)

function addApartment(item) {
  return apartmentContent.append(item);
}

const createApartment = (item) => {
  const cardTemplate = document.querySelector('#apartment-template').content.querySelector('.apartment-row');

  const apartment = cardTemplate.cloneNode(true);
  const apartmentImage = apartment.querySelector('.apartment-row__image');
  apartmentImage.style.backgroundImage = `url(${item.image})`
  const apartmentRooms = apartment.querySelector('.apartment-row__rooms');
  apartmentRooms.textContent = item.name;
  const apartmentArea = apartment.querySelector('.area-current');
  apartmentArea.innerText = item.area;
  // console.log(apartmentArea.textContent)
  // floors
  const apartmentCurrentFloor = apartment.querySelector('.apartment-row__current-floor');
  apartmentCurrentFloor.textContent = item.floor;
  const apartmentTotalFloor = apartment.querySelector('.apartment-row__total-floor');
  apartmentTotalFloor.textContent = item.floors;
  // price
  const apartmentPrice = apartment.querySelector('.price-current');
  apartmentPrice.textContent = item.price;
  return apartment;
}

// обработчик кнопки "Загрузить еще"
btnResultLoad.addEventListener('click', () => {
  getData(currentApartment, currentApartment + 20)
})



