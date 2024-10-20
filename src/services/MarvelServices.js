class MarvelService {
_apiBase = 'https://gateway.marvel.com:443/v1/public/';//Оптимизируем ссылки, так как мы часто будем их использовать и код часто повторяется, легче повторяющиеся куски кода вынести, но ссылки тогда будут динамическими и нужно использовать ``
_apiKey = 'apikey=ea2364b682f4916e26a6de922b3ca993';
_baseOffset = 210;//Базовый отступ для персонажей


    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not feth ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {//Получаем сразу всех персонажей, в ссылке, указанной ниже можно изменять некоторые параметры, к примеру такие, как количество показываемых карточек и лимит
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);//Пример оптимизации кода
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {//Получаем одного персонажа
        const res = await this.getResource(`https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=ea2364b682f4916e26a6de922b3ca993`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {//Перекинули метод сюда, так как он будет много где применяться
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',//Доп инфа, если не будет у самой карточки
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;