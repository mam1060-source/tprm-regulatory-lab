const form = document.querySelector('#review');
const actions = document.querySelector('#actions');
const plan = document.querySelector('#plan');

const finalGuidance = {
  label: '2023 final interagency TPRM guidance',
  url: 'https://www.occ.gov/news-issuances/bulletins/2023/bulletin-2023-17.html'
};
const occFramework = {
  label: 'OCC Super Intelligence framework',
  url: 'https://www.occ.gov/news-issuances/news-releases/2026/nr-occ-2026-97a.pdf'
};

const scenarios = {
  'synthetic:draft': {
    title: 'Isolated drafting pilot',
    planning: 'Approve a narrow test scope and name a business owner. Confirm the sandbox cannot reach production systems.',
    testing: 'Have staff compare drafts to synthetic source messages and log fabricated facts, omissions, and corrections. Retain scored examples before expanding scope.',
    monitoring: 'Review correction trends during the pilot. Suspend testing if production data appears or the vendor enables an unapproved capability.'
  },
  'synthetic:route': {
    title: 'Automated routing simulation',
    planning: 'Limit automated routing to a test queue. Set acceptable error and escalation thresholds before connecting to live operations.',
    testing: 'Replay rare and ambiguous cases. Collect false-routing results and demonstrate that staff can override routes, disable automation, and replay queued cases.',
    monitoring: 'Track misroutes and missed escalations in the test queue. Retest after routing rules or models change.'
  },
  'customer:draft': {
    title: 'Customer data with staff approval',
    planning: 'Map where customer correspondence travels and who can access it. Define the scope of staff review before any draft is used.',
    testing: 'Sample drafts against source messages for omissions, invented facts, and sensitive information leakage. Verify reviewers have time and authority to reject drafts.',
    monitoring: 'Track corrections and potential data exposure. Escalate recurring errors or material changes to the business and privacy owners.'
  },
  'customer:route': {
    title: 'Live automated customer routing',
    planning: 'Assess harm from delayed or missed cases, including time-sensitive complaints. Define which queues automation may touch and which cases require manual review.',
    testing: 'Require independent challenge before rollout. Test missed urgent cases, manipulated inputs, permission boundaries, manual overrides, and recovery of misrouted cases.',
    monitoring: 'Monitor urgent-case misses, queue delays, and drift against agreed thresholds. Assign authority to suspend automation, switch to manual triage, and review affected cases.'
  }
};

function updatePlan(event) {
  event?.preventDefault();
  const data = form.elements.data.value;
  const role = form.elements.role.value;
  const scenario = scenarios[`${data}:${role}`];
  plan.textContent = scenario.title;

  const steps = [
    ['Planning', scenario.planning, finalGuidance],
    ['Due diligence and selection', data === 'customer'
      ? 'Request data-flow and access records, a list of providers and subprocessors, and evidence of limits on retention and secondary use.'
      : 'Request proof of sandbox isolation and synthetic data provenance. Verify which systems and subprocessors the pilot uses.', finalGuidance],
    ['Contract negotiation', data === 'customer'
      ? 'Evaluate terms for use and deletion of customer data, incident notice, audit access, subcontractor changes, and responsibility for losses.'
      : 'Document the test-only scope, permitted access, incident reporting, change notice, and deletion at pilot close.', finalGuidance],
    ['Ongoing monitoring', scenario.monitoring, finalGuidance],
    ['Termination', role === 'route'
      ? 'Show how the bank disables vendor access, returns cases to staff queues, reconciles outstanding cases, and confirms data return or deletion.'
      : 'Revoke vendor access, close the integration, and confirm data deletion. Preserve review evidence according to bank policy.', finalGuidance],
    ['Supplemental AI testing and oversight', scenario.testing, occFramework, ' §§ 2.3, 2.10, 2.13']
  ];

  actions.replaceChildren(...steps.flatMap(([label, detail, source, section = '']) => {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    const citation = document.createElement('a');
    citation.href = source.url;
    citation.textContent = source.label + section;
    description.append(detail, ' ', citation);
    return [term, description];
  }));
}

form.addEventListener('submit', updatePlan);
updatePlan();
