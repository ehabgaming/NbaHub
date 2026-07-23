import { useParams } from "react-router"

function PostDetilsPage(){
    const { id } = useParams();
    return(
        <main>
            <h1>Post Details</h1>
            <p>post ID: {id}</p>
        </main>
    );
}

export default PostDetilsPage;