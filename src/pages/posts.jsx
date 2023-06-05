import Dashboard from "../posts/components/dashboard"



const Posts=()=>{
    return(
        <>
       {/* <div className='w-full  bg-no-repeat header relative bg-center z-20 text-white' 
          style={{backgroundImage: `url(${headerImage})`,backgroundSize: "95% 110%",height: 550}}>
    <Navbar/>
      <div className="container">
        <div className="w-full absolute h-full top-0 left-0 -z-10" 
              style={{backgroundImage: 'linear-gradient(to bottom right, rgb(0,0,0,0.6), transparent)'}}>
        </div>
        <div className="media text-center" style={{marginTop: '10%'}}>
          <h1 className='text-5xl font-medium tracking-wider'>Home away from Home</h1>
          <p className='text-xl text-gray-300'>Let us find you a new home near top universities across egypt</p>
        </div>
      </div>
    </div> */}
    <Dashboard/>
        </>
    )
}
export default Posts