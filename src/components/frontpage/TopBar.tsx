import topwave from '../../resources/frontpage/topwave.svg';
import Navbar from '../universal/Navbar';
export default function Topbar() {
  return (
    <div className="bg-transparent w-full fixed z-10">
      <img src={topwave} alt="" />
    </div>
  );
}
