import Header from "./NavBar"
import Main from "./Main"
import Sidebar from "./SideBar"
import { useState } from "react";

const Home = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  return (
    <div className="flex">
      <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <div className="flex-1 flex flex-col">
        <Header />
        <Main selectedOption={selectedOption}/>
      </div>
    </div>
  )
}

export default Home