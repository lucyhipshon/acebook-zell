import { Navbar } from "../../components/Navbar";

export function NotFoundPage() {
    return (
        <div className="section">
            <Navbar/>
                <div className="containeris-centered mt-5">
                    <h1 className="has-text-centered has-text-link is-size-2 mb-5" style={{fontSize: "3rem", fontWeight: "bold"}}>Oops! This page is still under construction...</h1>
                    <figure className="image is-square has-ratio">
                        <img className="is-rounded" src="/not_found_rubber_duck.gif" alt="rubber duck"/>
                    </figure>
                </div>
        </div>
  );
}
