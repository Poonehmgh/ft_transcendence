
import React from 'react'

interface buttonProps {
    name: string;
    onClick: ()=>void;
    
}
function Button({name, onClick}: buttonProps){
    return <button type="button" className="btn btn-dark" onClick={onClick} style={{ position: 'absolute', top: '73%', right: "24%"}}>{name}</button>
}
export default Button;