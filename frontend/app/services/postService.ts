// src/services/postService.ts

const BASE_URL = '/api/v1/post';

const headers = {
  'Content-Type': 'application/vnd.api+json',
  'Accept': 'application/vnd.api+json',
};

export async function getPostsByClassroom(classroomId: string) {
  const response = await fetch(`${BASE_URL}?filter[classroom_id]=${classroomId}`, {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar posts');
  }

  const json = await response.json();

  return json.data.map((item: any) => ({
    id: item.id,
    text: item.attributes.content,
  }));
}


export async function createPost(content: string, classroomId: string) {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      data: {
        type: 'post',
        attributes: {
          content,
          classroom_id: classroomId,
        },
      },
    }),
  });
  const json = await response.json();
  return {
    id: json.data.id,
    text: json.data.attributes.content,
  };
}

export async function updatePost(id: string, content: string) {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      data: {
        type: 'post',
        attributes: {
          content,
        },
      },
    }),
  });
}

export async function deletePost(id: string) {
  await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers,
  });
}