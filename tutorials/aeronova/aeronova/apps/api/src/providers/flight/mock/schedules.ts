import type { CabinClass } from '@aeronova/shared';
import type { FareSetId } from './fares.js';

/*
 * Curated demo schedule. Carrier names are real public reference data; flight
 * numbers, times and fares are illustrative and are labelled as demo data in
 * every response. Each template becomes offers for any requested date on the
 * weekdays it operates, so results are deterministic and repeatable.
 */

export interface SegmentSpec {
  readonly carrier: string;
  readonly number: string;
  readonly from: string;
  readonly to: string;
  readonly blockMinutes: number;
  readonly aircraft?: string;
  readonly operatedBy?: string;
  readonly departureTerminal?: string;
  readonly arrivalTerminal?: string;
  /** Ground time before the next segment departs. */
  readonly connectionMinutes?: number;
  readonly technicalStop?: { readonly airport: string; readonly minutes: number };
}

export interface ScheduleTemplate {
  readonly id: string;
  /** Local departure time of the first segment, HH:mm. */
  readonly departs: string;
  readonly segments: readonly SegmentSpec[];
  readonly validatingCarrier: string | null;
  readonly fareSet: FareSetId;
  /** Lowest economy base fare, whole USD, for one adult one way. */
  readonly baseFareUsd: number;
  readonly carrierSurchargeUsd: number;
  readonly cabins: readonly CabinClass[];
  /** 0 = Sunday. Omitted = daily. */
  readonly operatesOn?: readonly number[];
  /** Separate tickets; the traveller re-checks bags. */
  readonly selfTransfer?: boolean;
}

const ALL_CABINS: readonly CabinClass[] = ['economy', 'premium_economy', 'business', 'first'];
const NO_FIRST: readonly CabinClass[] = ['economy', 'premium_economy', 'business'];
const ECO_BIZ: readonly CabinClass[] = ['economy', 'business'];
const ECO: readonly CabinClass[] = ['economy'];

const seg = (
  carrier: string,
  number: string,
  from: string,
  to: string,
  blockMinutes: number,
  extra: Partial<SegmentSpec> = {},
): SegmentSpec => ({ carrier, number, from, to, blockMinutes, ...extra });

const OUTBOUND: readonly ScheduleTemplate[] = [
  // Dhaka → Dubai
  {
    id: 'ek-dac-dxb-am',
    departs: '10:30',
    segments: [seg('EK', '587', 'DAC', 'DXB', 330, { aircraft: '77W', arrivalTerminal: '3' })],
    validatingCarrier: 'EK',
    fareSet: 'full_service',
    baseFareUsd: 310,
    carrierSurchargeUsd: 55,
    cabins: ALL_CABINS,
  },
  {
    id: 'fz-dac-dxb-night',
    departs: '00:50',
    segments: [seg('FZ', '582', 'DAC', 'DXB', 335, { aircraft: '7M8', arrivalTerminal: '2' })],
    validatingCarrier: 'FZ',
    fareSet: 'low_cost',
    baseFareUsd: 205,
    carrierSurchargeUsd: 0,
    cabins: ECO_BIZ,
  },
  {
    id: 'bg-dac-dxb',
    departs: '13:15',
    segments: [seg('BG', '347', 'DAC', 'DXB', 340, { aircraft: '788' })],
    validatingCarrier: 'BG',
    fareSet: 'weight_concept',
    baseFareUsd: 262,
    carrierSurchargeUsd: 30,
    cabins: ECO_BIZ,
    operatesOn: [0, 1, 3, 5],
  },
  {
    id: 'bs-dac-dxb',
    departs: '20:10',
    segments: [seg('BS', '341', 'DAC', 'DXB', 340, { aircraft: '333' })],
    validatingCarrier: 'BS',
    fareSet: 'weight_concept',
    baseFareUsd: 238,
    carrierSurchargeUsd: 25,
    cabins: ECO_BIZ,
  },
  {
    id: 'qr-dac-dxb-via-doh',
    departs: '03:15',
    segments: [
      seg('QR', '639', 'DAC', 'DOH', 345, { aircraft: '359', connectionMinutes: 100 }),
      seg('QR', '1002', 'DOH', 'DXB', 70, { aircraft: '320' }),
    ],
    validatingCarrier: 'QR',
    fareSet: 'full_service',
    baseFareUsd: 288,
    carrierSurchargeUsd: 60,
    cabins: NO_FIRST,
  },

  // Dhaka → London
  {
    id: 'bg-dac-lhr',
    departs: '09:40',
    segments: [seg('BG', '201', 'DAC', 'LHR', 650, { aircraft: '788', arrivalTerminal: '2' })],
    validatingCarrier: 'BG',
    fareSet: 'weight_concept',
    baseFareUsd: 690,
    carrierSurchargeUsd: 60,
    cabins: ECO_BIZ,
    operatesOn: [2, 4, 6],
  },
  {
    id: 'ek-dac-lhr-via-dxb',
    departs: '22:05',
    segments: [
      seg('EK', '583', 'DAC', 'DXB', 330, { aircraft: '77W', arrivalTerminal: '3', connectionMinutes: 185 }),
      seg('EK', '5', 'DXB', 'LHR', 460, { aircraft: '388', departureTerminal: '3', arrivalTerminal: '3' }),
    ],
    validatingCarrier: 'EK',
    fareSet: 'full_service',
    baseFareUsd: 720,
    carrierSurchargeUsd: 140,
    cabins: ALL_CABINS,
  },
  {
    id: 'qr-dac-lhr-via-doh',
    departs: '19:40',
    segments: [
      seg('QR', '637', 'DAC', 'DOH', 345, { aircraft: '359', connectionMinutes: 150 }),
      seg('QR', '3', 'DOH', 'LHR', 440, { aircraft: '35K' }),
    ],
    validatingCarrier: 'QR',
    fareSet: 'full_service',
    baseFareUsd: 745,
    carrierSurchargeUsd: 150,
    cabins: ALL_CABINS,
  },
  {
    id: 'tk-dac-lhr-via-ist',
    departs: '07:25',
    segments: [
      seg('TK', '713', 'DAC', 'IST', 540, { aircraft: '333', connectionMinutes: 170 }),
      seg('TK', '1971', 'IST', 'LHR', 245, { aircraft: '321', arrivalTerminal: '2' }),
    ],
    validatingCarrier: 'TK',
    fareSet: 'full_service',
    baseFareUsd: 655,
    carrierSurchargeUsd: 110,
    cabins: NO_FIRST,
  },
  {
    id: 'selfxfer-dac-lhr-via-del',
    departs: '13:55',
    segments: [
      seg('6E', '1102', 'DAC', 'DEL', 165, { aircraft: '32N', connectionMinutes: 420 }),
      seg('VS', '301', 'DEL', 'LHR', 585, { aircraft: '789', arrivalTerminal: '3' }),
    ],
    validatingCarrier: null,
    fareSet: 'low_cost',
    baseFareUsd: 540,
    carrierSurchargeUsd: 0,
    cabins: ECO,
    selfTransfer: true,
  },

  // Dhaka → Singapore
  {
    id: 'sq-dac-sin',
    departs: '23:30',
    segments: [seg('SQ', '447', 'DAC', 'SIN', 250, { aircraft: '359', arrivalTerminal: '3' })],
    validatingCarrier: 'SQ',
    fareSet: 'full_service',
    baseFareUsd: 330,
    carrierSurchargeUsd: 45,
    cabins: NO_FIRST,
  },
  {
    id: 'bg-dac-sin',
    departs: '12:30',
    segments: [seg('BG', '584', 'DAC', 'SIN', 255, { aircraft: '738' })],
    validatingCarrier: 'BG',
    fareSet: 'weight_concept',
    baseFareUsd: 280,
    carrierSurchargeUsd: 20,
    cabins: ECO_BIZ,
    operatesOn: [1, 4, 6],
  },
  {
    id: 'mh-dac-sin-via-kul',
    departs: '00:05',
    segments: [
      seg('MH', '103', 'DAC', 'KUL', 230, { aircraft: '738', arrivalTerminal: '1', connectionMinutes: 95 }),
      seg('MH', '603', 'KUL', 'SIN', 60, { aircraft: '738' }),
    ],
    validatingCarrier: 'MH',
    fareSet: 'full_service',
    baseFareUsd: 265,
    carrierSurchargeUsd: 35,
    cabins: ECO_BIZ,
  },
  {
    id: 'ak-dac-sin-via-kul',
    departs: '23:55',
    segments: [
      seg('AK', '71', 'DAC', 'KUL', 240, { aircraft: '320', arrivalTerminal: '2', connectionMinutes: 160 }),
      seg('AK', '713', 'KUL', 'SIN', 65, { aircraft: '320', departureTerminal: '2' }),
    ],
    validatingCarrier: 'AK',
    fareSet: 'low_cost',
    baseFareUsd: 168,
    carrierSurchargeUsd: 0,
    cabins: ECO,
  },

  // Dhaka → Kuala Lumpur
  {
    id: 'mh-dac-kul',
    departs: '00:05',
    segments: [seg('MH', '103', 'DAC', 'KUL', 230, { aircraft: '738', arrivalTerminal: '1' })],
    validatingCarrier: 'MH',
    fareSet: 'full_service',
    baseFareUsd: 238,
    carrierSurchargeUsd: 35,
    cabins: ECO_BIZ,
  },
  {
    id: 'ak-dac-kul',
    departs: '23:55',
    segments: [seg('AK', '71', 'DAC', 'KUL', 240, { aircraft: '320', arrivalTerminal: '2' })],
    validatingCarrier: 'AK',
    fareSet: 'low_cost',
    baseFareUsd: 142,
    carrierSurchargeUsd: 0,
    cabins: ECO,
  },
  {
    id: 'bs-dac-kul',
    departs: '12:10',
    segments: [seg('BS', '316', 'DAC', 'KUL', 245, { aircraft: '738' })],
    validatingCarrier: 'BS',
    fareSet: 'weight_concept',
    baseFareUsd: 205,
    carrierSurchargeUsd: 20,
    cabins: ECO_BIZ,
  },

  // Dhaka → Bangkok (BKK city includes DMK)
  {
    id: 'tg-dac-bkk',
    departs: '12:20',
    segments: [seg('TG', '322', 'DAC', 'BKK', 150, { aircraft: '359' })],
    validatingCarrier: 'TG',
    fareSet: 'full_service',
    baseFareUsd: 210,
    carrierSurchargeUsd: 30,
    cabins: NO_FIRST,
  },
  {
    id: 'bg-dac-bkk',
    departs: '13:30',
    segments: [seg('BG', '388', 'DAC', 'BKK', 150, { aircraft: '738' })],
    validatingCarrier: 'BG',
    fareSet: 'weight_concept',
    baseFareUsd: 185,
    carrierSurchargeUsd: 15,
    cabins: ECO_BIZ,
  },
  {
    id: 'bs-dac-bkk-night',
    departs: '23:10',
    segments: [seg('BS', '218', 'DAC', 'BKK', 145, { aircraft: '738' })],
    validatingCarrier: 'BS',
    fareSet: 'weight_concept',
    baseFareUsd: 168,
    carrierSurchargeUsd: 15,
    cabins: ECO,
  },
  {
    id: 'fd-dac-dmk',
    departs: '15:05',
    segments: [seg('FD', '297', 'DAC', 'DMK', 150)],
    validatingCarrier: 'FD',
    fareSet: 'undisclosed',
    baseFareUsd: 118,
    carrierSurchargeUsd: 0,
    cabins: ECO,
  },

  // Dhaka → Delhi
  {
    id: '6e-dac-del',
    departs: '13:55',
    segments: [seg('6E', '1102', 'DAC', 'DEL', 165, { aircraft: '32N', arrivalTerminal: '3' })],
    validatingCarrier: '6E',
    fareSet: 'low_cost',
    baseFareUsd: 132,
    carrierSurchargeUsd: 0,
    cabins: ECO,
  },
  {
    id: 'ai-dac-del',
    departs: '11:20',
    segments: [seg('AI', '237', 'DAC', 'DEL', 170, { aircraft: '32N', arrivalTerminal: '3' })],
    validatingCarrier: 'AI',
    fareSet: 'full_service',
    baseFareUsd: 158,
    carrierSurchargeUsd: 20,
    cabins: ECO_BIZ,
  },
  {
    id: '6e-dac-del-via-ccu',
    departs: '08:05',
    segments: [
      seg('6E', '1164', 'DAC', 'CCU', 55, { aircraft: '32N', connectionMinutes: 65 }),
      seg('6E', '2143', 'CCU', 'DEL', 140, { aircraft: '321' }),
    ],
    validatingCarrier: '6E',
    fareSet: 'low_cost',
    baseFareUsd: 108,
    carrierSurchargeUsd: 0,
    cabins: ECO,
  },

  // Dhaka → Kuala Lumpur, one flight number with a technical stop (not a connection)
  {
    id: 'bg-dac-kul-tech-cgp',
    departs: '06:45',
    segments: [
      seg('BG', '088', 'DAC', 'KUL', 330, {
        aircraft: '738',
        technicalStop: { airport: 'CGP', minutes: 50 },
      }),
    ],
    validatingCarrier: 'BG',
    fareSet: 'weight_concept',
    baseFareUsd: 176,
    carrierSurchargeUsd: 15,
    cabins: ECO,
    operatesOn: [1, 4],
  },

  // Dhaka → Doha
  {
    id: 'qr-dac-doh-night',
    departs: '03:15',
    segments: [seg('QR', '639', 'DAC', 'DOH', 345, { aircraft: '359' })],
    validatingCarrier: 'QR',
    fareSet: 'full_service',
    baseFareUsd: 282,
    carrierSurchargeUsd: 60,
    cabins: NO_FIRST,
  },
  {
    id: 'qr-dac-doh-eve',
    departs: '19:40',
    segments: [seg('QR', '637', 'DAC', 'DOH', 345, { aircraft: '359' })],
    validatingCarrier: 'QR',
    fareSet: 'full_service',
    baseFareUsd: 305,
    carrierSurchargeUsd: 60,
    cabins: NO_FIRST,
  },

  // Dubai → London
  {
    id: 'ek-dxb-lhr-am',
    departs: '07:45',
    segments: [
      seg('EK', '1', 'DXB', 'LHR', 460, { aircraft: '388', departureTerminal: '3', arrivalTerminal: '3' }),
    ],
    validatingCarrier: 'EK',
    fareSet: 'full_service',
    baseFareUsd: 520,
    carrierSurchargeUsd: 120,
    cabins: ALL_CABINS,
  },
  {
    id: 'ek-dxb-lhr-pm',
    departs: '14:30',
    segments: [
      seg('EK', '5', 'DXB', 'LHR', 460, { aircraft: '388', departureTerminal: '3', arrivalTerminal: '3' }),
    ],
    validatingCarrier: 'EK',
    fareSet: 'full_service',
    baseFareUsd: 540,
    carrierSurchargeUsd: 120,
    cabins: ALL_CABINS,
  },
  {
    id: 'ba-dxb-lhr',
    departs: '09:25',
    segments: [
      seg('BA', '106', 'DXB', 'LHR', 470, { aircraft: '77W', departureTerminal: '1', arrivalTerminal: '5' }),
    ],
    validatingCarrier: 'BA',
    fareSet: 'full_service',
    baseFareUsd: 505,
    carrierSurchargeUsd: 160,
    cabins: ALL_CABINS,
  },
  {
    id: 'vs-dxb-lhr',
    departs: '13:45',
    segments: [seg('VS', '401', 'DXB', 'LHR', 470, { aircraft: '35K', arrivalTerminal: '3' })],
    validatingCarrier: 'VS',
    fareSet: 'full_service',
    baseFareUsd: 495,
    carrierSurchargeUsd: 150,
    cabins: NO_FIRST,
  },
  {
    id: 'qr-dxb-lhr-via-doh',
    departs: '06:10',
    segments: [
      seg('QR', '1001', 'DXB', 'DOH', 70, { aircraft: '320', connectionMinutes: 90 }),
      seg('QR', '7', 'DOH', 'LHR', 440, { aircraft: '35K' }),
    ],
    validatingCarrier: 'QR',
    fareSet: 'full_service',
    baseFareUsd: 410,
    carrierSurchargeUsd: 110,
    cabins: NO_FIRST,
  },

  // Paris → New York
  {
    id: 'af-cdg-jfk-am',
    departs: '10:30',
    segments: [
      seg('AF', '22', 'CDG', 'JFK', 505, { aircraft: '359', departureTerminal: '2E', arrivalTerminal: '1' }),
    ],
    validatingCarrier: 'AF',
    fareSet: 'full_service',
    baseFareUsd: 610,
    carrierSurchargeUsd: 170,
    cabins: ALL_CABINS,
  },
  {
    id: 'af-cdg-jfk-pm',
    departs: '16:55',
    segments: [
      seg('AF', '6', 'CDG', 'JFK', 500, { aircraft: '77W', departureTerminal: '2E', arrivalTerminal: '1' }),
    ],
    validatingCarrier: 'AF',
    fareSet: 'full_service',
    baseFareUsd: 640,
    carrierSurchargeUsd: 170,
    cabins: ALL_CABINS,
  },
  {
    id: 'dl-cdg-jfk',
    departs: '13:25',
    segments: [seg('DL', '263', 'CDG', 'JFK', 510, { aircraft: '333', arrivalTerminal: '4' })],
    validatingCarrier: 'DL',
    fareSet: 'full_service',
    baseFareUsd: 590,
    carrierSurchargeUsd: 160,
    cabins: NO_FIRST,
  },
  {
    id: 'ua-cdg-ewr',
    departs: '10:30',
    segments: [
      seg('UA', '57', 'CDG', 'EWR', 505, { aircraft: '789', departureTerminal: '1', arrivalTerminal: 'C' }),
    ],
    validatingCarrier: 'UA',
    fareSet: 'full_service',
    baseFareUsd: 575,
    carrierSurchargeUsd: 150,
    cabins: NO_FIRST,
  },
  {
    id: 'selfxfer-cdg-lhr-lgw-jfk',
    departs: '07:10',
    segments: [
      seg('AF', '1080', 'CDG', 'LHR', 80, { aircraft: '321', arrivalTerminal: '4', connectionMinutes: 300 }),
      seg('B6', '20', 'LGW', 'JFK', 480, { aircraft: '321', departureTerminal: 'S', arrivalTerminal: '5' }),
    ],
    validatingCarrier: null,
    fareSet: 'low_cost',
    baseFareUsd: 415,
    carrierSurchargeUsd: 0,
    cabins: ECO,
    selfTransfer: true,
  },

  // London → New York
  {
    id: 'ba-lhr-jfk-am',
    departs: '08:25',
    segments: [
      seg('BA', '117', 'LHR', 'JFK', 480, { aircraft: '35K', departureTerminal: '5', arrivalTerminal: '8' }),
    ],
    validatingCarrier: 'BA',
    fareSet: 'full_service',
    baseFareUsd: 640,
    carrierSurchargeUsd: 190,
    cabins: ALL_CABINS,
  },
  {
    id: 'ba-lhr-jfk-pm',
    departs: '18:00',
    segments: [
      seg('BA', '115', 'LHR', 'JFK', 480, { aircraft: '77W', departureTerminal: '5', arrivalTerminal: '8' }),
    ],
    validatingCarrier: 'BA',
    fareSet: 'full_service',
    baseFareUsd: 610,
    carrierSurchargeUsd: 190,
    cabins: ALL_CABINS,
  },
  {
    id: 'vs-lhr-jfk',
    departs: '09:15',
    segments: [
      seg('VS', '3', 'LHR', 'JFK', 485, { aircraft: '35K', departureTerminal: '3', arrivalTerminal: '4' }),
    ],
    validatingCarrier: 'VS',
    fareSet: 'full_service',
    baseFareUsd: 598,
    carrierSurchargeUsd: 175,
    cabins: NO_FIRST,
  },
  {
    id: 'aa-lhr-jfk',
    departs: '11:40',
    segments: [
      seg('AA', '101', 'LHR', 'JFK', 490, {
        aircraft: '77W',
        departureTerminal: '3',
        arrivalTerminal: '8',
        operatedBy: 'BA',
      }),
    ],
    validatingCarrier: 'AA',
    fareSet: 'full_service',
    baseFareUsd: 585,
    carrierSurchargeUsd: 180,
    cabins: NO_FIRST,
  },
  {
    id: 'ua-lhr-ewr',
    departs: '12:20',
    segments: [
      seg('UA', '17', 'LHR', 'EWR', 495, { aircraft: '789', departureTerminal: '2', arrivalTerminal: 'C' }),
    ],
    validatingCarrier: 'UA',
    fareSet: 'full_service',
    baseFareUsd: 560,
    carrierSurchargeUsd: 165,
    cabins: NO_FIRST,
  },

  // Frankfurt → San Francisco
  {
    id: 'lh-fra-sfo',
    departs: '10:05',
    segments: [
      seg('LH', '454', 'FRA', 'SFO', 690, { aircraft: '748', departureTerminal: '1', arrivalTerminal: 'I' }),
    ],
    validatingCarrier: 'LH',
    fareSet: 'full_service',
    baseFareUsd: 720,
    carrierSurchargeUsd: 200,
    cabins: ALL_CABINS,
  },
  {
    id: 'ua-fra-sfo',
    departs: '12:15',
    segments: [
      seg('UA', '927', 'FRA', 'SFO', 700, { aircraft: '789', departureTerminal: '1', arrivalTerminal: 'I' }),
    ],
    validatingCarrier: 'UA',
    fareSet: 'full_service',
    baseFareUsd: 695,
    carrierSurchargeUsd: 180,
    cabins: NO_FIRST,
  },
  {
    id: 'lh-fra-sfo-via-muc',
    departs: '08:30',
    segments: [
      seg('LH', '100', 'FRA', 'MUC', 55, {
        aircraft: '32N',
        departureTerminal: '1',
        arrivalTerminal: '2',
        connectionMinutes: 55,
      }),
      seg('LH', '458', 'MUC', 'SFO', 705, { aircraft: '359', departureTerminal: '2', arrivalTerminal: 'I' }),
    ],
    validatingCarrier: 'LH',
    fareSet: 'full_service',
    baseFareUsd: 640,
    carrierSurchargeUsd: 200,
    cabins: NO_FIRST,
  },

  // Singapore → Sydney
  {
    id: 'sq-sin-syd-am',
    departs: '08:35',
    segments: [
      seg('SQ', '211', 'SIN', 'SYD', 465, { aircraft: '359', departureTerminal: '3', arrivalTerminal: '1' }),
    ],
    validatingCarrier: 'SQ',
    fareSet: 'full_service',
    baseFareUsd: 540,
    carrierSurchargeUsd: 90,
    cabins: NO_FIRST,
  },
  {
    id: 'qf-sin-syd',
    departs: '16:15',
    segments: [
      seg('QF', '2', 'SIN', 'SYD', 465, { aircraft: '388', departureTerminal: '1', arrivalTerminal: '1' }),
    ],
    validatingCarrier: 'QF',
    fareSet: 'full_service',
    baseFareUsd: 565,
    carrierSurchargeUsd: 95,
    cabins: ALL_CABINS,
  },
  {
    id: 'sq-sin-syd-night',
    departs: '23:55',
    segments: [
      seg('SQ', '221', 'SIN', 'SYD', 460, { aircraft: '388', departureTerminal: '3', arrivalTerminal: '1' }),
    ],
    validatingCarrier: 'SQ',
    fareSet: 'full_service',
    baseFareUsd: 505,
    carrierSurchargeUsd: 90,
    cabins: ALL_CABINS,
  },
];

/**
 * Builds the opposite direction of a template: segments reversed, flight
 * numbers +1 (the usual convention), and a new local departure time.
 */
const reverse = (t: ScheduleTemplate, departs: string, blockDeltaMinutes = 0): ScheduleTemplate => {
  const segments = [...t.segments].reverse();
  return {
    ...t,
    id: `${t.id}~ret`,
    departs,
    segments: segments.map((s, i) => {
      const next = segments[i + 1];
      const { connectionMinutes: _drop, ...rest } = s;
      const n = Number(s.number);
      return {
        ...rest,
        number: Number.isFinite(n) ? String(n + 1) : s.number,
        from: s.to,
        to: s.from,
        blockMinutes: s.blockMinutes + blockDeltaMinutes,
        ...(s.arrivalTerminal ? { departureTerminal: s.arrivalTerminal } : {}),
        ...(s.departureTerminal ? { arrivalTerminal: s.departureTerminal } : {}),
        ...(next?.connectionMinutes !== undefined ? { connectionMinutes: next.connectionMinutes } : {}),
      };
    }),
    ...(t.operatesOn ? { operatesOn: t.operatesOn.map((d) => (d + 1) % 7) } : {}),
  };
};

const RETURN_TIMES: Readonly<Record<string, readonly [string, number?]>> = {
  'ek-dac-dxb-am': ['03:05'],
  'fz-dac-dxb-night': ['17:20'],
  'bg-dac-dxb': ['20:45'],
  'bs-dac-dxb': ['12:40'],
  'qr-dac-dxb-via-doh': ['10:15'],
  'bg-dac-lhr': ['13:55', -35],
  'ek-dac-lhr-via-dxb': ['20:30', -20],
  'qr-dac-lhr-via-doh': ['16:05', -25],
  'tk-dac-lhr-via-ist': ['11:45', -25],
  'selfxfer-dac-lhr-via-del': ['20:50', -40],
  'sq-dac-sin': ['18:45'],
  'bg-dac-sin': ['17:40'],
  'mh-dac-sin-via-kul': ['15:20'],
  'ak-dac-sin-via-kul': ['16:35'],
  'mh-dac-kul': ['19:35'],
  'ak-dac-kul': ['20:40'],
  'bs-dac-kul': ['17:25'],
  'bg-dac-kul-tech-cgp': ['14:20'],
  'tg-dac-bkk': ['09:40'],
  'bg-dac-bkk': ['17:10'],
  'bs-dac-bkk-night': ['09:30'],
  'fd-dac-dmk': ['12:05'],
  '6e-dac-del': ['09:15'],
  'ai-dac-del': ['07:10'],
  '6e-dac-del-via-ccu': ['14:30'],
  'qr-dac-doh-night': ['20:20'],
  'qr-dac-doh-eve': ['07:25'],
  'ek-dxb-lhr-am': ['20:40', -25],
  'ek-dxb-lhr-pm': ['09:45', -25],
  'ba-dxb-lhr': ['21:55', -30],
  'vs-dxb-lhr': ['20:15', -30],
  'qr-dxb-lhr-via-doh': ['08:05', -20],
  'af-cdg-jfk-am': ['17:30', -60],
  'af-cdg-jfk-pm': ['22:45', -70],
  'dl-cdg-jfk': ['18:15', -65],
  'ua-cdg-ewr': ['17:55', -60],
  'selfxfer-cdg-lhr-lgw-jfk': ['19:40', -55],
  'ba-lhr-jfk-am': ['18:30', -65],
  'ba-lhr-jfk-pm': ['22:25', -75],
  'vs-lhr-jfk': ['19:20', -60],
  'aa-lhr-jfk': ['20:05', -65],
  'ua-lhr-ewr': ['17:40', -60],
  'lh-fra-sfo': ['15:10', -20],
  'ua-fra-sfo': ['17:05', -20],
  'lh-fra-sfo-via-muc': ['16:20', -20],
  'sq-sin-syd-am': ['09:50', 25],
  'qf-sin-syd': ['12:15', 25],
  'sq-sin-syd-night': ['16:30', 25],
};

export const SCHEDULE: readonly ScheduleTemplate[] = [
  ...OUTBOUND,
  ...OUTBOUND.flatMap((t) => {
    const r = RETURN_TIMES[t.id];
    return r ? [reverse(t, r[0], r[1] ?? 0)] : [];
  }),
];
