// src/services/enrollmentService.ts
const BASE_URL = '/api/v1';

const headers = {
  'Content-Type': 'application/vnd.api+json',
  'Accept': 'application/vnd.api+json',
};

export interface Student {
  studentId: string;
  enrollmentId: string;
  name: string;
  email: string;
  picture?: string;
  status: 'pending' | 'regular';
  isDelinquent: boolean;
}

export async function getEnrollmentsByClassroom(
  classroomId: string
): Promise<Student[]> {
  const url = `${BASE_URL}/enrollment/members?classroom_id=${classroomId}&include=student.user`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers,
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar lista de alunos');
  }

  const json = await response.json();

  const enrollments: any[] = json.data;
  const included: any[] = json.included || [];

  const mapStudentInfo = new Map<string, { email: string; user_id: string | null }>();
  const mapUserInfo = new Map<string, { name: string; email: string; picture: string }>();

  for (const item of included) {
    if (item.type === 'student') {
      const stId = item.id as string;
      const attrs = item.attributes as any;
      mapStudentInfo.set(stId, {
        email: attrs.email,
        user_id: attrs.user_id,
      });
    } else if (item.type === 'user') {
      const userId = item.id as string;
      const attrs = item.attributes as any;
      mapUserInfo.set(userId, {
        name: attrs.name,
        email: attrs.email,
        picture: attrs.picture,
      });
    }
  }

  const result: Student[] = enrollments.map((enr) => {
    const enrAttrs = enr.attributes as any;
    const studentRel = enr.relationships.student.data as { id: string; type: string };
    const studentId = studentRel.id;
    const enrollmentId = enr.id as string;
    const isDel = enrAttrs.is_delinquent === true;

    const stuInfo = mapStudentInfo.get(studentId) || { email: '', user_id: null };
    const userId = stuInfo.user_id;
    let name = 'Pendente';
    let picture: string | undefined;

    if (userId && mapUserInfo.has(userId)) {
      const userInfo = mapUserInfo.get(userId)!;
      name = userInfo.name;
      picture = userInfo.picture;
    }

    const status: 'pending' | 'regular' = userId ? 'regular' : 'pending';

    return {
      studentId,
      enrollmentId,
      name,
      email: stuInfo.email,
      picture,
      status,
      isDelinquent: isDel,
    };
  });

  return result;
}

export async function inviteStudentToClassroom(
  studentEmail: string,
  classroomId: string
): Promise<{ id: string; student_email: string; status: string }> {
  const response = await fetch(`${BASE_URL}/enrollment`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      data: {
        type: 'enrollment',
        attributes: {
          student_email: studentEmail,
          status: 'pending',
          classroom_id: classroomId,
        },
      },
    }),
  });
  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.errors?.[0]?.detail || 'Erro ao convidar aluno');
  }
  const json = await response.json();
  return {
    id: json.data.id,
    student_email: json.data.attributes.student_email,
    status: json.data.attributes.status,
  };
}