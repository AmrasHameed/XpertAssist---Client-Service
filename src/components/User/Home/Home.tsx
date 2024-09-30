import Footer from "./Footer"
import Main from "./Main"
import Navbar from "./Navbar"
import Services from "./Services"

const Home = () => {
  return (
    <div>
        <Navbar activePage="home"/>
        <Main />
        <Services />
        <Footer />
    </div>
  )
}

export default Home