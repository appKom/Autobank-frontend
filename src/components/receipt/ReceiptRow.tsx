import { useLocation, useNavigate } from 'react-router-dom';
import { Receipt_Info } from '../../api/adminReceiptAPI';
import { IoIosMail, IoIosCloseCircle, IoMdCheckmark } from 'react-icons/io';

interface ReceiptOverviewProps {
  receipt: Receipt_Info;
}

const ReceiptRow = ({ receipt }: ReceiptOverviewProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const linkBase = location.pathname.includes('/admin') ? '/admin/kvittering/' : '/minside/';

    const fullLink = `${linkBase}${receipt.receiptId}`;

    navigate(fullLink);
  };

  return (
    <tr
      onClick={handleClick}
      className="h-[100px] shadow-black border-violet-500 mb-5 ml-0 group hover:cursor-pointer"
    >
      <td className="bg-[#b0deca] flex items-center justify-center h-[100px] rounded-tl rounded-bl">
        <div className="relative">
          {receipt.latestReviewStatus === 'APPROVED' ? (
            <IoMdCheckmark color="green" className="text-3xl" />
          ) : receipt.latestReviewStatus === 'DENIED' ? (
            <IoIosCloseCircle color="#DD0000" className="text-3xl" />
          ) : (
            <IoIosMail color="#0000CC" className="text-3xl" />
          )}
          <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {receipt.latestReviewStatus === 'APPROVED'
              ? 'Godkjent'
              : receipt.latestReviewStatus === 'DENIED'
                ? 'Avvist'
                : 'Ubesvart'}
          </span>
        </div>
      </td>
      <td className="bg-[#b0deca] text-left font-semibold hidden md:table-cell">
        {receipt.committeeName}
      </td>
      <td className="bg-[#b0deca] text-left ">{receipt.receiptName}</td>
      <td className="bg-[#b0deca] text-left hidden lg:table-cell  font-semibold ">
        {receipt.paymentOrCard === 'Payment' ? 'Utlegg' : 'Kort'}
      </td>
      <td className="bg-[#b0deca] text-left max-h-3 hidden lg:table-cell max-w-[150px] overflow-hidden line-clamp-3">
        {receipt.receiptDescription.slice(0, 60)}
        {receipt.receiptDescription.length > 60 ? '...' : ''}
      </td>
      <td className="bg-[#b0deca] text-center w-[110px] rounded-tr rounded-br font-semibold">
        {`${new Date(receipt.receiptCreatedAt).getDate()}.${
          new Date(receipt.receiptCreatedAt).getMonth() + 1
        } ${new Date(receipt.receiptCreatedAt).getFullYear()}`}
      </td>
    </tr>
  );
};

export default ReceiptRow;
