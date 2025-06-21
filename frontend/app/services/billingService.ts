const BASE = '/api/v1'
const headers = {
  'Content-Type': 'application/vnd.api+json',
  Accept:       'application/vnd.api+json'
}

export interface BillingAttr {
  name:               string
  pix_key:            string
  transaction_amount: number
  city:               string
  classroom_id:       string
  qr_code:            string
}

type JSONAPIList<T> = {
  data: Array<{
    id: string
    attributes: T
  }>
}

export async function getBilling(classroomId: string): Promise<BillingAttr| null> {
  const res = await fetch(
    `${BASE}/billing?filter[classroom_id]=${classroomId}`,
    { headers }
  )
  const json = await res.json() as JSONAPIList<BillingAttr>
  if (!json.data.length) return null
  return json.data[0].attributes
}

export async function createBilling(attrs: {
  transaction_amount: number
  pix_key:            string
  name:               string
  city:               string
  classroom_id:       string
}): Promise<BillingAttr> {
  const res = await fetch(`${BASE}/billing`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      data: {
        type:       'billing',
        attributes: attrs
      }
    })
  })
  const json = await res.json() as { data: { attributes: BillingAttr } }
  return json.data.attributes
}