
import bottomwave from "../../resources/frontpage/wave.svg";
import moneyLeft from "../../resources/frontpage/money_left.png";
import moneyRight from "../../resources/frontpage/money_right.png";

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

      <img 
        src={moneyRight} 
        alt="" 
        className="money-money object-contain w-[900px] h-auto absolute top-[20%] hidden xl:block
                  right-[-50px] xl:right-[-200px]"/>
      
      <div className="absolute top-[25%] hidden xl:block left-[-200px]">
        <img src={moneyLeft} alt="" className="money-money object-contain w-[900px] h-auto " />
      </div>



  

      {/* BOTTOM WAVE */}
      <img src={bottomwave} alt="" className="w-full block absolute bottom-0" />
    </div>
  );
}
