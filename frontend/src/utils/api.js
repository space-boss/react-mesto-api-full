class Api {
  constructor(config){
		this._url = config.url;
    this._headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };
  }

  setToken() {
    this._headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  getInfo() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      'credentials': 'include',
      headers: this._headers
    }).then(this._checkResponse);
  }

  updateInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      'credentials': 'include',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(this._checkResponse);
  }

  updateAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      'credentials': 'include',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(this._checkResponse);
  }

  getCard() {
    return fetch(`${this._url}/cards`, {
      method: "GET",
      'credentials': 'include',
      headers: this._headers,
    }).then(this._checkResponse);
  }

  generateCard(newCard) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      'credentials': 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: newCard.place,
        link: newCard.link,
      })
    }).then(this._checkResponse);
  }
  

  postCard(data) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      'credentials': 'include',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(this._checkResponse);
  }

  deleteCard(cardId){
    return fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      'credentials': 'include',
      headers: this._headers,
    })
    .then((res) => {
      if(!res.ok) {
        return Promise.reject('Не удалось удалить карточку')
      }
    })
  }
  
  likeCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      'credentials': 'include',
      headers: this._headers, 
    }).then(this._checkResponse);
  }

  unlikeCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "DELETE",
      'credentials': 'include',
      headers: this._headers,
    }).then(this._checkResponse);
  }
}

export const apiConfig = new Api({
  url: "https://api.spaceboss.mesto.nomoredomains.icu",
});
   
