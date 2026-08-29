import { NextResponse } from 'next/server';
import { EMPLOYER_VERIFICATION_QUEUE } from '@/data/mockData';

// POST /api/verify - Triangulate or process employer verification actions
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, itemId, identifier, type } = body;

    // Sub-Action 1: Registry Lookup Query (EPFO / Udyam / NAPS)
    if (action === 'lookup') {
      if (type === 'uan') {
        return NextResponse.json({
          success: true,
          status: 'ACTIVE_VERIFIED',
          identifier: `${identifier || '100984128912'} (Universal Account Number)`,
          establishmentName: 'Tata Motors Passenger Vehicles Ltd',
          establishmentId: 'MH/PUN/0014298/000',
          lastContributionMonth: 'January 2026',
          wageBracket: '₹30,000 - ₹35,000 / month',
          tenureMonths: '22 Months Continuous',
          trustScore: 98,
          dpdpHash: `SHA256-${Date.now()}`,
          triangulationSignal: 'POSITIVE_FORMAL_EMPLOYMENT'
        });
      }

      if (type === 'udyam') {
        return NextResponse.json({
          success: true,
          status: 'ACTIVE_VERIFIED',
          identifier: `${identifier || 'UDYAM-MH-23-0089124'} (Ministry of MSME)`,
          establishmentName: 'M/s Jadhav Solar & Electrical Services',
          establishmentId: 'UDYAM-MH-23-0089124',
          lastContributionMonth: 'GST Returns Filed Q3 2025',
          wageBracket: 'Micro Enterprise (₹2.5L - ₹5L Annual Turnover)',
          tenureMonths: '18 Months Active',
          trustScore: 94,
          dpdpHash: `SHA256-${Date.now()}`,
          triangulationSignal: 'POSITIVE_SELF_EMPLOYMENT'
        });
      }

      return NextResponse.json({
        success: true,
        status: 'ACTIVE_VERIFIED',
        identifier: `${identifier || 'NAPS-MH-2024-998'} (NAPS Registry)`,
        establishmentName: 'Mahindra & Mahindra Ltd',
        establishmentId: 'NAPS-CONTRACT-MH-2024-998',
        lastContributionMonth: 'Dec 2025 DBT Stipend Credited',
        wageBracket: '₹14,000 / month',
        tenureMonths: '11 Months Active',
        trustScore: 96,
        dpdpHash: `SHA256-${Date.now()}`,
        triangulationSignal: 'POSITIVE_APPRENTICESHIP'
      });
    }

    // Sub-Action 2: Employer Confirm / Dispute Action
    if (action === 'confirm' || action === 'dispute') {
      const match = EMPLOYER_VERIFICATION_QUEUE.find(item => item.id === itemId);
      return NextResponse.json({
        success: true,
        itemId,
        newStatus: action === 'confirm' ? 'Verified' : 'Disputed',
        triangulationMatchScore: action === 'confirm' ? 100 : 40,
        remarks: action === 'confirm' 
          ? 'Verified by HR Manager via Skill Sync Employer Gateway.' 
          : 'Discrepancy reported: Candidate is not on active payroll.'
      });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/verify - Fetch pending verification queue
export async function GET() {
  return NextResponse.json({
    success: true,
    totalPending: EMPLOYER_VERIFICATION_QUEUE.filter(q => q.verificationStatus === 'Pending').length,
    queue: EMPLOYER_VERIFICATION_QUEUE
  });
}
