import {useHttp} from '../hooks/http.hooks';

const useMarvelService = () => {//Такое название, чтобы было понятно, что это кастомный хук
    const {loading, request, error} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';//Оптимизируем ссылки, так как мы часто будем их использовать и код часто повторяется, легче повторяющиеся куски кода вынести, но ссылки тогда будут динамическими и нужно использовать ``
    const _apiKey = 'apikey=ea2364b682f4916e26a6de922b3ca993';
    const _baseOffset = 210;//Базовый отступ для персонажей

    const getAllCharacters = async (offset = _baseOffset) => {//Получаем сразу всех персонажей, в ссылке, указанной ниже можно изменять некоторые параметры, к примеру такие, как количество показываемых карточек и лимит
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);//Пример оптимизации кода//getResource убираем и на его место ставим request
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {//Получаем одного персонажа//Для работы метода подставляем const и убираем this
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {//Перекинули метод сюда, так как он будет много где применяться
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

    return {loading, error, getAllCharacters, getCharacter}
}

export default useMarvelService;