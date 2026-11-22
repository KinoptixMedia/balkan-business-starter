import { site } from "../site.config.ts";
import { DAYS, DAY_NAMES_SR } from "../lib/hours.ts";
import { PATHS, localBusinessJsonLd } from "../lib/seo.ts";
import { scriptT, type Script } from "../lib/translit.ts";
import { OpenNow, TodayMarker } from "./OpenNow.tsx";
import { ContactForm } from "./ContactForm.tsx";
import { Leaf } from "./Leaf.tsx";

/** UI strings, written once in Latin. */
const UI = {
  call: "Pozovi",
  gallery: "Galerija",
  hours: "Radno vreme",
  findUs: "Adresa",
  contact: "Kontakt",
  closedDay: "Ne radimo",
  from: "od",
  currency: "din.",
  openMaps: "Otvori u Google mapama",
  writeUs: "Pošaljite poruku",
  writeUsNote: "Za rezervacije, ketering ili pitanja. Odgovaramo istog dana.",
  form: {
    name: "Ime", contact: "Telefon ili email", message: "Poruka", send: "Pošalji poruku",
    sending: "Šaljem…", sent: "Poruka je poslata. Javićemo vam se istog dana.",
    error: "Poruka nije poslata. Pozovite nas telefonom ili pokušajte ponovo.",
  },
  mainNav: "Glavni meni",
  switchTo: { lat: "Ћирилица", cir: "Latinica" },
};

export function HomePage({ script }: { script: Script }) {
  const t = scriptT(script);
  const { contact, address } = site;
  const mapsQuery = encodeURIComponent(
    address.geo ? `${address.geo.lat},${address.geo.lng}` : `${site.name}, ${address.street}, ${address.city}`,
  );
  const wa = `https://wa.me/${contact.phone}`;
  const viber = `viber://chat?number=%2B${contact.phone}`;
  const tel = `tel:+${contact.phone}`;
  const price = (n: number) => `${n.toLocaleString("sr-RS")} ${t(UI.currency)}`;
  const other: Script = script === "lat" ? "cir" : "lat";
  const otherLang = other === "cir" ? "sr-Cyrl" : "sr-Latn";
  const [featured, ...restGallery] = site.gallery;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />

      <header className="topbar">
        <a href={PATHS[script]} className="brand">
          <Leaf className="brand-leaf" />
          {t(site.name)}
        </a>
        <nav aria-label={t(UI.mainNav)}>
          <a href="#jelovnik">{t(site.servicesNav)}</a>
          <a href="#galerija">{t(UI.gallery)}</a>
          <a href="#kontakt">{t(UI.contact)}</a>
          <a href={PATHS[other]} hrefLang={otherLang} lang={otherLang} className="script-switch">
            {UI.switchTo[script]}
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <OpenNow hours={site.hours} script={script} />
            <h1>{t(site.name)}</h1>
            <p className="tagline">{t(site.tagline)}</p>
            <p className="intro">{t(site.description)}</p>
            <div className="actions">
              <a className="btn btn-primary" href={tel}>
                {t(UI.call)} <span className="nowrap">{contact.phoneDisplay}</span>
              </a>
              {contact.whatsapp && <a className="btn" href={wa}>WhatsApp</a>}
              {contact.viber && <a className="btn" href={viber}>Viber</a>}
            </div>
          </div>
          <Leaf className="hero-leaf" />
        </section>

        <section id="jelovnik" className={`menu-wrap backdrop-${site.menuBackdrop}`}>
          <div className="menu">
            <h2>{t(site.servicesTitle)}</h2>
            {site.servicesNote && <p className="menu-note">{t(site.servicesNote)}</p>}
            <ul className="menu-list">
              {site.services.map((s) => (
                <li key={s.name}>
                  <div className="menu-line">
                    <h3>{t(s.name)}</h3>
                    <span className="leader" aria-hidden />
                    {s.price !== undefined && (
                      <span className="price">{s.priceFrom && `${t(UI.from)} `}{price(s.price)}</span>
                    )}
                  </div>
                  {s.description && <p>{t(s.description)}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {featured && (
          <section id="galerija" className="block">
            <h2>{t(UI.gallery)}</h2>
            <div className="gallery">
              {[featured, ...restGallery].map((g, i) => (
                <figure key={g.src} className={i === 0 ? "g-main" : undefined}>
                  <img src={g.src} alt={t(g.alt)} loading="lazy" width={800} height={600} />
                  <figcaption>{t(g.alt)}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section id="kontakt" className="block info">
          <div>
            <h2>{t(UI.hours)}</h2>
            <table className="hours">
              <tbody>
                {DAYS.map((d) => (
                  <tr key={d} data-day={d}>
                    <th scope="row">{t(DAY_NAMES_SR[d])}</th>
                    <td>{site.hours[d] ? site.hours[d]!.join("–") : t(UI.closedDay)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TodayMarker />

            <h2>{t(UI.findUs)}</h2>
            <address>
              {t(address.street)}<br />
              {address.postalCode} {t(address.city)}
            </address>
            <p className="contact-lines">
              <a href={tel}>{contact.phoneDisplay}</a><br />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            <a className="maps-link" href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}>
              {t(UI.openMaps)}
            </a>
          </div>

          <div className="form-col">
            <h2>{t(UI.writeUs)}</h2>
            <p className="form-intro">{t(UI.writeUsNote)}</p>
            <ContactForm
              endpoint={contact.formEndpoint}
              email={contact.email}
              subject={site.name}
              labels={Object.fromEntries(Object.entries(UI.form).map(([k, v]) => [k, t(v)])) as typeof UI.form}
            />
          </div>
        </section>

        <section className="map" aria-label={t(UI.findUs)}>
          <iframe
            title={t(UI.findUs)}
            src={`https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>

      <footer className="footer">
        <p>{t(site.name)}, {t(address.street)}, {t(address.city)}</p>
        <p className="social">
          {Object.entries(site.social).filter(([, url]) => url).map(([name, url]) => (
            <a key={name} href={url} rel="me">{name}</a>
          ))}
        </p>
      </footer>

      {/* Sticky contact bar on phones: most local visitors just want to call. */}
      <nav className="callbar" aria-label={t(UI.contact)}>
        <a href={tel}>{t(UI.call)}</a>
        {contact.whatsapp && <a href={wa}>WhatsApp</a>}
        {contact.viber && <a href={viber}>Viber</a>}
      </nav>
    </>
  );
}
