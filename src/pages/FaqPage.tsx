import { useAuth } from 'react-oidc-context';

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#2E6E53] text-white text-left">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12 pt-8">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-5xl text-white text-center self-center mb-auto mt-auto font-thin">
              Retningslinjer for kvitteringer for hele Online
            </h1>
          </div>
        </header>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2 underline">Bakgrunn:</h3>
            <p className="mb-4">
              Hensikten med disse retningslinjene er å gi forutsigbarhet for arbeidet til alle
              onlines økonomiansvarlige, slik at de klarer å holde bankoms frister samt følge
              gjeldene regler for tilbakebetaling og føringer av kjøp.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-2 underline">Gyldig kvittering:</h3>
            <p className="mb-4">
              Alle kvitteringsskjema krever gyldig kvittering for at bankom kan registrere kjøp, og
              eventuelt betale tilbake for utlegg.
            </p>
            <p className="mb-2 font-medium">En gyldig kvittering har:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Dato for når kvitteringen er skrevet ut</li>
              <li>Selgers navn og adresse, og/eller organisasjonsnummer.</li>
              <li>Beskrivelse av varen/tjenesten, og omfanget av den.</li>
              <li>Tidspunktet for sted av levering av varen/tjenesten.</li>
              <li>
                Eventuell merverdiavgift (moms) og andre avgifter knyttet til transaksjonen som
                kreves spesifisert i lov eller forskrift. Merverdiavgift skal angis i norske kroner.
              </li>
            </ul>
            <p className="italic">
              *i noen tilfeller krever onlines drift innkjøp av varer og/eller tjenester fra
              utlandet. I slike tilfeller skal det alltid avklares med økonomiansvarlig for online
              før kjøpet gjennomføres.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2 underline">Utlegg med kort fra online:</h3>
            <p className="mb-4">
              Utlegg på vegne av online skal alltid avklares med sin økonomiansvarlig før kjøpet
              gjennomføres. Ved utlegg med ett av online sine kort skal kvitteringsskjema med gyldig
              kvittering som beskrevet ovenfor sendes til bankom innen tre virkedager. Hvis man ikke
              får kvittering fra kjøpet må man ta kontakt med selger for å skaffe gyldig kvittering.
              Hvis dette ikke funker skal man varsle umiddelbart til ansvarlig person i bankom.
            </p>
            <p className="mb-4">
              Ved utlegg med ett av online sine kort skal det sendes ett kvitteringsskjema for hvert
              kjøp.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2 underline">Utlegg med eget bankort:</h3>
            <p className="mb-4">
              Frist for innsending av kvitteringsskjema for utlegg på egen regning er 7 dager.
              Kvitteringsskjema kan sendes inn etter dette ved god grunn og avtale med
              økonomiansvarlig fra sin komite. Hvis kvitteringsskjema kommer etter denne fristen
              uten avtale kan ikke bankom garantere at pengene blir tilbakebetalt.
            </p>
            <p className="mb-4">
              Ved utlegg med eget bankkort kan man sende kvitteringsskjema for flere utlegg i ett
              skjema. Da er det viktig at alle kvitteringene for utlegget blir med, og at summen i
              skjemaet stemmer med hva som er lagt ut.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 underline">Brudd på frister:</h3>
            <p>
              Ved brudd på noen av fristene ovenfor skal det gis vinstraff i ansvarlig komite for
              anledningen betalingen er for.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
