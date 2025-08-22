import { useNavigate } from "react-router-dom" 
import { CreatePostForm } from "../../components/CreatePostForm"
import { Navbar } from "../../components/Navbar"

export function CreatePostPage() {
    const navigate = useNavigate()
    return (
        <div style={{height: "100vh"}}>
            <Navbar/>
            <CreatePostForm onPostCreated={() => navigate("/quacks")}/>
        </div>
    )
}