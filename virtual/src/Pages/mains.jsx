import React, { useState, useEffect } from "react";
import Card from "../Components/Card";
import "../Styles/Mains.css";
import SubNavbar from "../Components/SubNavbar";
import axiosInstance from '../auth/axiosInstance'; 

function Mains() {
    const [news, setNews] = useState([]);

    async function fetchNews() {
        try {
          const id = "Main";
            const response = await axiosInstance.get(`/dashboard/main/list/${id}`);
            setNews(response.data);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="notice-board">
            <SubNavbar />
            <div className="news-list">
                {news.map((item) => (
                    <Card
                        key={item.id}
                        title={item.subject}
                        description={item.content}
                        source={item.source}
                        date={item.date}
                        url={item.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
}

export default Mains;
