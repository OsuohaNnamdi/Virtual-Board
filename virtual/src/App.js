import ErrorPage from "./Pages/ErrorPage.jsx";
import Navbar from "./Components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddDashboard from "./Pages/AddDashboard.jsx";
import Login from "./auth/Login.jsx"; 
import Mains from "./Pages/mains.jsx";
import Faculty from "./Pages/Faculty.jsx";
import Department from "./Pages/Department.jsx";
import NoticeTable from "./Pages/NoticeTable.jsx";
import HomeMainbar from "./Pages/HomeMainbar.jsx";
import AskQuestion from "./Pages/AskQuestion.jsx";
import QuestionsDetails from "./Pages/QuestionsDetails.jsx";
import User from "./Pages/User.jsx";

function App() 
{
  return (
      <>
        <BrowserRouter>
                
            <Navbar />
            
            <Routes>
                <Route path="/" element={<Mains/>} />
                <Route path="/profile" element={<User/>} />
                <Route path="/AskQuestion" element={<AskQuestion/>} />
                <Route path="/Questions/:id" element={<QuestionsDetails />} />
                <Route path="/community" element={<HomeMainbar/>} />
                <Route path="/notice" element={<NoticeTable/>} />
                <Route path="/faculty" element={<Faculty/>} />
                <Route path="/department" element={<Department/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/add" element={<AddDashboard />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>

        </BrowserRouter>
      </>
  );
}

export default App