import { useSelector } from "react-redux"
import Footer from "../Home/Footer"
import Navbar from "../Home/Navbar"
import MapAndLocation from "./MapAndLocation"
import { RootState } from "../../../service/redux/store"
import ExpertSearching from "./ExpertSearching"

const ServiceAndLocation = () => {
    const {isOpen} = useSelector((state: RootState) => state.search) 
  return (
    <div>
        <Navbar activePage = ''/>
        {isOpen ? <ExpertSearching /> : <MapAndLocation />}
        <Footer />
    </div>
  )
}

export default ServiceAndLocation