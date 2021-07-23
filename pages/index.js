
import Api from '../scripts/Api.js'
const sliderPrice = document.querySelector('#slider-price')
const sliderArea = document.querySelector('#slider-area')
// const sliderTheme = document.querySelector('filter__range')
const apartmentContent = document.querySelector('.apartment-content')
const btnResultLoad = document.querySelector('.result__load')
const buttonUp = document.querySelector('.button-up')
// const buttonsRoom = document.querySelectorAll('filter__room-button')

const buttonsRoom = Array.from(document.querySelectorAll('.filter__room-button'))

const priceFrom = document.querySelector('.apartment-row__price-from')
const priceTo = document.querySelector('.apartment-row__price-to')
const areaFrom = document.querySelector('.apartment-row__area-from')
const areaTo = document.querySelector('.apartment-row__area-to')

// console.log(buttonsRoom)
let currentApartment = 0

const api = new Api()

window.addEventListener('scroll',() => {
  window.scrollY > 300 ? buttonUp.classList.add('button-up_show') : buttonUp.classList.remove('button-up_show')
  }
)

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

}
const updateTextSlider = (name, from, to) => {
  name.noUiSlider.on('update', function (values) {
    // console.log(values)
    from.textContent = new Intl.NumberFormat('ru-RU').format(Math.floor(values[0]))
    to.textContent = new Intl.NumberFormat('ru-RU').format(Math.floor(values[1]))
  });
}

createSlider(sliderPrice, 9_000_000, 15_000_000, 5_500_000, 18_900_000)
createSlider(sliderArea, 57, 97, 33, 123)
updateTextSlider(sliderPrice, priceFrom, priceTo)
updateTextSlider(sliderArea, areaFrom, areaTo)

// получение значений после перетаскивания ползунка
sliderPrice.noUiSlider.on('end', function(values) {
  api.getData()
    .then(res => {
      // console.log(res)
      console.log(getFilterData(res))

      let resFilter = res.filter(x => x.price > values[0])
      redrawApartments(resFilter)

    })
  // console.log(values[0])

})

const getDataApartments = (from, to) => {
  api.getData().then(res => {
    const arr = res.slice(from, to)  // первые 5 элементов
    arr.forEach(item => {

      addApartment(createApartment(item))
      currentApartment = item.id
      // console.log(res.length)
      if(currentApartment === res.length)
        btnResultLoad.classList.add('result__load_disabled')
    })
  })
}
// загрузка первых 5 элементов
getDataApartments(0, 5)

function addApartment(item) {
  return apartmentContent.append(item);
}

const createApartment = (item) => {
  const cardTemplate = document.querySelector('#apartment-template').content.querySelector('.apartment-row');

  const apartment = cardTemplate.cloneNode(true);
  const apartmentImage = apartment.querySelector('.apartment-row__image');
  apartmentImage.style.backgroundImage = `url(${item.image})`
  const apartmentRoom = apartment.querySelector('.apartment-row__room');
  apartmentRoom.textContent = item.rooms;
  const apartmentNumber = apartment.querySelector('.apartment-row__number');
  apartmentNumber.textContent = item.number;
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
  apartmentPrice.textContent = new Intl.NumberFormat('ru-RU').format(item.price);
  return apartment;
}

// обработчик кнопки "Загрузить еще"
btnResultLoad.addEventListener('click', () => {
  getDataApartments(currentApartment, currentApartment + 20)
})

// прокрутка страницы
buttonUp.addEventListener('click', () => {
  window.scroll({
    top: 0,
    behavior: 'smooth'
  });
})


// filter
buttonsRoom.forEach(item => {
  item.addEventListener('click', () => {
    api.getData()
      .then(res => {
        apartmentContent.innerHTML = ''
        if(item.classList.contains('filter__room-button_active'))
          item.classList.remove('filter__room-button_active')
        else
          item.classList.add('filter__room-button_active')
        let resFilter = res.filter(x => x.rooms === Number(item.dataset.rooms))
        redrawApartments(resFilter)
      })
  })
})

const redrawApartments = (data) => {
  data.forEach((item) => {
    addApartment(createApartment(item))
  })
}
