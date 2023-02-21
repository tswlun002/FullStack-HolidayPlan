import "./Header.css"
export default function Headers(){
    const date = new Date(Date.now()).toDateString();

    return (
        <nav className="nav-bar">
            <div className="nav-item">
                <h1 className="title">MY HOLIDAYS PLANS</h1>
                <h1 className="date"> by {date}</h1>
            </div>
        </nav>
    )
}