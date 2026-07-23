import { useParams } from "react-router";

function EditPostPage(){
    const { id } = useParams();

    return(
        <main>
            <h1>Edit post</h1>
            <p>Editing Post ID: {id}</p>
        </main>
    );
}

export default EditPostPage;