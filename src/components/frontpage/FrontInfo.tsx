import topwave from "../../resources/frontpage/topwave.svg";
import bottomwave from "../../resources/frontpage/wave.svg";

export default function FrontInfo() {
  return (
    <div className="relative bg-[#1a4b36] w-full min-h-[40rem] md:min-h-screen">
      {/* Velkommen */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white font-bold text-4xl px-4">
        <div>
          <span className="block md:text-5xl">Velkommen til Autobank!</span>
          <span className="block text-2xl mt-4">
            Her kan du legge inn kvitteringer for utlegg
          </span>
        </div>
      </div>

      {/* BOTTOM WAVE */}
      <img src={bottomwave} alt="" className="w-full block absolute bottom-0" />
    </div>
  );
}
