/*
 * Hand-built from the Duffel API v2 reference (offer-requests, offers) in
 * September 2026. NOT captured from Duffel: field names and shapes follow the
 * documentation; values are invented. Re-check against a real test-mode
 * response when credentials are available (docs/PROVIDERS.md).
 */
const place = (iata: string, tz: string, name: string, city: string) => ({
  type: 'airport',
  id: `arp_${iata.toLowerCase()}`,
  iata_code: iata,
  time_zone: tz,
  name,
  city_name: city,
  iata_country_code: 'XX',
});

const LHR = place('LHR', 'Europe/London', 'Heathrow', 'London');
const JFK = place('JFK', 'America/New_York', 'John F. Kennedy International Airport', 'New York');
const BOS = place('BOS', 'America/New_York', 'Logan International Airport', 'Boston');
const LGA = place('LGA', 'America/New_York', 'LaGuardia Airport', 'New York');
const KEF = place('KEF', 'Atlantic/Reykjavik', 'Keflavik International Airport', 'Reykjavik');

const ZZ = { id: 'arl_zz', iata_code: 'ZZ', name: 'Duffel Airways' };
const BA = { id: 'arl_ba', iata_code: 'BA', name: 'British Airways' };
const AA = { id: 'arl_aa', iata_code: 'AA', name: 'American Airlines' };

const pax = (cabin: string, bags: { type: string; quantity: number }[] | null) => [
  { passenger_id: 'pas_1', cabin_class: cabin, cabin_class_marketing_name: 'Economy', baggages: bags },
];

const base = {
  live_mode: false,
  created_at: '2026-09-16T10:00:00Z',
  updated_at: '2026-09-16T10:00:00Z',
  owner: ZZ,
  passengers: [{ id: 'pas_1', type: 'adult' }],
  total_emissions_kg: '460',
};

export const directOffer = {
  ...base,
  id: 'off_direct',
  expires_at: '2026-09-16T10:30:00Z',
  total_amount: '250.00',
  total_currency: 'GBP',
  base_amount: '200.00',
  base_currency: 'GBP',
  tax_amount: '40.00',
  tax_currency: 'GBP',
  conditions: {
    refund_before_departure: { allowed: false, penalty_amount: null, penalty_currency: null },
    change_before_departure: { allowed: true, penalty_amount: '50.00', penalty_currency: 'GBP' },
  },
  slices: [
    {
      id: 'sli_1',
      duration: 'PT8H00M',
      fare_brand_name: 'Basic',
      origin: LHR,
      destination: JFK,
      segments: [
        {
          id: 'seg_1',
          departing_at: '2026-12-20T08:30:00',
          arriving_at: '2026-12-20T11:30:00',
          duration: 'PT08H00M',
          origin: LHR,
          destination: JFK,
          origin_terminal: '5',
          destination_terminal: null,
          marketing_carrier: ZZ,
          marketing_carrier_flight_number: '117',
          operating_carrier: ZZ,
          operating_carrier_flight_number: '117',
          aircraft: { id: 'arc_1', iata_code: '789', name: 'Boeing 787-9' },
          stops: [],
          passengers: pax('economy', [
            { type: 'carry_on', quantity: 1 },
            { type: 'checked', quantity: 0 },
          ]),
        },
      ],
    },
  ],
};

/** Codeshare with an airport change (arrive BOS, depart LGA), refund fee unknown, free changes. */
export const connectingOffer = {
  ...base,
  id: 'off_connecting',
  owner: BA,
  expires_at: '2026-09-16T10:20:00Z',
  total_amount: '199.99',
  total_currency: 'GBP',
  base_amount: '150.00',
  base_currency: 'GBP',
  tax_amount: '49.99',
  tax_currency: 'GBP',
  conditions: {
    refund_before_departure: { allowed: true, penalty_amount: null, penalty_currency: null },
    change_before_departure: { allowed: true, penalty_amount: '0.00', penalty_currency: 'GBP' },
  },
  slices: [
    {
      id: 'sli_2',
      duration: 'P0DT11H05M',
      fare_brand_name: null,
      origin: LHR,
      destination: JFK,
      segments: [
        {
          id: 'seg_2a',
          departing_at: '2026-12-20T09:00:00',
          arriving_at: '2026-12-20T11:40:00',
          duration: 'PT7H40M',
          origin: LHR,
          destination: BOS,
          origin_terminal: '5',
          destination_terminal: 'E',
          marketing_carrier: BA,
          marketing_carrier_flight_number: '203',
          operating_carrier: AA,
          operating_carrier_flight_number: '6203',
          aircraft: null,
          stops: [],
          passengers: pax('economy', [{ type: 'checked', quantity: 1 }]),
        },
        {
          id: 'seg_2b',
          departing_at: '2026-12-20T13:55:00',
          arriving_at: '2026-12-20T15:05:00',
          duration: null,
          origin: LGA,
          destination: JFK,
          origin_terminal: null,
          destination_terminal: '8',
          marketing_carrier: BA,
          marketing_carrier_flight_number: '4411',
          operating_carrier: null,
          operating_carrier_flight_number: null,
          aircraft: { id: 'arc_2', iata_code: null, name: 'Embraer 175' },
          stops: [],
          passengers: pax('economy', [{ type: 'checked', quantity: 2 }]),
        },
      ],
    },
  ],
};

/** One flight number with a technical stop; no tax split; baggage not stated. */
export const technicalStopOffer = {
  ...base,
  id: 'off_techstop',
  expires_at: '2026-09-16T10:40:00Z',
  total_amount: '310.50',
  total_currency: 'GBP',
  base_amount: null,
  base_currency: null,
  tax_amount: null,
  tax_currency: null,
  conditions: null,
  slices: [
    {
      id: 'sli_3',
      duration: 'PT10H00M',
      fare_brand_name: 'Comfort',
      origin: LHR,
      destination: JFK,
      segments: [
        {
          id: 'seg_3',
          departing_at: '2026-12-20T07:00:00',
          arriving_at: '2026-12-20T12:00:00',
          duration: 'PT10H00M',
          origin: LHR,
          destination: JFK,
          origin_terminal: null,
          destination_terminal: null,
          marketing_carrier: ZZ,
          marketing_carrier_flight_number: '9',
          operating_carrier: ZZ,
          operating_carrier_flight_number: '9',
          aircraft: null,
          stops: [
            {
              id: 'sto_1',
              duration: 'PT1H15M',
              departing_at: '2026-12-20T09:45:00',
              arriving_at: '2026-12-20T08:30:00',
              airport: KEF,
            },
          ],
          passengers: pax('economy', null),
        },
      ],
    },
  ],
};

export const unsupportedCurrencyOffer = {
  ...directOffer,
  id: 'off_chf',
  total_currency: 'CHF',
  base_currency: 'CHF',
  tax_currency: 'CHF',
};
export const otherCurrencyOffer = {
  ...directOffer,
  id: 'off_eur',
  total_currency: 'EUR',
  base_currency: 'EUR',
  tax_currency: 'EUR',
};
export const malformedOffer = { ...directOffer, id: 'off_bad', slices: [] };

export const offerRequestResponse = {
  data: {
    id: 'orq_test',
    live_mode: false,
    created_at: '2026-09-16T10:00:00Z',
    cabin_class: 'economy',
    slices: [],
    passengers: [{ id: 'pas_1', type: 'adult' }],
    offers: [
      directOffer,
      connectingOffer,
      technicalStopOffer,
      unsupportedCurrencyOffer,
      otherCurrencyOffer,
      malformedOffer,
    ],
  },
};

export const offerNoLongerAvailable = {
  meta: { status: 422, request_id: 'req_duffel_1' },
  errors: [
    {
      type: 'airline_error',
      title: 'Offer no longer available',
      message: 'The offer has expired or has already been booked.',
      code: 'offer_no_longer_available',
    },
  ],
};
