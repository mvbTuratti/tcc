const BASE = '/api/v1'
const headers = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/vnd.api+json'
}

export interface UserItem {
  id: string
  name: string
  picture: string
}

export interface PostItem {
  id: string
  text: string
  updatedAt: string
  author: UserItem
  responseCount: number
}

export interface ResponseItem {
  id: string
  text: string
  updatedAt: string
  author: UserItem
}

export interface PostWithResponses {
  id: string
  text: string
  updatedAt: string
  author: UserItem
  responses: ResponseItem[]
}

type JSONAPI = {
  data: any
  included?: any[]
}

function parseUsers(included: any[]): Record<string, UserItem> {
  return (included || [])
    .filter(i => i.type === 'user')
    .reduce((acc, u) => {
      acc[u.id] = {
        id: u.id,
        name: u.attributes.name,
        picture: u.attributes.picture
      }
      return acc
    }, {} as Record<string, UserItem>)
}

export async function getPostsWithRelations(
  classroomId: string
): Promise<PostItem[]> {
  const res = await fetch(
    `${BASE}/post?include=responses.author,author&filter[classroom_id]=${classroomId}`,
    { headers }
  )
  const json = (await res.json()) as JSONAPI
  const users = parseUsers(json.included)
  return json.data.map((p: any) => {
    const attr = p.attributes
    const authorId = p.relationships?.author?.data?.id ?? p.attributes.author_id
    const respCount = p.relationships.responses.data.length
    return {
      id: p.id,
      text: attr.content,
      updatedAt: attr.updated_at,
      author: users[authorId],
      responseCount: respCount
    }
  })
}

export async function getPostWithResponses(
  postId: string
): Promise<PostWithResponses> {
  const res = await fetch(
    `${BASE}/post/${postId}?include=responses.author,author`,
    { headers }
  )
  const json = (await res.json()) as JSONAPI
  const users = parseUsers(json.included)
  const d = json.data
  const attr = d.attributes
  const responses = (json.included || [])
    .filter(i => i.type === 'response')
    .map(r => {
      const authorId = r.relationships.author.data.id
      return {
        id: r.id,
        text: r.attributes.content,
        updatedAt: r.attributes.updated_at,
        author: users[authorId]
      }
    })
  const authorId = d.relationships.author.data.id
  return {
    id: d.id,
    text: attr.content,
    updatedAt: attr.updated_at,
    author: users[authorId],
    responses
  }
}

export async function createPost(
  content: string,
  classroomId: string
): Promise<PostItem> {
  const res = await fetch(`${BASE}/post`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      data: {
        type: 'post',
        attributes: {
          content,
          classroom_id: classroomId
        }
      }
    })
  })
  const json = await res.json()
  return {
    id: json.data.id,
    text: json.data.attributes.content,
    updatedAt: json.data.attributes.updated_at,
    author: { id: '', name: '', picture: '' },
    responseCount: 0
  }
}

export async function updatePost(id: string, content: string) {
  await fetch(`${BASE}/post/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      data: { type: 'post', attributes: { content } }
    })
  })
}

export async function deletePost(id: string) {
  await fetch(`${BASE}/post/${id}`, {
    method: 'DELETE',
    headers
  })
}

export async function createResponse(postId: string, content: string) {
  await fetch(`${BASE}/response`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      data: {
        type: 'response',
        attributes: { content, post_id: postId }
      }
    })
  })
}

export async function updateResponse(id: string, content: string) {
  await fetch(`${BASE}/response/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      data: { type: 'response', attributes: { content } }
    })
  })
}
