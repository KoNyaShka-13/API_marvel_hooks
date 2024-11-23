import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
//import MarvelService from './services/MarvelServices';
import './style/style.scss';


//const marvelService = new MarvelService();
//
////Получаем одного пер-жа
////marvelService.getCharacter(1011052).then(res => console.log(res));
//marvelService.getAllCharacters().then(res => res.data.results.forEach(item => console.log(item.name)));//Вывожу имена


//v.18.00
ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
  )

//v.17.00
//ReactDOM.render(
//  <React.StrictMode>
//    <App />
//  </React.StrictMode>,
//  document.getElementById('root')
//);

