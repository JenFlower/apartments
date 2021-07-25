
import Api from '../scripts/Api.js'
import * as constants from '../scripts/constants.js'

const api = new Api()

window.addEventListener('scroll', () => {
  window.scrollY > 300 ? constants.buttonUp.classList.add('button-up_show') : constants.buttonUp.classList.remove('button-up_show')
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

createSlider(constants.sliderPrice, 9_000_000, 15_000_000, 5_500_000, 18_900_000)
createSlider(constants.sliderArea, 57, 97, 33, 123)
updateTextSlider(constants.sliderPrice, constants.priceFrom, constants.priceTo)
updateTextSlider(constants.sliderArea, constants.areaFrom, constants.areaTo)

const filterResultData = (res, filterData) => {
  return res.filter(x => filterData.rooms.includes(x.rooms) &&
    x.price >= filterData.priceFrom &&
    x.price <= filterData.priceTo &&
    x.area >= filterData.areaFrom &&
    x.area <= filterData.areaTo)
}


// получение значений после перетаскивания ползунка
constants.sliderPrice.noUiSlider.on('end', function (values) {
  api.getData()
    .then(res => {
      const filterData = getFilterData()
      return filterResultData(res, filterData)
    })
    .then(res => {
      // рендерим первые 5 элементов
      // redrawApartments(res.slice(0, 5))
      redrawApartments(res)

      // но имеем возможность отобразить остальные по кнопке
      if (res.length > 5) {
        constants.btnResultLoad.classList.remove('result__load_disabled')
      }
      // refreshLoadMoreButton(res);
    })

})
constants.sliderArea.noUiSlider.on('end', function (values) {
  api.getData()
    .then(res => {
      const filterData = getFilterData()
      return filterResultData(res, filterData)
    })
    .then(res => {
      // рендерим первые 5 элементов
      // redrawApartments(res.slice(0, 5))
      redrawApartments(res)

      // но имеем возможность отобразить остальные по кнопке
      if (res.length > 5) {
        constants.btnResultLoad.classList.remove('result__load_disabled')
      }
      // refreshLoadMoreButton(res);
    })

})

const refreshLoadMoreButton = (arr, curr = 5) => {
  // 5 <
  const displayedApartmentsCount = document.querySelectorAll('.apartment-row').length
  console.log(arr)
  if (curr < arr.length) {
    // btnResultLoad.classList.add('result__load_disabled')
    constants.btnResultLoad.classList.remove('result__load_disabled')
  }
  else {
    constants.btnResultLoad.classList.add('result__load_disabled')

    // btnResultLoad.classList.remove('result__load_disabled')
  }
}

const getFirstData = (data, from, to) => {
  return data.slice(from, to)
}

/**
 * Фильтрация набора данных в соответствии с настройками на форме фильтрации
 * @param dataSet Полный набор данных
 * @returns Отфильтрованный набор данных
 */
const filterDataSet = (dataSet) => {
  let filteredData = []
  if (getFilterData) {
    const filterSettings = getFilterData()
    console.log('filterSettings.rooms: ' + filterSettings.rooms)

    // filteredData = dataSet.filter(x => filterSettings.rooms.includes(x.rooms))
    filteredData = dataSet.filter(x => filterSettings.rooms.includes(x.rooms))
    console.log('filteredData: ' + filteredData)
  }

  return filteredData
}

/**
 * Дозагружает данные
 */
const getDataApartments = (from, count) => {
  // 1. Шлём запрос
  api.getData().then(res => {

    // 2. Фильтруем результаты

    const filteredData = filterDataSet(res);
    // 3. Обрезаем результаты. Берём начиная с from элементов count
    // const arr = res.splice(from, count)

    // slice
    const arr = getFirstData(res, from, count)
    arr.forEach(item => {
      addApartment(createApartment(item))
    })
    const displayedApartmentsCount = document.querySelectorAll('.apartment-row').length
    refreshLoadMoreButton(res, displayedApartmentsCount)
  })
}

// загрузка первых 5 элементов
getDataApartments(0, 5)

function addApartment(item) {
  return constants.apartmentContent.append(item);
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
  apartmentCurrentFloor.textContent = item.id;
  const apartmentTotalFloor = apartment.querySelector('.apartment-row__total-floor');
  apartmentTotalFloor.textContent = item.floors;
  // price
  const apartmentPrice = apartment.querySelector('.price-current');
  apartmentPrice.textContent = new Intl.NumberFormat('ru-RU').format(item.price);
  return apartment;
}

// обработчик кнопки "Загрузить еще"
constants.btnResultLoad.addEventListener('click', () => {
  const displayedApartmentsCount = document.querySelectorAll('.apartment-row').length

  getDataApartments(displayedApartmentsCount, displayedApartmentsCount + 20)

})

// прокрутка страницы
constants.buttonUp.addEventListener('click', () => {
  window.scroll({
    top: 0,
    behavior: 'smooth'
  });
})

// перерисовывает элементы
const redrawApartments = (data) => {
  // удаляет элементы
  constants.apartmentContent.innerHTML = ''
  data.forEach((item) => {
    addApartment(createApartment(item))
  })
  // refreshLoadMoreButton(data)
}


// возвращает объект с текущими значениями фильтра
const getFilterData = () => {

  const priceRange = constants.sliderPrice.noUiSlider.get(true);
  const areaRange = constants.sliderArea.noUiSlider.get(true);

  return {
    rooms: [...document.querySelectorAll('.filter__room-button_active')].map(item => Number(item.dataset.rooms)),
    // rooms: [...document.querySelectorAll('.filter__room-button')].map(item => Number(item.dataset.rooms)),
    priceFrom: priceRange[0],
    priceTo: priceRange[1],
    areaFrom: areaRange[0],
    areaTo: areaRange[1]
  }
}

constants.buttonsRoom.forEach(item => {
  item.addEventListener('click', () => {
    // cons/ole.log(item.dataset.rooms)

    if (item.classList.contains('filter__room-button_active'))
      item.classList.remove('filter__room-button_active')
    else
      item.classList.add('filter__room-button_active')
    api.getData()
      .then(res => {
        console.log('data from server: ', res)
        const filterData = getFilterData()
        const filtered = filterResultData(res, filterData)
        console.log(filtered)
        return filtered
        })
        .then(res => {
          // рендерим первые 5 элементов
          // redrawApartments(res.slice(0, 5))
          redrawApartments(res)
        })

  })

})
