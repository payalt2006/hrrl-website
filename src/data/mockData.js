// src/data/mockData.js
// Mock data for HRRL AI SAP Authorization Portal

export const mockUsers = [
  {
    id: 'EMP001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@hpcl.in',
    department: 'Procurement',
    role: 'employee',
    password: 'demo123',
    avatar: 'RK',
  },
  {
    id: 'MGR001',
    name: 'Priya Sharma',
    email: 'priya.sharma@hpcl.in',
    department: 'Finance',
    role: 'manager',
    password: 'demo123',
    avatar: 'PS',
  },
  {
    id: 'ADM001',
    name: 'Vikram Patel',
    email: 'vikram.patel@hpcl.in',
    department: 'IT',
    role: 'sap_admin',
    password: 'demo123',
    avatar: 'VP',
  },
  {
    id: 'AUD001',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@hpcl.in',
    department: 'Compliance',
    role: 'auditor',
    password: 'demo123',
    avatar: 'SI',
  },
];

export const mockRequests = [
  {
    id: 'REQ-2026-001',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    department: 'Procurement',
    tcode: 'ME21N',
    tcodeDesc: 'Create Purchase Order',
    sapSystem: 'PRD',
    description: 'Unable to create purchase orders in PRD system. Getting authorization failure on object M_BEST_BSA.',
    priority: 'High',
    status: 'pending_approval',
    risk: 'LOW',
    submittedAt: '2026-06-24T10:30:00',
    updatedAt: '2026-06-24T14:15:00',
    aiAnalysis: {
      object: 'M_BEST_BSA',
      field: 'ACTVT',
      missingValue: '01',
      businessMeaning: 'Create Purchase Orders in MM module',
      risk: 'LOW',
      recommendedRole: 'Z_MM_PURCHASE_CREATE',
      shouldGrant: 'Yes',
      remarks: 'Standard business access for procurement users. Route to MM Lead for approval.',
    },
    approvalHistory: [
      { step: 'Submitted', by: 'Rajesh Kumar', at: '2026-06-24T10:30:00', status: 'completed' },
      { step: 'Manager Review', by: 'Priya Sharma', at: '2026-06-24T14:15:00', status: 'in_progress' },
      { step: 'SAP Admin', by: null, at: null, status: 'pending' },
      { step: 'Implementation', by: null, at: null, status: 'pending' },
    ],
  },
  {
    id: 'REQ-2026-002',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    department: 'Procurement',
    tcode: 'MIRO',
    tcodeDesc: 'Invoice Verification',
    sapSystem: 'PRD',
    description: 'Need access to verify invoices in MIRO for vendor payments processing.',
    priority: 'Medium',
    status: 'approved',
    risk: 'MEDIUM',
    submittedAt: '2026-06-20T09:00:00',
    updatedAt: '2026-06-22T16:45:00',
    aiAnalysis: {
      object: 'M_RECH_BSA',
      field: 'ACTVT',
      missingValue: '02',
      businessMeaning: 'Invoice verification and posting in MM/FI module',
      risk: 'MEDIUM',
      recommendedRole: 'Z_MM_INVOICE_VERIFY',
      shouldGrant: 'Conditional',
      remarks: 'Medium risk — check for SoD conflict with payment execution. Restrict to company code 1000.',
    },
    approvalHistory: [
      { step: 'Submitted', by: 'Rajesh Kumar', at: '2026-06-20T09:00:00', status: 'completed' },
      { step: 'Manager Review', by: 'Priya Sharma', at: '2026-06-21T11:30:00', status: 'completed', comment: 'Approved — required for Q2 vendor settlements.' },
      { step: 'SAP Admin', by: 'Vikram Patel', at: '2026-06-22T16:45:00', status: 'completed', comment: 'Role assigned with company code restriction.' },
      { step: 'Implementation', by: 'System', at: '2026-06-22T16:50:00', status: 'completed' },
    ],
  },
  {
    id: 'REQ-2026-003',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    department: 'Procurement',
    tcode: 'MIGO',
    tcodeDesc: 'Goods Movement',
    sapSystem: 'QAS',
    description: 'Testing goods receipt process in QAS. Need MIGO authorization for movement type 101.',
    priority: 'Low',
    status: 'open',
    risk: 'LOW',
    submittedAt: '2026-06-26T08:45:00',
    updatedAt: '2026-06-26T08:45:00',
    aiAnalysis: null,
    approvalHistory: [
      { step: 'Submitted', by: 'Rajesh Kumar', at: '2026-06-26T08:45:00', status: 'completed' },
      { step: 'Manager Review', by: null, at: null, status: 'pending' },
      { step: 'SAP Admin', by: null, at: null, status: 'pending' },
      { step: 'Implementation', by: null, at: null, status: 'pending' },
    ],
  },
  {
    id: 'REQ-2026-004',
    employeeId: 'MGR001',
    employeeName: 'Priya Sharma',
    department: 'Finance',
    tcode: 'FB60',
    tcodeDesc: 'Enter Vendor Invoice',
    sapSystem: 'PRD',
    description: 'Authorization failure when posting vendor invoices through FB60. Object F_BKPF_BUK missing.',
    priority: 'Critical',
    status: 'pending_approval',
    risk: 'HIGH',
    submittedAt: '2026-06-25T14:20:00',
    updatedAt: '2026-06-25T15:00:00',
    aiAnalysis: {
      object: 'F_BKPF_BUK',
      field: 'BUKRS',
      missingValue: '1000',
      businessMeaning: 'Post financial documents with company code authorization',
      risk: 'HIGH',
      recommendedRole: 'Z_FI_VENDOR_INVOICE',
      shouldGrant: 'Conditional',
      remarks: 'HIGH RISK — This grants posting capability. Verify no SoD conflict with payment run (F110). Requires dual approval.',
    },
    approvalHistory: [
      { step: 'Submitted', by: 'Priya Sharma', at: '2026-06-25T14:20:00', status: 'completed' },
      { step: 'Manager Review', by: null, at: null, status: 'in_progress' },
      { step: 'SAP Admin', by: null, at: null, status: 'pending' },
      { step: 'Implementation', by: null, at: null, status: 'pending' },
    ],
  },
  {
    id: 'REQ-2026-005',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    department: 'Procurement',
    tcode: 'SE16N',
    tcodeDesc: 'General Table Display',
    sapSystem: 'PRD',
    description: 'Require SE16N access to view EKKO and EKPO tables for purchase order audit trail.',
    priority: 'Medium',
    status: 'rejected',
    risk: 'HIGH',
    submittedAt: '2026-06-18T11:00:00',
    updatedAt: '2026-06-19T10:30:00',
    aiAnalysis: {
      object: 'S_TABU_DIS',
      field: 'ACTVT',
      missingValue: '03',
      businessMeaning: 'Direct table access — bypasses application-level security',
      risk: 'HIGH',
      recommendedRole: 'Z_BASIS_TABLE_VIEW',
      shouldGrant: 'No',
      remarks: 'HIGH RISK — SE16N provides unrestricted table access. Recommend using ME2M or custom report instead.',
    },
    approvalHistory: [
      { step: 'Submitted', by: 'Rajesh Kumar', at: '2026-06-18T11:00:00', status: 'completed' },
      { step: 'Manager Review', by: 'Priya Sharma', at: '2026-06-19T10:30:00', status: 'completed', comment: 'Rejected — Use standard MM reports instead of direct table access.' },
      { step: 'SAP Admin', by: null, at: null, status: 'skipped' },
      { step: 'Implementation', by: null, at: null, status: 'skipped' },
    ],
  },
  {
    id: 'REQ-2026-006',
    employeeId: 'ADM001',
    employeeName: 'Vikram Patel',
    department: 'IT',
    tcode: 'SU01',
    tcodeDesc: 'User Maintenance',
    sapSystem: 'PRD',
    description: 'Need SU01 access to manage user accounts and role assignments in production.',
    priority: 'High',
    status: 'approved',
    risk: 'HIGH',
    submittedAt: '2026-06-15T09:30:00',
    updatedAt: '2026-06-17T14:00:00',
    aiAnalysis: {
      object: 'S_USER_GRP',
      field: 'ACTVT',
      missingValue: '02',
      businessMeaning: 'User administration — create, modify, lock/unlock users',
      risk: 'HIGH',
      recommendedRole: 'Z_BASIS_USER_ADMIN',
      shouldGrant: 'Yes',
      remarks: 'Required for SAP Basis admin duties. Restrict to specific user groups. Enable enhanced logging.',
    },
    approvalHistory: [
      { step: 'Submitted', by: 'Vikram Patel', at: '2026-06-15T09:30:00', status: 'completed' },
      { step: 'Manager Review', by: 'IT Head', at: '2026-06-16T10:00:00', status: 'completed', comment: 'Approved — essential for admin role.' },
      { step: 'SAP Admin', by: 'Security Lead', at: '2026-06-17T14:00:00', status: 'completed', comment: 'Assigned with user group restriction UGR_IT only.' },
      { step: 'Implementation', by: 'System', at: '2026-06-17T14:05:00', status: 'completed' },
    ],
  },
  {
    id: 'REQ-2026-007',
    employeeId: 'MGR001',
    employeeName: 'Priya Sharma',
    department: 'Finance',
    tcode: 'SM37',
    tcodeDesc: 'Background Job Overview',
    sapSystem: 'PRD',
    description: 'Need to monitor background jobs for month-end financial postings in SM37.',
    priority: 'Low',
    status: 'closed',
    risk: 'LOW',
    submittedAt: '2026-06-10T08:00:00',
    updatedAt: '2026-06-12T16:30:00',
    aiAnalysis: {
      object: 'S_BTCH_JOB',
      field: 'JOBACTION',
      missingValue: 'LIST',
      businessMeaning: 'View/monitor background job execution status',
      risk: 'LOW',
      recommendedRole: 'Z_BASIS_JOB_MONITOR',
      shouldGrant: 'Yes',
      remarks: 'Read-only job monitoring. Low risk. Standard access for power users.',
    },
    approvalHistory: [
      { step: 'Submitted', by: 'Priya Sharma', at: '2026-06-10T08:00:00', status: 'completed' },
      { step: 'Manager Review', by: 'Finance Head', at: '2026-06-11T09:00:00', status: 'completed', comment: 'Approved.' },
      { step: 'SAP Admin', by: 'Vikram Patel', at: '2026-06-12T14:00:00', status: 'completed', comment: 'Role assigned.' },
      { step: 'Implementation', by: 'System', at: '2026-06-12T16:30:00', status: 'completed' },
    ],
  },
  {
    id: 'REQ-2026-008',
    employeeId: 'ADM001',
    employeeName: 'Vikram Patel',
    department: 'IT',
    tcode: 'PFCG',
    tcodeDesc: 'Role Maintenance',
    sapSystem: 'DEV',
    description: 'Require PFCG access in DEV system for developing new custom roles for HRRL project.',
    priority: 'Medium',
    status: 'pending_approval',
    risk: 'MEDIUM',
    submittedAt: '2026-06-25T16:00:00',
    updatedAt: '2026-06-26T09:00:00',
    aiAnalysis: {
      object: 'S_USER_AGR',
      field: 'ACTVT',
      missingValue: '01',
      businessMeaning: 'Role creation and maintenance in authorization management',
      risk: 'MEDIUM',
      recommendedRole: 'Z_BASIS_ROLE_DEV',
      shouldGrant: 'Yes',
      remarks: 'DEV system only — acceptable risk. Ensure transport controls are in place before promoting to QAS/PRD.',
    },
    approvalHistory: [
      { step: 'Submitted', by: 'Vikram Patel', at: '2026-06-25T16:00:00', status: 'completed' },
      { step: 'Manager Review', by: null, at: null, status: 'in_progress' },
      { step: 'SAP Admin', by: null, at: null, status: 'pending' },
      { step: 'Implementation', by: null, at: null, status: 'pending' },
    ],
  },
];

export const mockNotifications = [
  {
    id: 'NOT-001',
    type: 'approved',
    title: 'Request Approved',
    message: 'Your request REQ-2026-002 (MIRO) has been approved and implemented.',
    link: '/my-requests',
    read: false,
    timestamp: '2026-06-22T16:50:00',
  },
  {
    id: 'NOT-002',
    type: 'rejected',
    title: 'Request Rejected',
    message: 'Your request REQ-2026-005 (SE16N) was rejected. Use standard MM reports instead.',
    link: '/my-requests',
    read: false,
    timestamp: '2026-06-19T10:30:00',
  },
  {
    id: 'NOT-003',
    type: 'pending',
    title: 'Awaiting Your Approval',
    message: 'Rajesh Kumar (EMP001) has requested ME21N access in PRD. Please review.',
    link: '/approvals',
    read: false,
    timestamp: '2026-06-24T10:35:00',
  },
  {
    id: 'NOT-004',
    type: 'robot',
    title: 'UiPath Robot Completed',
    message: 'SU53 analysis robot completed processing 24 authorization failures.',
    link: '/admin',
    read: true,
    timestamp: '2026-06-23T18:00:00',
  },
  {
    id: 'NOT-005',
    type: 'sod',
    title: 'SoD Conflict Detected',
    message: 'User EMP001 has conflicting access: FB60 (Invoice Entry) + F110 (Payment Run).',
    link: '/audit',
    read: false,
    timestamp: '2026-06-25T12:00:00',
  },
  {
    id: 'NOT-006',
    type: 'approved',
    title: 'Request Approved',
    message: 'Your request REQ-2026-006 (SU01) has been approved with restrictions.',
    link: '/my-requests',
    read: true,
    timestamp: '2026-06-17T14:05:00',
  },
];

export const mockRobotExecutions = [
  {
    id: 'RBT-001',
    name: 'SU53 Export Analyzer',
    status: 'Completed',
    startedAt: '2026-06-23T17:30:00',
    completedAt: '2026-06-23T18:00:00',
    duration: '30 min',
    recordsProcessed: 24,
    triggeredBy: 'Vikram Patel',
  },
  {
    id: 'RBT-002',
    name: 'Role Assignment Validator',
    status: 'Running',
    startedAt: '2026-06-26T09:00:00',
    completedAt: null,
    duration: null,
    recordsProcessed: 12,
    triggeredBy: 'System (Scheduled)',
  },
  {
    id: 'RBT-003',
    name: 'SoD Conflict Scanner',
    status: 'Completed',
    startedAt: '2026-06-25T06:00:00',
    completedAt: '2026-06-25T06:45:00',
    duration: '45 min',
    recordsProcessed: 156,
    triggeredBy: 'System (Scheduled)',
  },
  {
    id: 'RBT-004',
    name: 'User Access Review Export',
    status: 'Failed',
    startedAt: '2026-06-24T22:00:00',
    completedAt: '2026-06-24T22:05:00',
    duration: '5 min',
    recordsProcessed: 0,
    triggeredBy: 'System (Scheduled)',
    error: 'SAP connection timeout — RFC destination SM_PRD_001 unreachable.',
  },
];

export const mockSodAlerts = [
  {
    id: 'SOD-001',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    department: 'Procurement',
    conflict: 'FB60 + F110',
    description: 'Invoice Entry (FB60) combined with Payment Run (F110) — allows user to create and pay invoices.',
    risk: 'HIGH',
    detectedAt: '2026-06-25T12:00:00',
    status: 'open',
  },
  {
    id: 'SOD-002',
    employeeId: 'EMP001',
    employeeName: 'Rajesh Kumar',
    department: 'Procurement',
    conflict: 'ME21N + MIRO',
    description: 'Purchase Order Creation (ME21N) combined with Invoice Verification (MIRO) — procure-to-pay conflict.',
    risk: 'MEDIUM',
    detectedAt: '2026-06-22T16:55:00',
    status: 'under_review',
  },
  {
    id: 'SOD-003',
    employeeId: 'MGR001',
    employeeName: 'Priya Sharma',
    department: 'Finance',
    conflict: 'FB60 + FK01',
    description: 'Vendor Invoice Posting (FB60) combined with Vendor Master Create (FK01) — fraud risk.',
    risk: 'HIGH',
    detectedAt: '2026-06-20T08:00:00',
    status: 'mitigated',
  },
  {
    id: 'SOD-004',
    employeeId: 'ADM001',
    employeeName: 'Vikram Patel',
    department: 'IT',
    conflict: 'SU01 + PFCG',
    description: 'User Administration (SU01) combined with Role Maintenance (PFCG) — can create users and assign unlimited access.',
    risk: 'HIGH',
    detectedAt: '2026-06-18T14:30:00',
    status: 'accepted',
  },
  {
    id: 'SOD-005',
    employeeId: 'EMP002',
    employeeName: 'Anita Desai',
    department: 'Operations',
    conflict: 'MIGO + MB1A',
    description: 'Goods Receipt (MIGO) combined with Goods Issue (MB1A) — inventory manipulation risk.',
    risk: 'MEDIUM',
    detectedAt: '2026-06-24T10:00:00',
    status: 'open',
  },
];

export const mockAccessHistory = [
  { employeeId: 'EMP001', name: 'Rajesh Kumar', role: 'Z_MM_PURCHASE_CREATE', tcode: 'ME21N', assignedAt: '2026-03-15', status: 'Active' },
  { employeeId: 'EMP001', name: 'Rajesh Kumar', role: 'Z_MM_INVOICE_VERIFY', tcode: 'MIRO', assignedAt: '2026-06-22', status: 'Active' },
  { employeeId: 'MGR001', name: 'Priya Sharma', role: 'Z_FI_AP_POSTING', tcode: 'FB60', assignedAt: '2026-01-10', status: 'Active' },
  { employeeId: 'MGR001', name: 'Priya Sharma', role: 'Z_BASIS_JOB_MONITOR', tcode: 'SM37', assignedAt: '2026-06-12', status: 'Active' },
  { employeeId: 'ADM001', name: 'Vikram Patel', role: 'Z_BASIS_USER_ADMIN', tcode: 'SU01', assignedAt: '2026-06-17', status: 'Active' },
  { employeeId: 'ADM001', name: 'Vikram Patel', role: 'SAP_ALL', tcode: '*', assignedAt: '2025-11-01', status: 'Revoked' },
];

export const mockPortalUsers = [
  { id: 'EMP001', name: 'Rajesh Kumar', email: 'rajesh.kumar@hpcl.in', department: 'Procurement', role: 'employee', status: 'Active', lastLogin: '2026-06-26T08:45:00' },
  { id: 'EMP002', name: 'Anita Desai', email: 'anita.desai@hpcl.in', department: 'Operations', role: 'employee', status: 'Active', lastLogin: '2026-06-25T14:00:00' },
  { id: 'MGR001', name: 'Priya Sharma', email: 'priya.sharma@hpcl.in', department: 'Finance', role: 'manager', status: 'Active', lastLogin: '2026-06-26T09:15:00' },
  { id: 'MGR002', name: 'Amit Verma', email: 'amit.verma@hpcl.in', department: 'HR', role: 'manager', status: 'Inactive', lastLogin: '2026-06-10T11:00:00' },
  { id: 'ADM001', name: 'Vikram Patel', email: 'vikram.patel@hpcl.in', department: 'IT', role: 'sap_admin', status: 'Active', lastLogin: '2026-06-26T07:30:00' },
  { id: 'AUD001', name: 'Sneha Iyer', email: 'sneha.iyer@hpcl.in', department: 'Compliance', role: 'auditor', status: 'Active', lastLogin: '2026-06-24T16:00:00' },
];

export const departments = ['Finance', 'HR', 'Procurement', 'Operations', 'IT'];

export const defaultAISystemPrompt = `You are an SAP Authorization Expert AI Assistant for HPCL HRRL (Hindustan Petroleum Corporation Limited — Rajasthan Refinery Limited).

Your role:
- Analyze SAP SU53 authorization failure traces
- Identify missing authorization objects, fields, and values
- Recommend appropriate SAP roles to resolve access issues
- Assess risk levels (LOW / MEDIUM / HIGH) for each authorization request
- Flag potential Segregation of Duties (SoD) conflicts
- Provide audit-ready remarks and justifications

Guidelines:
- Always recommend the LEAST PRIVILEGE approach
- Flag SE16N, SA38, SU01, PFCG as HIGH risk T-Codes
- Check for SoD conflicts when granting financial authorizations
- Consider company code restrictions for financial access
- Recommend custom Z-roles over SAP standard roles
- Include business process context in your analysis`;

// Chart data
export const requestVolumeData = [
  { month: 'Jan', requests: 42 },
  { month: 'Feb', requests: 38 },
  { month: 'Mar', requests: 55 },
  { month: 'Apr', requests: 47 },
  { month: 'May', requests: 63 },
  { month: 'Jun', requests: 51 },
];

export const topTCodesData = [
  { tcode: 'ME21N', count: 28 },
  { tcode: 'FB60', count: 24 },
  { tcode: 'MIRO', count: 22 },
  { tcode: 'MIGO', count: 18 },
  { tcode: 'VA01', count: 15 },
  { tcode: 'SU01', count: 14 },
  { tcode: 'SE16N', count: 12 },
  { tcode: 'SM37', count: 10 },
  { tcode: 'PFCG', count: 8 },
  { tcode: 'SE38', count: 6 },
];

export const riskSummaryData = [
  { name: 'Low Risk', value: 180, fill: '#16A34A' }, // success
  { name: 'Medium Risk', value: 85, fill: '#D97706' }, // warning
  { name: 'High Risk', value: 31, fill: '#DC2626' }, // danger
];

export const resolutionTimeData = [
  { department: 'Finance', avgDays: 4.2 },
  { department: 'HR', avgDays: 2.1 },
  { department: 'IT', avgDays: 1.8 },
  { department: 'Operations', avgDays: 3.5 },
  { department: 'Procurement', avgDays: 2.8 },
];

export const deptRequestsData = [
  { name: 'Finance', value: 120, fill: '#2563EB' },
  { name: 'Operations', value: 80, fill: '#16A34A' },
  { name: 'Procurement', value: 50, fill: '#D97706' },
  { name: 'HR', value: 30, fill: '#DC2626' },
  { name: 'IT', value: 16, fill: '#94A3B8' }, // text-muted
];

export const mockExecutionLogs = [
  { timestamp: '2026-06-26T09:15:32', level: 'INFO', message: 'Role Assignment Validator started — processing 156 users' },
  { timestamp: '2026-06-26T09:15:33', level: 'INFO', message: 'Connected to SAP PRD via RFC destination SM_PRD_001' },
  { timestamp: '2026-06-26T09:16:01', level: 'WARN', message: 'User EMP045 has 12 composite roles — exceeds threshold of 10' },
  { timestamp: '2026-06-26T09:16:15', level: 'ERROR', message: 'Failed to read role Z_LEGACY_FI_01 — role does not exist in PRD' },
  { timestamp: '2026-06-26T09:16:45', level: 'INFO', message: 'Processed 50/156 users — 2 SoD conflicts detected' },
  { timestamp: '2026-06-26T09:17:20', level: 'WARN', message: 'User MGR012 has SAP_ALL profile assigned — critical finding' },
  { timestamp: '2026-06-26T09:18:00', level: 'INFO', message: 'Processed 100/156 users — 4 SoD conflicts detected' },
  { timestamp: '2026-06-26T09:19:12', level: 'INFO', message: 'Processed 156/156 users — scan complete. 5 SoD conflicts, 3 warnings.' },
];

export const mockRoleAssignments = [
  { role: 'Z_FI_AP_MANAGER', description: 'Accounts Payable Manager', userCount: 12, lastReviewed: '2026-06-15T10:00:00Z', owner: 'John Doe' },
  { role: 'Z_MM_PO_CREATOR', description: 'Purchase Order Creator', userCount: 45, lastReviewed: '2026-06-10T10:00:00Z', owner: 'Jane Smith' },
  { role: 'Z_HR_ADMIN', description: 'HR Administrator', userCount: 8, lastReviewed: '2026-05-20T10:00:00Z', owner: 'Mike Johnson' },
];



