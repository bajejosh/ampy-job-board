import { Job, JobNote } from "@/lib/types";

export const sampleJobs: Job[] = [
  { id: "job-001", customer: "Miller Family Home", suburb: "Richmond", jobType: "Electrical inspection", status: "new", value: 485, createdAt: "2026-10-24T08:30:00.000Z" },
  { id: "job-002", customer: "Olivia Hart", suburb: "Fitzroy", jobType: "Switchboard upgrade", status: "scheduled", value: 1820, createdAt: "2026-10-23T13:15:00.000Z" },
  { id: "job-003", customer: "Northside Bakery", suburb: "Brunswick", jobType: "Commercial lighting", status: "in_progress", value: 2740, createdAt: "2026-10-22T09:00:00.000Z" },
  { id: "job-004", customer: "James & Co", suburb: "Collingwood", jobType: "Power point installation", status: "completed", value: 690, createdAt: "2026-10-21T16:45:00.000Z" },
  { id: "job-005", customer: "Harper Street Clinic", suburb: "Prahran", jobType: "Safety compliance check", status: "scheduled", value: 950, createdAt: "2026-10-21T11:30:00.000Z" },
  { id: "job-006", customer: "Daniel Nguyen", suburb: "Richmond", jobType: "EV charger install", status: "new", value: 2480, createdAt: "2026-10-20T10:20:00.000Z" },
  { id: "job-007", customer: "Easton Property Group", suburb: "South Yarra", jobType: "Smoke alarm replacement", status: "completed", value: 760, createdAt: "2026-10-19T14:10:00.000Z" },
  { id: "job-008", customer: "Sofia Romano", suburb: "Abbotsford", jobType: "Outdoor power and lighting", status: "in_progress", value: 1380, createdAt: "2026-10-18T08:10:00.000Z" },
  { id: "job-009", customer: "Wattle & Vine Cafe", suburb: "Hawthorn", jobType: "Appliance circuit", status: "scheduled", value: 1120, createdAt: "2026-10-17T12:40:00.000Z" },
  { id: "job-010", customer: "Mia Thompson", suburb: "Kew", jobType: "Ceiling fan installation", status: "completed", value: 540, createdAt: "2026-10-16T15:05:00.000Z" },
  { id: "job-011", customer: "Parkview Apartments", suburb: "Southbank", jobType: "Emergency callout", status: "new", value: 320, createdAt: "2026-10-15T18:20:00.000Z" },
  { id: "job-012", customer: "Liam Wilson", suburb: "Carlton", jobType: "Recessed lighting", status: "in_progress", value: 1660, createdAt: "2026-10-14T09:35:00.000Z" },
  { id: "job-013", customer: "Bayside Montessori", suburb: "Port Melbourne", jobType: "Electrical maintenance", status: "scheduled", value: 2040, createdAt: "2026-10-13T10:50:00.000Z" },
  { id: "job-014", customer: "Chloe Bennett", suburb: "Malvern", jobType: "Home rewiring consult", status: "new", value: 360, createdAt: "2026-10-12T11:25:00.000Z" },
  { id: "job-015", customer: "The Garden Room", suburb: "Hampton", jobType: "Garden studio wiring", status: "in_progress", value: 3250, createdAt: "2026-10-11T07:55:00.000Z" },
  { id: "job-016", customer: "Lucas Martin", suburb: "Glen Iris", jobType: "Data cabling", status: "completed", value: 880, createdAt: "2026-10-10T13:40:00.000Z" },
  { id: "job-017", customer: "Beacon Legal", suburb: "Melbourne CBD", jobType: "Office fit-out", status: "scheduled", value: 4160, createdAt: "2026-10-09T08:45:00.000Z" },
  { id: "job-018", customer: "Ava Patel", suburb: "Coburg", jobType: "Hot water connection", status: "completed", value: 730, createdAt: "2026-10-08T16:10:00.000Z" },
  { id: "job-019", customer: "Cedar Lane Retail", suburb: "Yarraville", jobType: "Security lighting", status: "new", value: 1290, createdAt: "2026-10-07T09:15:00.000Z" },
  { id: "job-020", customer: "Ethan Brooks", suburb: "Footscray", jobType: "Renovation rough-in", status: "in_progress", value: 2950, createdAt: "2026-10-06T10:05:00.000Z" },
];

export const sampleNotes: JobNote[] = [
  { id: "note-001", jobId: "job-003", content: "Site access confirmed with Priya for Thursday morning.", createdAt: "2026-10-23T07:30:00.000Z" },
  { id: "note-002", jobId: "job-003", content: "Waiting on the final fixture count before ordering materials.", createdAt: "2026-10-24T06:15:00.000Z" },
  { id: "note-003", jobId: "job-008", content: "Customer prefers the garden lights on a separate timer.", createdAt: "2026-10-20T04:40:00.000Z" },
];
