import topwave from "../../resources/frontpage/topwave.svg";
import bottomwave from "../../resources/frontpage/wave.svg";

export default function FrontInfo() {
  return (
    <div className="relative bg-[#1a4b36] w-full min-h-[40rem] md:min-h-screen flex flex-col justify-between">
      {/* Velkommen */}
      <div className="flex flex-1 items-end justify-center text-center text-white font-bold text-4xl px-4 xl:pb-10 lg:pb-36 md:pb-72 pb-32">
        <div className="">
          <span className="block mt-20 md:text-5xl">Velkommen til Autobank!</span>
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
