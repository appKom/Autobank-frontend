import topwave from "../../resources/frontpage/topwave.svg";
import bottomwave from "../../resources/frontpage/wave.svg";

export default function FrontInfo() {
  return (
    <div className="relative bg-[#1a4b36] w-full min-h-[40rem] md:min-h-screen flex flex-col justify-between">
      {/* Velkommen */}
      <div className="flex flex-1 items-center justify-center text-center text-white font-bold text-4xl px-4">
        <div>
          <span className="block mt-20 md:mt-80">Velkommen til Autobank!</span>
          <span className="block text-2xl mt-4">
            Her kan du legge inn kvitteringer for utlegg
          </span>
        </div>
      </div>

      {/* BOTTOM WAVE */}
      <img src={bottomwave} alt="" className="w-full block" />

    </div>
  );
}
