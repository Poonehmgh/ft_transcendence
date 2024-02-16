
import React from 'react'

interface buttonProps {
    name: string;
    onClick: ()=>void;
    styleP?: any;
    
}
function Button({name, onClick, styleP}: buttonProps){
    return <button type="button" className="btn btn-dark" onClick={onClick} style={styleP}>{name}</button>
}
export default Button;