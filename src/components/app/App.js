import {lazy, Suspense} from 'react';//Саспенс нужен для отлова ошибок
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import AppHeader from "../appHeader/AppHeader";
import Spinner from '../Spinner/Spinner';
//Динамческие импорты всегда подгружают после статических
const Page404 = lazy(() => import('../pages/404'));//Ленивая загрузка нужна, когда кода много, для оптимизации. В моем случае - отработка практики 
const MainPage = lazy(() => import('../pages/MainPage'));//В динамический импорт можно положить и главную страницу, т.к. обычно, на нее редко заходят, а сразу отправляются в другие разделы
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicLayout = lazy(() => import('../pages/singleComicLayout/singleComicLayout'));//У меня другая версия рутера, из-за этого не работает переход на отдельного персонажа и на комикс должным образом, можно позже переделать
const SingleCharacterLayout = lazy(() => import('../pages/singleCharacterLayout/singleCharacterLayout'));
const SinglePage = lazy(() => import('../pages/SinglePage'));


//React transition  на router v.6 будет работать, если установить key  и in, обьяснение есть в вопросах 181 урока
const App = () => {
    
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path="/comics" element={<ComicsPage/>}/>
                            <Route path="/" element={<MainPage/>}/>
                            {/*<Route path="/comics/:id" element={<SinglePage />} element={<SingleComicLayout/>} dataType='comic'/>
                            <Route path="/characters/:id" element={<SinglePage />}/>*/}
                            <Route element={<SinglePage />}>
                                <Route path="/comics/:id" element={<SingleComicLayout />} />
                                <Route path="/characters/:id" element={<SingleCharacterLayout />} />
                            </Route>
                            <Route path='*' element={<Page404/>}/>
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}
 
export default App;