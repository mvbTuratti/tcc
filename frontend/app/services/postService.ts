const BASE_URL = '/api/v1/post'
const headers = {
  'Content-Type': 'application/vnd.api+json',
  'Accept':       'application/vnd.api+json'
}

export interface PostAPI {
  id: string
  attributes: { content: string }
}

export async function getPostsByClassroom(classroomId: string) {
  const res = await fetch(`${BASE_URL}?filter[classroom_id]=${classroomId}`, {
    method: 'GET',
    credentials: 'include',
    headers
  })
  if (!res.ok) throw new Error('Erro ao buscar posts')
  const json = await res.json()
  return json.data.map((item: PostAPI) => ({
    id:   item.id,
    text: item.attributes.content
  }))
}

export async function createPost(content: string, classroomId: string) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      data: {
        type: 'post',
        attributes: { content, classroom_id: classroomId }
      }
    })
  })
  const json = await res.json()
  return {
    id:   json.data.id,
    text: json.data.attributes.content
  }
}

export async function updatePost(id: string, content: string) {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      data: {
        type: 'post',
        attributes: { content }
      }
    })
  })
}

export async function deletePost(id: string) {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers
  })
}
