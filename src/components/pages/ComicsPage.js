//С большой буквы назвал файлы, так как они будут компонентами
import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

const ComicsPage = () => {
    return (
        <>
            <AppBanner/>
            <ComicsList/>
        </>
    )
}

export default ComicsPage;