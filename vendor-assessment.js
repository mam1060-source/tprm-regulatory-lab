const form = document.querySelector('#review');
const actions = document.querySelector('#actions');
const plan = document.querySelector('#plan');
const rationale = document.querySelector('#rationale');
const guidance = 'https://www.occ.gov/news-issuances/bulletins/2023/bulletin-2023-17.html';
const aiFramework = 'https://www.occ.gov/news-issuances/news-releases/2026/nr-occ-2026-97a.pdf';

function updatePlan(event) {
  event?.preventDefault();
  const selected = new FormData(form);
  const restricted = selected.get('data') === 'restricted';
  const impact = selected.get('criticality');
  const critical = impact === 'high';
  const moderate = impact === 'moderate';
  const sensitive = selected.get('data') === 'sensitive';
  const dependent = selected.get('dependency') !== 'available';
  const aiUse = selected.get('ai');
  const usesAi = aiUse !== 'none';
  const autonomy = form.elements.autonomy.value;

  const drivers = [
    critical && 'high impact from disruption',
    moderate && 'moderate impact from disruption',
    sensitive && 'access to business-sensitive information',
    restricted && 'access to restricted customer data',
    dependent && (selected.get('dependency') === 'sole' ? 'sole-source dependency' : 'limited substitutes')
  ].filter(Boolean);
  plan.textContent = critical ? 'Critical activity review' : drivers.length ? 'Enhanced due diligence' : 'Standard vendor review';
  rationale.textContent = drivers.length
    ? 'Review priorities: ' + drivers.join(', ') + '.'
    : 'The service supports an internal workflow, uses public data, and has a tested alternative.';

  const steps = [
    ['Planning', critical
      ? 'Document customer and operational impact, maximum tolerable downtime, recovery objectives, and who approves the relationship.'
      : 'Identify the business owner, document the workflow and its data classification, and confirm the impact of a service interruption.'],
    ['Due diligence and selection', [
      restricted ? 'Request a data-flow diagram and evidence of encryption, access restrictions, retention, and deletion.' : sensitive ? 'Verify role-based access, staff confidentiality obligations, and controls on sharing business-sensitive documents.' : 'Confirm that inputs and integrations are limited to publicly available information.',
      moderate && 'Review service capacity and evidence of backup and restoration testing.',
      critical && 'Review financial condition, capacity, and recovery test results against the bank’s recovery objectives.',
      selected.get('dependency') === 'sole' && 'Evaluate an in-house fallback and quantify the cost and time to replace the service.',
      dependent && 'Identify material subcontractors and shared infrastructure. Assess concentration and how long migration would take.'
    ].filter(Boolean).join(' ')],
    ['Contract negotiation', [
      restricted ? 'Address permitted data use, incident notice, audit access, and data return or deletion.' : 'Define permitted access, service scope, and incident reporting.',
      critical && 'Negotiate measurable recovery commitments and transition assistance.',
      dependent && 'Address subcontractor change notice and access to evidence about material subcontractors.'
    ].filter(Boolean).join(' ')],
    ['Ongoing monitoring', [
      critical ? 'Track service availability, processing delays, recovery tests, and breaches of service thresholds.' : 'Review service performance and material changes on a schedule proportionate to the risk.',
      restricted && 'Review access exceptions and data incidents.',
      dependent && 'Reassess dependency when providers or hosting arrangements change.'
    ].filter(Boolean).join(' ')],
    ['Termination', [
      critical ? 'Test switching to the fallback process and reconciling outstanding work.' : 'Document migration steps and confirm the replacement can take over.',
      dependent && 'Test data export and estimate time to onboard a substitute.',
      restricted && 'Verify return or deletion of restricted data and revocation of access.'
    ].filter(Boolean).join(' ')]
  ];

  if (usesAi) {
    const useCheck = aiUse === 'workflow'
      ? 'Test actions against approved permissions and verify that staff can reverse errors. '
      : 'Check outputs against source documents for omissions, distortions, and unsupported claims. ';
    const oversight = {
      advisory: 'Keep decisions and actions with staff. Limit the feature to advisory outputs.',
      approval: 'Require a qualified reviewer to approve each proposed action before execution.',
      monitored: 'Set intervention thresholds and test the operator’s ability to override or halt actions.',
      autonomous: 'Define permitted actions and limits, log execution, and test suspension and recovery before deployment.'
    };
    steps.push(['Supplemental AI review', useCheck + (restricted
      ? 'Verify whether the AI provider retains restricted inputs or uses them for training. '
      : 'Limit the feature to approved internal content. ') + (critical
      ? 'Test fallback with AI disabled and check whether inaccurate summaries could delay the critical workflow. '
      : 'Sample summaries for omissions and invented facts. ') + oversight[autonomy] + ' Reassess after material model changes.', aiFramework]);
  }

  actions.replaceChildren(...steps.flatMap(([label, detail, source = guidance]) => {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    const citation = document.createElement('a');
    citation.href = source;
    citation.textContent = source === guidance ? '2023 final interagency guidance' : 'OCC examiner framework';
    description.append(detail, ' ', citation);
    return [term, description];
  }));
}

function syncAiControls() {
  const enabled = form.elements.ai.value !== 'none';
  form.elements.autonomy.disabled = !enabled;
  if (!enabled) form.elements.autonomy.value = 'na';
  else if (form.elements.autonomy.value === 'na') form.elements.autonomy.value = 'advisory';
}
form.elements.ai.addEventListener('change', syncAiControls);
form.addEventListener('submit', updatePlan);
syncAiControls();
updatePlan();
