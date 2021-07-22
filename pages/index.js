
const sliderPrice = document.querySelector('#slider-price')
const sliderArea = document.querySelector('#slider-area')
const sliderTheme = document.querySelector('filter__range')

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
    console.log(values.join(', '))
  });
}

createSlider(sliderPrice, 9_000_000, 15_000_000, 5_500_000, 18_900_000)
createSlider(sliderArea, 57, 97, 33, 123)
