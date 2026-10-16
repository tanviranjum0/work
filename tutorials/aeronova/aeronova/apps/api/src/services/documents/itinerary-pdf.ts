import PDFDocument from 'pdfkit';
import { formatMoney, type Booking, type FlightSegment } from '@aeronova/shared';

/*
 * Renders a booking's itinerary as a PDF, built entirely from the booking's
 * own immutable snapshot (packages/shared/src/domain/booking.ts:
 * BookingSnapshot) — never from a live provider call. A booking made a year
 * ago must render exactly as it did the day it was made, even if the
 * supplier's current offer for that route looks nothing like it any more.
 *
 * Deliberately left out of the document, even though the booking record
 * itself holds it: passport/travel-document numbers and date of birth. This
 * is a downloadable, shareable, potentially long-lived artifact, and the
 * product already avoids storing that data anywhere it doesn't strictly
 * need to (SavedTraveler has never carried it); the PDF holding it too would
 * be the widest, least controlled surface for it to leak from.
 *
 * pdfkit resolves its own bundled resources (standard font metrics, an ICC
 * colour profile) by path relative to its own package location, so it is
 * excluded from the esbuild bundle (see scripts/build.mjs) and required
 * normally from node_modules at runtime.
 */

const COLOR = {
  fg: '#0E1A2B',
  muted: '#4F5F77',
  border: '#CDD5E0',
  course: '#A8238C',
  warning: '#8A5A00',
  warningBg: '#FBF1DD',
} as const;

const PAGE_MARGIN = 50;

/** "2026-12-20T09:40" -> "09:40" / "Tue, 20 Dec 2026". No timezone conversion: the string is already the airport's own local wall time. */
const wallTime = (local: string): string => local.slice(11, 16);
const wallDate = (local: string): string => {
  const [y, m, d] = local.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y ?? 0, (m ?? 1) - 1, d ?? 1)).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${String(m).padStart(2, '0')}m`;
};

/** The product's course-line mark, drawn as vectors so no image asset ships with the API. */
const drawBrandMark = (doc: PDFKit.PDFDocument, x: number, y: number): void => {
  doc
    .save()
    .translate(x, y)
    .scale(0.85)
    .moveTo(6, 23)
    .bezierCurveTo(11, 12, 21, 9, 26, 9)
    .lineWidth(2.4)
    .strokeColor(COLOR.course)
    .lineCap('round')
    .stroke()
    .polygon([26, 5.5], [29.5, 9], [26, 12.5], [22.5, 9])
    .fillColor(COLOR.fg)
    .fill()
    .circle(6, 23, 2.6)
    .fillColor(COLOR.fg)
    .fill()
    .restore();
};

const sectionHeading = (doc: PDFKit.PDFDocument, text: string): void => {
  doc.moveDown(0.75).fontSize(12).fillColor(COLOR.fg).font('Helvetica-Bold').text(text);
  doc
    .moveTo(PAGE_MARGIN, doc.y + 4)
    .lineTo(doc.page.width - PAGE_MARGIN, doc.y + 4)
    .strokeColor(COLOR.border)
    .lineWidth(0.75)
    .stroke();
  doc.moveDown(0.6);
};

const renderSegment = (doc: PDFKit.PDFDocument, segment: FlightSegment): void => {
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor(COLOR.fg)
    .text(
      `${wallTime(segment.departure.local)}  ${segment.origin.iataCode}   ->   ${wallTime(segment.arrival.local)}  ${segment.destination.iataCode}`,
    );
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLOR.muted)
    .text(
      `${wallDate(segment.departure.local)} · ${segment.marketingCarrier.name} ${segment.marketingCarrier.code} ${segment.marketingFlightNumber} · ${formatDuration(segment.durationMinutes)}`,
    );
  doc.moveDown(0.5);
};

export const renderItineraryPdf = (booking: Booking): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: PAGE_MARGIN, compress: false });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    drawBrandMark(doc, PAGE_MARGIN, PAGE_MARGIN);
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor(COLOR.fg)
      .text('AeroNova', PAGE_MARGIN + 34, PAGE_MARGIN + 2);
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(COLOR.muted)
      .text('Flight discovery and booking technology demonstration', PAGE_MARGIN + 34, PAGE_MARGIN + 22);
    doc.moveDown(2.5);

    if (booking.simulated) {
      const boxY = doc.y;
      doc
        .rect(PAGE_MARGIN, boxY, doc.page.width - PAGE_MARGIN * 2, 26)
        .fillColor(COLOR.warningBg)
        .fill();
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor(COLOR.warning)
        .text('DEMO RESERVATION — NOT VALID FOR TRAVEL', PAGE_MARGIN + 10, boxY + 8);
      doc.y = boxY + 26;
      doc.moveDown(0.75);
    }

    doc.fontSize(9).font('Helvetica').fillColor(COLOR.muted).text('Booking reference');
    doc.fontSize(18).font('Helvetica-Bold').fillColor(COLOR.fg).text(booking.reference);

    sectionHeading(doc, 'Your trip');
    booking.snapshot.offer.journeys.forEach((journey, index) => {
      if (index > 0) doc.moveDown(0.4);
      journey.segments.forEach((segment, segIndex) => {
        renderSegment(doc, segment);
        const layover = journey.layovers.find((l) => l.afterSegmentId === segment.id);
        if (layover && segIndex < journey.segments.length - 1) {
          doc
            .fontSize(8.5)
            .font('Helvetica-Oblique')
            .fillColor(COLOR.muted)
            .text(`${formatDuration(layover.durationMinutes)} layover in ${layover.airport.iataCode}`);
          doc.moveDown(0.4);
        }
      });
    });

    sectionHeading(doc, 'Travellers');
    for (const passenger of booking.passengers) {
      const name = [
        passenger.title?.toUpperCase(),
        passenger.givenName,
        passenger.middleName,
        passenger.familyName,
      ]
        .filter(Boolean)
        .join(' ');
      doc.fontSize(10).font('Helvetica').fillColor(COLOR.fg).text(`${name}  ·  ${passenger.type}`);
    }

    sectionHeading(doc, 'Fare');
    const price = booking.snapshot.offer.price;
    const fareLine = (label: string, amount: string, bold = false): void => {
      const y = doc.y;
      doc
        .fontSize(10)
        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fillColor(COLOR.fg)
        .text(label, PAGE_MARGIN, y, { continued: false });
      doc
        .fontSize(10)
        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fillColor(COLOR.fg)
        .text(amount, PAGE_MARGIN, y, { align: 'right', width: doc.page.width - PAGE_MARGIN * 2 });
    };
    fareLine('Base fare', formatMoney(price.base));
    if (price.taxes.status === 'provided') fareLine('Taxes', formatMoney(price.taxes.value));
    for (const fee of price.fees) fareLine(fee.label, formatMoney(fee.amount));
    doc.moveDown(0.3);
    fareLine('Total', formatMoney(booking.total), true);
    if (booking.snapshot.offer.fareFamily.status === 'provided') {
      doc
        .moveDown(0.4)
        .fontSize(9)
        .font('Helvetica')
        .fillColor(COLOR.muted)
        .text(`Fare: ${booking.snapshot.offer.fareFamily.value}`);
    }

    sectionHeading(doc, 'Fare conditions');
    const condition = (label: string, c: typeof booking.snapshot.offer.conditions.refund): void => {
      const text =
        c.status !== 'provided'
          ? 'Not provided'
          : c.value.value === 'not_allowed'
            ? 'Not allowed'
            : c.value.value === 'allowed'
              ? 'Allowed, no fee'
              : c.value.value === 'allowed_with_fee'
                ? `Allowed${c.value.penalty.status === 'provided' ? ` (${formatMoney(c.value.penalty.value)} fee)` : ''}`
                : 'Allowed, fee not provided';
      doc.fontSize(9).font('Helvetica').fillColor(COLOR.fg).text(`${label}: ${text}`);
    };
    condition('Refund', booking.snapshot.offer.conditions.refund);
    condition('Change', booking.snapshot.offer.conditions.change);

    if (booking.tickets.length > 0) {
      sectionHeading(doc, 'Tickets');
      for (const ticket of booking.tickets) {
        doc.fontSize(10).font('Helvetica').fillColor(COLOR.fg).text(ticket.number);
        if (ticket.simulated) {
          doc
            .fontSize(8)
            .font('Helvetica-Bold')
            .fillColor(COLOR.warning)
            .text('DEMO TICKET — NOT VALID FOR TRAVEL');
        }
        doc.moveDown(0.25);
      }
    }

    // Flows after the content rather than pinning to a fixed page-bottom
    // coordinate: a long booking (many passengers, a multi-city itinerary)
    // can push past one page, and a fixed position would then collide with
    // whatever content is still printing instead of moving to the next page.
    doc.moveDown(1.5);
    doc
      .moveTo(PAGE_MARGIN, doc.y)
      .lineTo(doc.page.width - PAGE_MARGIN, doc.y)
      .strokeColor(COLOR.border)
      .lineWidth(0.75)
      .stroke();
    doc.moveDown(0.5);
    doc
      .fontSize(7.5)
      .font('Helvetica')
      .fillColor(COLOR.muted)
      .text(
        `AeroNova is a flight discovery and booking technology demonstration, not a licensed travel agency. Generated ${new Date().toISOString()} for booking ${booking.reference}.`,
        { width: doc.page.width - PAGE_MARGIN * 2 },
      );

    doc.end();
  });
