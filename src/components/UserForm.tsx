import { useState, type FormEvent } from "react";
import type { User, UserFormData } from "../types";

type Props = {
  user?: User;
  loading: boolean;
  error?: string;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
};

type FieldProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  ltr?: boolean;
};

function Field({ label, value, onChange, type = "text", ltr }: FieldProps) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        required
        type={type}
        value={value}
        dir={ltr ? "ltr" : undefined}
        min={type === "number" ? 1 : undefined}
        max={type === "number" ? 120 : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal"
      />
    </label>
  );
}

export default function UserForm({ user, loading, error, onSubmit, onCancel }: Props) {
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [age, setAge] = useState(user?.age ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ firstName, lastName, email, phone, age: Number(age) });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label="الاسم الأول" value={firstName} onChange={setFirstName} />
      <Field label="اسم العائلة" value={lastName} onChange={setLastName} />
      <Field label="البريد الإلكتروني" type="email" ltr value={email} onChange={setEmail} />
      <Field label="الهاتف" type="tel" ltr value={phone} onChange={setPhone} />
      <Field label="العمر" type="number" value={age} onChange={setAge} />

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded border px-4 py-2">
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-teal-700 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "جاري الحفظ..." : "حفظ"}
        </button>
      </div>
    </form>
  );
}