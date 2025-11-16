import money1 from "../../resources/frontpage/money1.png";
import money2 from "../../resources/frontpage/money2.png";

export default function FrontInfo() {
  return (
    <div className=" bg-[#282c34] w-full h-screen">
      <div className="text-center text-white absolute w-[100%] top-[50%] font-bold text-4xl">
        <span className="block">Velkommen til Autobank!</span>
        <span className="block text-2xl">Søk om støtte eller</span>
        <span className="block text-2xl">legg inn kvittering for utlegg</span>
  
      </div>

      <img src={money1} alt="" className="money-money object-contain w-[500px] h-auto absolute top-[30%] hidden xl:block
                  right-[-50px] xl:right-[-50px]"/>


      <div className="flipped absolute top-[20%] hidden xl:block left-[-250px] xl:left-[-50px]">
        <img src={money2} alt="" className="money-money object-contain w-[500px] h-auto " />
      </div>
    </div>
  );
}
