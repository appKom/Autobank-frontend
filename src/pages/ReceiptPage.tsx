import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchCommittees } from '../api/baseAPI';
import FileUpload from '../components/form/FileUpload';
import { fileToBase64 } from '../utils/fileutils';

import { submitReceipt } from '../api/formsAPI';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { receiptSchema } from '../lib/validation/receipt.schema';

interface Receipt {
  amount: number;
  committee_id: string;
  name: string;
  description: string;
  id: 0;
}

interface PaymentInformation {
  usedOnlineCard: boolean;
  accountnumber?: string;
  cardUsed?: string;
}
interface ReceiptRequestBody {
  receipt: Receipt;
  attachments: string[];
  receiptPaymentInformation?: PaymentInformation;
}

const ReceiptPage = () => {
  const navigate = useNavigate();

  const [usedOnlineCard, setUsedOnlineCard] = useState(false);

  const schema = receiptSchema(usedOnlineCard);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      amount: '',
      account_number: '',
      card_used: '',
      name: '',
      committee_id: '',
      description: '',
      attachments: [],
    },
  });

  const setField = (name: any, value: any) => {
    setValue(name, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const accountValue = watch('account_number') || '';

  const [attachments, setAttachments] = useState<File[]>([]);
  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/heic',
    'image/heif',
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

  const { data, isError } = useQuery({
    queryKey: ['committees'],
    queryFn: () => fetchCommittees(),
  });

  const onFileChange = async (files: File[]) => {
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'heic', 'heif'];

    const validFiles: File[] = [];
    const invalidTypeFiles: File[] = [];

    files.forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const isValidType =
        allowedTypes.includes(file.type) || (extension && validExtensions.includes(extension));

      if (!isValidType) {
        invalidTypeFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidTypeFiles.length > 0) {
      alert('Bare PDF, JPG, PNG, JPEG eller HEIC filer er tillatt. Ugyldige filer ble ignorert.');
    }

    setAttachments(validFiles);
    setField('attachments', validFiles);
  };

  const formatAccountNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const parts: string[] = [];

    if (digits.length > 0) parts.push(digits.substring(0, 4));
    if (digits.length > 4) parts.push(digits.substring(4, 6));
    if (digits.length > 6) parts.push(digits.substring(6, 11));

    return parts.join(' ');
  };

  const submitform = async (data: any) => {
    setDisableSubmit(true);

    try {
      const numericAmount = parseFloat(data.amount.replace(',', '.'));

      const paymentInfo: PaymentInformation = {
        usedOnlineCard: usedOnlineCard,
        accountnumber: usedOnlineCard ? '' : data.account_number,
        cardUsed: usedOnlineCard ? data.card_used : '',
      };

      if (attachments.length === 0) {
        alert('Last opp minst én kvittering/vedlegg');
        setDisableSubmit(false);
        return;
      }

      const convertedAttachments = await Promise.all(
        [...attachments].map(async (file) => ({
          name: file.name,
          base64: await fileToBase64(file),
        }))
      );

      // Check file sizes after conversion (base64 is ~33% larger than binary)
      const maxBase64Size = MAX_FILE_SIZE * 1.34; // Account for base64 overhead
      const tooLargeFiles = convertedAttachments.filter(
        (attachment) => attachment.base64.length > maxBase64Size
      );

      if (tooLargeFiles.length > 0) {
        setDisableSubmit(false);
        alert(
          'Fil for stor. Prøv å laste opp en mindre fil/bilde. Maksimal filstørrelse er 5MB. Følgende filer er for store: ' +
            tooLargeFiles.map((f) => f.name).join(', ')
        );
        return;
      }

      const body: ReceiptRequestBody = {
        receipt: {
          amount: numericAmount,
          committee_id: data.committee_id,
          name: data.name,
          description: data.description,
          id: 0,
        },
        attachments: convertedAttachments.map((a) => a.base64),
        receiptPaymentInformation: paymentInfo,
      };

      await submitReceipt(body);
      alert('Kvittering sendt inn!');
      navigate('/?receiptsubmittedsuccess=1');
    } catch (e: any) {
      if (e.message?.includes('HEIC')) {
        alert(e.message);
      } else {
        alert('Noe gikk galt, prøv igjen senere');
      }
    }

    setDisableSubmit(false);
  };

  return (
    <div className="min-h-screen pb-[200px]">
      <div className="max-w-2xl ml-auto mr-auto">
        <div className="flex justify-center gap-[50px] mt-[60px]">
          <h1 className="text-5xl text-white text-center self-center mb-auto mt-auto font-thin">
            Kvitteringsskjema
          </h1>
          <img
            src={'../../../resources/images/receiptpageimage.png'}
            className="w-[130px] hidden md:flex "
          ></img>
        </div>
        <div className="mt-[30px]">
          <h1 className="text-3xl text-white text-center self-center font-thin">
            Kvitteringsinformasjon
          </h1>
          <h1 className="text-xl text-white text-center self-center mt-[10px] font-thin">
            Kort brukt til kjøpet
          </h1>
        </div>

        <div className="flex justify-center gap-5 mt-[10px] text-white mb-[10px]">
          <div className="flex items-center gap-3">
            <input
              defaultChecked
              onClick={() => setUsedOnlineCard(false)}
              name="receiptcard"
              className="cursor-pointer appearance-none border-white border-2 rounded-xl w-4 h-4 p-[0.05rem] checked:bg-white checked:border-white checked:bg-clip-content"
              type="radio"
            ></input>

            <label className="">Eget kort</label>
          </div>
          <div className="flex items-center gap-3">
            <input
              onClick={() => setUsedOnlineCard(true)}
              name="receiptcard"
              className="cursor-pointer appearance-none border-white border-2 rounded-xl w-4 h-4 p-[0.05rem] checked:bg-white checked:border-white checked:bg-clip-content"
              type="radio"
            ></input>
            <label>Onlines bankkort</label>
          </div>
        </div>
        {!usedOnlineCard && (
          <div className={`${usedOnlineCard ? 'hidden' : ''} text-white `}>
            <div className="flex justify-center gap-3 flex-col md:gap-10 md:flex-row items-center">
              <div className="flex-col w-[20rem]">
                <p className="text-left tracking-wide">Kontonummer</p>
                <input
                  type="text"
                  placeholder={'2345 XX XXXX'}
                  className="text-black p-3 rounded w-full"
                  value={formatAccountNumber(accountValue)}
                  maxLength={13}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setField('account_number', raw);
                  }}
                ></input>
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {errors.account_number?.message}
                </p>
              </div>
              <div className="flex-col w-[20rem]">
                <p className="text-left tracking-wide">Beløp</p>
                <input
                  type="text"
                  placeholder={'530'}
                  className="text-black p-3 rounded w-full"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    setField('amount', e.target.value);
                  }}
                />
                <p className="text-red-500 text-sm min-h-[1.25rem]">{errors.amount?.message}</p>
              </div>
            </div>
            <div className="flex justify-center mt-[10px] gap-3 flex-col md:gap-10 md:flex-row items-center">
              <div className="flex-col w-[20rem]">
                <p className="text-left tracking-wide">Anledning</p>
                <input
                  placeholder={'Arbeidskveld'}
                  className="text-black p-3 rounded w-full"
                  {...register('name')}
                ></input>
                <p className="text-red-500 text-sm min-h-[1.25rem]">{errors.name?.message}</p>
              </div>
              <div className="flex-col w-[20rem]">
                <p className="text-left tracking-wide">Ansvarlig enhet</p>
                <select className="text-black p-3 rounded w-full" {...register('committee_id')}>
                  <option value="">Ingen</option>
                  {data && data.length
                    ? data.map((committee: any) => {
                        return (
                          <option key={committee.id} value={committee.id}>
                            {committee.name}
                          </option>
                        );
                      })
                    : null}
                </select>
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {errors.committee_id?.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {usedOnlineCard && (
          <div className={`${!usedOnlineCard ? 'hidden' : ''} text-white`}>
            <div className="flex justify-center gap-3 flex-col md:gap-10 md:flex-row items-center">
              <div className="flex-col w-[20rem]">
                <p className="text-left tracking-wide">Kort benyttet</p>
                <select className="text-black p-3 rounded w-full" {...register('card_used')}>
                  <option value="">Ingen</option>
                  {data && data.length
                    ? data.map((committee: any) => {
                        return (
                          <option key={committee.id} value={committee.id}>
                            {committee.name}
                          </option>
                        );
                      })
                    : null}
                  <option key="Interkom" value="Interkom">
                    Interkom
                  </option>
                </select>
                <p className="text-red-500 text-sm min-h-[1.25rem]">{errors.card_used?.message}</p>
              </div>
              <div className="flex-col w-[20rem]">
                <p className="text-left tracking-wide">Beløp</p>
                <input
                  type="text"
                  placeholder={'530'}
                  className="text-black p-3 rounded w-full"
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    setField('amount', e.target.value);
                  }}
                />
                <p className="text-red-500 text-sm min-h-[1.25rem]">{errors.amount?.message}</p>
              </div>
            </div>
            <div className="flex justify-center mt-[10px] gap-3 flex-col md:gap-10 md:flex-row items-center">
              <div className="flex-col w-[20rem]">
                <p className="text-left tracking-wide">Anledning</p>
                <input
                  placeholder={'Arbeidskveld'}
                  className="text-black p-3 rounded w-full"
                  {...register('name')}
                ></input>
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {errors.description?.message}
                </p>
              </div>
              <div className="flex-col w-[20rem]">
                <p className="text-left tracking-wide">Ansvarlig enhet</p>

                <select className="text-black p-3 rounded w-full" {...register('committee_id')}>
                  <option value="">Ingen</option>
                  {data && data.length
                    ? data.map((committee: any) => {
                        return (
                          <option key={committee.id} value={committee.id}>
                            {committee.name}
                          </option>
                        );
                      })
                    : null}
                </select>
                <p className="text-red-500 text-sm min-h-[1.25rem]">
                  {errors.committee_id?.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-white mb-[10px] mt-[10px]">
          <h1 className="text-3xl text-white text-center self-center mt-[20px] font-thin mb-[10px]">
            Vedlegg/Kvitteringer
          </h1>
          <p className="mx-5">
            Last opp et tydelig bilde/scan av kvitteringen. Husk at kvitteringen må være gyldig for
            at den skal godkjennes. Organisasjonsnummer må være <b>synlig</b>. Er du usikker på om
            kvitteringen er gyldig?{' '}
            <a href="/faq" className="text-green-400 underline">
              Se her
            </a>
          </p>
        </div>
        <div className="flex-col mx-5">
          <p className="text-white w-full text-left text-l mb-[5px]">Vedlegg</p>
          <FileUpload files={attachments} onFileChange={onFileChange} />
          <p className="text-red-500 text-sm min-h-[1.25rem]">{errors.attachments?.message}</p>
        </div>
        <div className="flex-col mt-[20px] mx-5">
          <p className="text-white w-full text-left text-l mb-[5px]">Kommentarer</p>
          <textarea
            className="w-full border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-[120px] bg-white"
            {...register('description')}
          ></textarea>
        </div>
        <div>
          <button
            disabled={disableSubmit}
            className="p-3 bg-white rounded mt-[30px] hover:bg-gray-200"
            onClick={handleSubmit(submitform)}
          >
            Send skjema
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
