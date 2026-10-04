'use client';

import { useState } from 'react';
import { mapsEmbed, mapsLink, site } from '@/lib/site';
import { Icon } from './Icon';

/** Click-to-load map: no Google requests (or cookies) until the visitor asks for it. */
export default function MapEmbed() {
  const [load, setLoad] = useState(false);
  return (
    <div className="map">
      {load ? (
        <iframe title={`Map to ${site.name}`} src={mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="map-ph">
          <Icon name="pin" />
          <p>
            <b>{site.address.street}</b>
            <br />
            {site.address.locality}, Kenya
          </p>
          <div className="btns center" style={{ marginTop: 0 }}>
            <button className="btn btn-solid btn-sm" type="button" onClick={() => setLoad(true)}>
              Show map
            </button>
            <a className="btn btn-line btn-sm" href={mapsLink} target="_blank" rel="noopener">
              Directions <Icon name="arrow" />
            </a>
          </div>
          <small>Loading the map connects to Google Maps.</small>
        </div>
      )}
    </div>
  );
}
