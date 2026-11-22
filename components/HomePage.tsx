import { site } from "../site.config.ts";
import { DAYS, DAY_NAMES_SR } from "../lib/hours.ts";
import { PATHS, localBusinessJsonLd } from "../lib/seo.ts";
import { scriptT, type Script } from "../lib/translit.ts";
import { OpenNow } from "./OpenNow.tsx";
import { ContactForm } from "./ContactForm.tsx";

/** UI strings, written once in Latin. */
const UI = {
  call: "Pozovi",
  services: "Usluge",
  gallery: "Galerija",
  hours: "Radno vreme",
  findUs: "Gde se nalazimo",
  contact: "Kontakt",
  closedDay: "Zatvoreno",
  openNow: "Otvoreno sada",
  closedNow: "Trenutno zatvoreno",
  from: "od",
  currency: "din.",
  openMaps: "Otvori u Google mapama",
  writeUs: "Pišite nam",
  form: {
    name: "Ime", contact: "Telefon ili email", message: "Poruka", send: "Pošalji",
    sending: "Šaljem…", sent: "Hvala! Javićemo vam se uskoro.", error: "Nešto nije u redu. Pozovite nas telefonom.",
  },
  switchTo: { lat: "Ћирилица", cir: "Latinica" },
};

export function HomePage({ script }: { script: Script }) {
  const t = scriptT(script);
  const { contact, address } = site;
  const fullAddress = `${address.street}, ${address.postalCode} ${address.city}`;
  const mapsQuery = encodeURIComponent(
    address.geo ? `${address.geo.lat},${address.geo.lng}` : `${site.name}, ${fullAddress}`,
  );
  const wa = `https://wa.me/${contact.phone}`;
  const viber = `viber://chat?number=%2B${contact.phone}`;
  const tel = `tel:+${contact.phone}`;
  const price = (n: number) => `${n.toLocaleString("sr-RS")} ${t(UI.currency)}`;
  const other: Script = script === "lat" ? "cir" : "lat";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />

      <header className="topbar">
        <a href={PATHS[script]} className="brand">{t(site.name)}</a>
        <nav aria-label={t("Glavni meni")}>
          <a href="#usluge">{t(UI.services)}</a>
          <a href="#galerija">{t(UI.gallery)}</a>
          <a href="#kontakt">{t(UI.contact)}</a>
          <a href={PATHS[other]} hrefLang={other === "cir" ? "sr-Cyrl" : "sr-Latn"} className="script-switch">
            {UI.switchTo[script]}
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <OpenNow hours={site.hours} labels={{ open: t(UI.openNow), closed: t(UI.closedNow) }} />
          <h1>{t(site.name)}</h1>
          <p className="lead">{t(site.tagline)}</p>
          <p>{t(site.description)}</p>
          <div className="actions">
            <a className="btn btn-primary" href={tel}>{t(UI.call)} {contact.phoneDisplay}</a>
            {contact.whatsapp && <a className="btn" href={wa}>WhatsApp</a>}
            {contact.viber && <a className="btn" href={viber}>Viber</a>}
          </div>
        </section>

        <section id="usluge" className="section">
          <h2>{t(site.servicesTitle)}</h2>
          <ul className="services">
            {site.services.map((s) => (
              <li key={s.name}>
                <div>
                  <h3>{t(s.name)}</h3>
                  {s.description && <p>{t(s.description)}</p>}
                </div>
                {s.price !== undefined && (
                  <span className="price">{s.priceFrom && `${t(UI.from)} `}{price(s.price)}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {site.gallery.length > 0 && (
          <section id="galerija" className="section">
            <h2>{t(UI.gallery)}</h2>
            <div className="gallery">
              {site.gallery.map((g) => (
                // Plain <img> keeps the site exportable as static HTML for any host.
                <img key={g.src} src={g.src} alt={t(g.alt)} loading="lazy" width={800} height={600} />
              ))}
            </div>
          </section>
        )}

        <section id="kontakt" className="section grid-2">
          <div>
            <h2>{t(UI.hours)}</h2>
            <table className="hours">
              <tbody>
                {DAYS.map((d) => (
                  <tr key={d}>
                    <th scope="row">{t(DAY_NAMES_SR[d])}</th>
                    <td>{site.hours[d] ? site.hours[d]!.join("–") : t(UI.closedDay)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2>{t(UI.findUs)}</h2>
            <address>
              {t(address.street)}<br />
              {address.postalCode} {t(address.city)}<br />
              <a href={tel}>{contact.phoneDisplay}</a><br />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </address>
            <a className="link" href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}>
              {t(UI.openMaps)} →
            </a>
          </div>

          <div>
            <h2>{t(UI.writeUs)}</h2>
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
        <p>© {new Date().getFullYear()} {t(site.name)} · {t(fullAddress)}</p>
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
