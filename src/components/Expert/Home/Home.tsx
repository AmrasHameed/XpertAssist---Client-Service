import { useState } from "react";
import Main from "./Main";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Home = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <div className="flex-grow flex flex-col">
        <Navbar />
        <Main selectedOption={selectedOption} />
      </div>
    </div>
  );
};

export default Home;
