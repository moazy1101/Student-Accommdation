import React from 'react'
import headerImage from '../components/assets/hdr.jpg'
import Header from '../components/Header'
import Recent from '../components/recent/Recent'
import Footer from '../components/common/footer/Footer'
import Connect from '../components/Connect'
import Places from '../components/Places'



const Home = () => {
  return (
    <div>
      <Header headerImage={headerImage} />
      <Recent/>
      <Places/>
      <Connect/>
      <Footer/>
    </div>
  )
}

export default Home