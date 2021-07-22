export default class Api {
  // constructor(){}

  _checkResponse(res) {
    return res ? res.json() : Promise.reject(`Error: ${res.status}`)
  }

  getData() {
    return fetch('../data/apartments.js')
      .then(this._checkResponse)
    // return fetch('https://jenflower.github.io/apartments/data/apartments.json')
    //   .then(this._checkResponse)
  }

}
