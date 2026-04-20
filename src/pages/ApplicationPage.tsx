import Navbar from '../components/universal/Navbar';
import { useState } from 'react';
import FileUpload from '../components/form/FileUpload';
import { fileToBase64 } from '../utils/fileutils';
import { submitEconomicRequest } from '../api/formsAPI';

const ApplicationPage = () => {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const onFileChange = async (files: File[]) => {
    setAttachments([...files]);
  };

  const [formdata, setFormdata] = useState({
    description: '',
    purpose: '',
    paymentDescription: '',
    amount: 0,
    date: '',
    otherInformation: '',
  });

  const submitform = async () => {
    if (!formdata.description) return alert('Fyll inn beskrivelse.');
    if (!formdata.purpose) return alert('Fyll inn formål.');
    if (!formdata.amount) return alert('Fyll inn beløp.');
    if (!formdata.paymentDescription) return alert('Velg betalingsmåte.');
    if (!formdata.date) return alert('Velg dato.');

    setDisableSubmit(true);
    try {
      await submitEconomicRequest({
        economicrequest: {
          subject: formdata.description,
          description: formdata.description,
          purpose: formdata.purpose,
          amount: formdata.amount,
          paymentDescription: formdata.paymentDescription,
          date: `${formdata.date}T00:00:00`,
          otherInformation: formdata.otherInformation,
        },
        attachments: await Promise.all(attachments.map((file) => fileToBase64(file))),
      });
      alert('Søknad sendt inn!');
    } catch (e) {
      console.error(e);
      alert('Noe gikk galt. Prøv igjen.');
    }
    setDisableSubmit(false);
  };

  return (
    <div className="min-h-screen pb-[200px]">
      <div className="max-w-2xl ml-auto mr-auto px-10">
        <div className="flex justify-center gap-[50px] mt-[60px]">
          <h1 className="text-5xl text-white text-center self-center mb-auto mt-auto font-thin">
            Søknadsskjema
          </h1>
          <img
            src={'../../../resources/images/receiptpageimage.png'}
            className="w-[130px] hidden md:flex"
          ></img>
        </div>
        <div className="mt-[30px]">
          <h1 className="text-3xl text-white text-center self-center font-thin">Beskrivelse</h1>
        </div>
        <div className="flex-col mt-[20px]">
          <p className="text-white w-full text-left text-l mb-[5px]">
            Forklar hvem dere er og hva pengene skal brukes til
          </p>
          <textarea
            name=""
            id=""
            className="w-full border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-[120px] bg-white"
            onChange={(e) => setFormdata({ ...formdata, description: e.target.value })}
          ></textarea>
        </div>
        <div className="flex-col mt-[20px]">
          <p className="text-white w-full text-left text-l mb-[5px]">
            Hvordan går midlene Onlinere til gode?
          </p>
          <textarea
            name=""
            id=""
            className="w-full border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-[120px] bg-white"
            onChange={(e) => setFormdata({ ...formdata, purpose: e.target.value })}
          ></textarea>
        </div>
        <div className="text-white flex justify-center gap-4 mt-[20px]">
          <div className="flex-col w-1/2">
            <p className="text-left tracking-wide">Beløp</p>
            <input
              placeholder={'530'}
              className="text-black p-3 rounded w-full"
              onChange={(e) => setFormdata({ ...formdata, amount: parseInt(e.target.value) })}
            ></input>
          </div>
          <div className="flex-col w-1/2">
            <p className="text-left tracking-wide">Hvordan skal betalingen foregå?</p>
            <select
              className="text-black p-3 rounded w-full"
              onChange={(e) => setFormdata({ ...formdata, paymentDescription: e.target.value })}
            >
              <option value="">Velg betalingsmåte</option>
              <option value="faktura">Faktura</option>
              <option value="utlegg">Utlegg</option>
            </select>
          </div>
        </div>

        <div className="text-white flex-col mt-[20px]">
          <p className="text-left tracking-wide mb-[5px]">Dato utstyr skal kjøpes inn</p>
          <input
            type="date"
            className="text-black p-3 rounded w-full"
            onChange={(e) => setFormdata({ ...formdata, date: e.target.value })}
          />
        </div>

        <div className="text-white mb-[10px] mt-[10px]">
          <h1 className="text-3xl text-white text-center self-center mt-[20px] font-thin mb-[10px]">
            Vedlegg
          </h1>
          <p>Last opp eventuelle filer/bilder av budsjett eller annet</p>
        </div>
        <div className="flex-col">
          <p className="text-white w-full text-left text-l mb-[5px]">Vedlegg</p>
          <FileUpload files={attachments} onFileChange={onFileChange} />
        </div>

        <div className="flex-col mt-[20px]">
          <p className="text-white w-full text-left text-l mb-[5px]">Kommentarer</p>
          <textarea
            name=""
            id=""
            className="w-full border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-[120px] bg-white"
            onChange={(e) => setFormdata({ ...formdata, otherInformation: e.target.value })}
          ></textarea>
        </div>

        <div>
          <button
            disabled={disableSubmit}
            className="p-3 bg-white rounded mt-[30px] hover:bg-gray-200"
            onClick={submitform}
          >
            Send skjema
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
