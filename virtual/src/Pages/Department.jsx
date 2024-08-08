import Card from "../Components/Card";
import { useState, useEffect } from "react";
import "../Styles/Mains.css";
import SubNavbar from "../Components/SubNavbar";
import axiosInstance from '../auth/axiosInstance';

function Department() {
    const [news, setNews] = useState([]);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const profileData = JSON.parse(localStorage.getItem('profile'));
            setProfile(profileData);
            console.log(profileData);
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (profile && profile.department) {
                try {
                    const response = await axiosInstance.get(`/dashboard/department/list/${profile.department}`);
                    setNews(response.data);
                } catch (error) {
                    console.error("Error fetching department news:", error);
                }
            }
        };

        fetchData();
    }, [profile]);

    return (
        <div className="notice-board">
            <SubNavbar />
            <div className="news-list">
                {news.map((item, index) => (
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

export default Department;
