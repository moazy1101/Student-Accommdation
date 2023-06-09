import spinner from "./assets/svg/spinner2.svg";
import Navbar from "./Navbar";
export default function Spinner() {
  return (
    <>
      <Navbar backgroundColor='#222222'/>
      <div className="bg-black bg-opacity-50 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-50">
        <div>
          <img src={spinner} alt="Loading..." className="h-28" />
        </div>
      </div>
    </>
  );
}
