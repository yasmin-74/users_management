import { useEffect, useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  addUser,
  deleteUser,
  getUsers,
  PAGE_SIZE,
  updateUser,
} from "./api/users";
import { useDebounce } from "./hooks/useDebounce";
import Modal from "./components/Modal";
import UserForm from "./components/UserForm";
import UsersTable from "./components/UsersTable";
import type { User, UserFormData } from "./types";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", debouncedSearch, page],
    queryFn: () => getUsers(debouncedSearch, page),
    placeholderData: keepPreviousData,
  });

 
  useEffect(() => {
    if (data) setUsers(data.users);
  }, [data]);

  const addMutation = useMutation({
    mutationFn: addUser,
    onSuccess: (newUser) => {
      setUsers((prev) => [newUser, ...prev]);
      setIsAdding(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserFormData }) =>
      updateUser(id, data),
    onSuccess: (updated) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
      );
      setUserToEdit(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setUserToDelete(null);
    },
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <main className="mx-auto max-w-5xl p-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="rounded-lg bg-teal-700 px-4 py-2 text-white"
        >
          إضافة مستخدم
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="ابحث بالاسم"
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2"
      />

      {isLoading && <p className="py-16 text-center">جاري التحميل...</p>}

      {isError && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
          <p className="mb-3 text-red-800">حدث خطأ: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-red-700 px-4 py-2 text-white"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {data && (
        <>
          <UsersTable
            users={users}
            onEdit={setUserToEdit}
            onDelete={setUserToDelete}
          />

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded border px-3 py-1 disabled:opacity-40"
              >
                السابق
              </button>
              <span className="text-sm">
                صفحة {page} من {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded border px-3 py-1 disabled:opacity-40"
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}

      {isAdding && (
        <Modal title="إضافة مستخدم" onClose={() => setIsAdding(false)}>
          <UserForm
            loading={addMutation.isPending}
            error={addMutation.error?.message}
            onSubmit={(formData) => addMutation.mutate(formData)}
            onCancel={() => setIsAdding(false)}
          />
        </Modal>
      )}

      {userToEdit && (
        <Modal title="تعديل المستخدم" onClose={() => setUserToEdit(null)}>
          <UserForm
            user={userToEdit}
            loading={updateMutation.isPending}
            error={updateMutation.error?.message}
            onSubmit={(formData) =>
              updateMutation.mutate({ id: userToEdit.id, data: formData })
            }
            onCancel={() => setUserToEdit(null)}
          />
        </Modal>
      )}

      {userToDelete && (
        <Modal title="تأكيد الحذف" onClose={() => setUserToDelete(null)}>
          <p className="mb-4">
            هل أنت متأكد من حذف {userToDelete.firstName} {userToDelete.lastName}
            ؟
          </p>
          {deleteMutation.isError && (
            <p className="mb-3 text-sm text-red-700">
              {deleteMutation.error.message}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setUserToDelete(null)}
              className="rounded border px-4 py-2"
            >
              إلغاء
            </button>
            <button
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(userToDelete.id)}
              className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-60"
            >
              {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
