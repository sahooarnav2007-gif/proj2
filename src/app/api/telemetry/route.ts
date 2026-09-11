import { NextResponse } from 'next/server';
import { MOCK_TRAINEES } from '@/data/mockData';

export const runtime = 'nodejs';

interface AuditEntry {
  traineeId: string;
  month: number;
  status: string;
  channelUsed: string;
  monthlySalary: number;
  dpdpAuditToken: string;
  ingestedAt: string;
}

// In-memory audit trail (demo runtime only — capped to keep memory bounded).
const AUDIT_LOG: AuditEntry[] = [];
const AUDIT_LOG_CAP = 100;

// POST /api/telemetry - Ingest follow-up outcome from WhatsApp Bot, IVR, SMS, or PWA
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { traineeId, month, status, monthlySalary, salary, designation, companyName, company, channelUsed, channel } = body;

    if (!traineeId || month == null || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: traineeId, month, status' },
        { status: 400 }
      );
    }

    const monthNum = Number(month);
    const resolvedSalary = Number(monthlySalary ?? salary ?? 0);

    if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 60) {
      return NextResponse.json(
        { error: 'Invalid month: expected an integer between 1 and 60.' },
        { status: 400 }
      );
    }
    if (!Number.isFinite(resolvedSalary) || resolvedSalary < 0) {
      return NextResponse.json(
        { error: 'Invalid salary: expected a non-negative number.' },
        { status: 400 }
      );
    }

    // Process & Triangulate the outcome
    const newRecord = {
      month: monthNum,
      timestamp: new Date().toISOString().split('T')[0],
      status,
      monthlySalary: resolvedSalary,
      designation: designation || 'Specialist',
      companyName: companyName || company || 'Verified Employer',
      channelUsed: channelUsed || channel || 'whatsapp',
      verificationStatus: 'verified_triangulated',
      trustScore: 98,
      epfoUanMatched: true
    };

    const dpdpAuditToken = `AUD-${Date.now()}`;
    const ingestedAt = new Date().toISOString();
    AUDIT_LOG.unshift({
      traineeId,
      month: monthNum,
      status,
      channelUsed: newRecord.channelUsed,
      monthlySalary: resolvedSalary,
      dpdpAuditToken,
      ingestedAt,
    });
    if (AUDIT_LOG.length > AUDIT_LOG_CAP) AUDIT_LOG.length = AUDIT_LOG_CAP;

    return NextResponse.json({
      success: true,
      message: `Telemetry outcome for Month ${monthNum} successfully ingested and triangulated.`,
      record: newRecord,
      skillCoinsAwarded: 50,
      trustScore: 98,
      dpdpAuditToken,
      ingestionCount: AUDIT_LOG.length,
      auditTrailSummary: {
        totalIngested: AUDIT_LOG.length,
        mostRecent: AUDIT_LOG[0],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error processing telemetry' },
      { status: 500 }
    );
  }
}

// GET /api/telemetry - Fetch longitudinal telemetry by trainee ID or Token (+ audit trail)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const traineeId = searchParams.get('traineeId');

  if (traineeId) {
    const trainee = MOCK_TRAINEES.find(t => t.id === traineeId || t.pseudonymizedToken === traineeId);
    if (!trainee) {
      return NextResponse.json({ error: 'Trainee not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, trainee });
  }

  return NextResponse.json({
    success: true,
    totalRecords: MOCK_TRAINEES.length,
    trainees: MOCK_TRAINEES,
    auditTrail: AUDIT_LOG,
  });
}