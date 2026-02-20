const API_BASE =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export async function verifyHuidViaApi(huid) {
  const res = await fetch(`${API_BASE}/api/verify-huid`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ huid }),
  });

  if (!res.ok) {
    throw new Error('Failed to verify HUID');
  }

  return res.json();
}

export async function getGoldPriceApi() {
  const res = await fetch(`${API_BASE}/api/gold-price`);
  if (!res.ok) {
    throw new Error('Failed to fetch gold price');
  }
  return res.json();
}

export async function subscribeAlertsApi(phone) {
  const res = await fetch(`${API_BASE}/api/alerts/subscribe`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) {
    throw new Error('Failed to subscribe alerts');
  }
  return res.json();
}

export async function unsubscribeAlertsApi(phone) {
  const res = await fetch(`${API_BASE}/api/alerts/unsubscribe`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) {
    throw new Error('Failed to unsubscribe alerts');
  }
  return res.json();
}

export async function saveComplaintApi(complaintData) {
  const res = await fetch(`${API_BASE}/api/complaints`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(complaintData),
  });
  if (!res.ok) {
    throw new Error('Failed to save complaint');
  }
  return res.json();
}

