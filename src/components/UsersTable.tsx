import type { User } from "../types";

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function UsersTable({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return <p className="py-12 text-center text-slate-500">لا يوجد مستخدمون</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm" dir="rtl">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-start">#</th>
            <th className="px-4 py-3 text-start">الاسم</th>
            <th className="px-4 py-3 text-start">البريد الإلكتروني</th>
            <th className="px-4 py-3 text-start">الهاتف</th>
            <th className="px-4 py-3 text-start">العمر</th>
            <th className="px-4 py-3 text-start">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-200">
              <td className="px-4 py-3">{user.id}</td>
              <td className="px-4 py-3">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-4 py-3 text-start" dir="ltr">{user.email}</td>
              <td className="px-4 py-3 text-start" dir="ltr">{user.phone}</td>
              <td className="px-4 py-3">{user.age}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="rounded border border-slate-300 px-3 py-1"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="rounded border border-red-300 px-3 py-1 text-red-700"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}