import { useNavigate } from "react-router-dom" 
import { CreatePostForm } from "../../components/CreatePostForm"
import { Navbar } from "../../components/Navbar"

export function CreatePostPage() {
    const navigate = useNavigate()
    return (
        <>
            <Navbar/>
            <h2>Create a post</h2>
            <CreatePostForm onPostCreated={() => navigate("/posts")}/>
        </>
    )
}