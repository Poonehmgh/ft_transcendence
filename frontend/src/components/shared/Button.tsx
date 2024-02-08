
import React from 'react'
// import 'bootstrap/dist/css/bootstrap.css'

interface buttonProps {
    name: string;
    onClick: ()=>void;
}
function Button({name, onClick}: buttonProps){
    return <button type="button" className="btn btn-dark" onClick={onClick}>{name}</button>
}
export default Button;