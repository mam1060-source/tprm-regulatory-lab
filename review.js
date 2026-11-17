const form = document.querySelector('#review');
const actions = document.querySelector('#actions');
const plan = document.querySelector('#plan');

function updatePlan(event) {
  event?.preventDefault();
  const hasCustomerData = form.elements.data.value === 'customer';
  const routesAutomatically = form.elements.role.value === 'route';
  plan.textContent = hasCustomerData || routesAutomatically ? 'Expanded review' : 'Controlled pilot';
  const steps = [
    ['Data handling', hasCustomerData
      ? 'Request a data flow diagram and evidence of retention, deletion, and restrictions on secondary use.'
      : 'Verify that the test data is synthetic and disable production data connections during the pilot.'],
    ['Human oversight', routesAutomatically
      ? 'Test routing errors, define an override path, and assign someone to review misrouted cases.'
      : 'Require staff to approve each draft and log corrections during the pilot.'],
    ['Ongoing monitoring', 'Assign an owner to review incidents and model changes. Track whether the vendor delivers the agreed evidence.']
  ];
  actions.replaceChildren(...steps.flatMap(([label, detail]) => {
    const term = document.createElement('dt');
    term.textContent = label;
    const description = document.createElement('dd');
    description.textContent = detail;
    return [term, description];
  }));
}

form.addEventListener('submit', updatePlan);
updatePlan();
