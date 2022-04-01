import React from "react";
import styles from "./loader.css";

export function Loader(props) {
    console.log(props);

    return (
        
        <div className="loading-dots">
            <span style={{marginRight : '6px'}}> {props.name}</span>
            <div className="loading-dots--dot"></div>
            <div className="loading-dots--dot"></div>
            <div className="loading-dots--dot"></div>
        </div>

    );
}
