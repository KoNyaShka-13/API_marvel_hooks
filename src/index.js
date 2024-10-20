import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
//import MarvelService from './services/MarvelServices';
import './style/style.scss';


//const marvelService = new MarvelService();
//
////Получаем одного пер-жа
////marvelService.getCharacter(1011052).then(res => console.log(res));
//marvelService.getAllCharacters().then(res => res.data.results.forEach(item => console.log(item.name)));//Вывожу имена

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

