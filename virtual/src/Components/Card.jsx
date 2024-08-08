import React from "react";
import "../Styles/Card.css";

const Card = ({ title, description, source, date, url }) => {
    return (
        <div className="card">
            {url && <img src={url} alt={title} className="card-image" />}
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            <p className="card-source">Source: {source}</p>
            <p className="card-date">{new Date(date).toLocaleDateString()}</p>
        </div>
    );
};

export default Card;
