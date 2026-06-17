import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Spinner, Button } from '@/components/ui';
import { useT } from '@/i18n';
import type { ApiResponse, Branch } from '@/types';

interface BranchInput {
  name: string;
  address: string;
  phone: string;
  pickupAvailable: boolean;
  active: boolean;
}

const EMPTY: BranchInput = {
  name: '',
  address: '',
  phone: '',
  pickupAvailable: true,
  active: true,
};

export function AdminBranchesPage() {
  const t = useT();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Branch | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<BranchInput>(EMPTY);
  const [formError, setFormError] = useState('');

  const { data: branches, isLoading } = useQuery({
    queryKey: ['admin', 'branches'],
    queryFn: () => api.get<ApiResponse<Branch[]>>('/api/admin/branches?all=true'),
    select: (res) => res.data,
  });

  const create = useMutation({
    mutationFn: (input: BranchInput) => api.post<ApiResponse<Branch>>('/api/admin/branches', input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'branches'] });
      void qc.invalidateQueries({ queryKey: ['branches'] });
      setCreating(false);
      setForm(EMPTY);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<BranchInput> }) =>
      api.patch<ApiResponse<Branch>>(`/api/admin/branches/${id}`, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'branches'] });
      void qc.invalidateQueries({ queryKey: ['branches'] });
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete<void>(`/api/admin/branches/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'branches'] });
      void qc.invalidateQueries({ queryKey: ['branches'] });
    },
  });

  function startEdit(branch: Branch) {
    setEditing(branch);
    setForm({
      name: branch.name,
      address: branch.address,
      phone: branch.phone ?? '',
      pickupAvailable: branch.pickupAvailable,
      active: branch.active,
    });
    setCreating(false);
    setFormError('');
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(EMPTY);
    setFormError('');
  }

  async function handleSave() {
    if (!form.name.trim() || !form.address.trim()) {
      setFormError(t.admin.branches.required);
      return;
    }
    setFormError('');
    if (editing) {
      await update.mutateAsync({ id: editing.id, input: form });
    } else {
      await create.mutateAsync(form);
    }
  }

  const fieldLabels: Record<string, string> = {
    name: t.admin.branches.branchName,
    address: t.admin.branches.address,
    phone: t.admin.branches.phone,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl text-espresso">{t.admin.branches.title}</h1>
        <Button onClick={startCreate} variant="secondary">
          {t.admin.branches.addBranch}
        </Button>
      </div>
      <p className="font-sans text-sm text-espresso/50 mb-8">{t.admin.branches.subtitle}</p>

      {(creating || editing) && (
        <div className="bg-cream border border-espresso/10 p-6 mb-6">
          <h3 className="font-display text-xl text-espresso mb-4">
            {editing ? t.admin.branches.editBranch : t.admin.branches.newBranch}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {(['name', 'address', 'phone'] as const).map((key) => (
              <div key={key}>
                <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
                  {fieldLabels[key]}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-espresso/20 bg-warm px-4 py-2.5 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                />
              </div>
            ))}
            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.pickupAvailable}
                  onChange={(e) => setForm((f) => ({ ...f, pickupAvailable: e.target.checked }))}
                  className="accent-rose"
                />
                <span className="font-sans text-sm">{t.admin.branches.pickupAvailable}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="accent-rose"
                />
                <span className="font-sans text-sm">{t.admin.branches.active}</span>
              </label>
            </div>
          </div>
          {formError && <p className="font-sans text-sm text-red-600 mb-3">{formError}</p>}
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={create.isPending || update.isPending}>
              {t.common.save}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              {t.common.cancel}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : !branches?.length ? (
        <p className="font-sans text-sm text-espresso/40">{t.admin.branches.noBranches}</p>
      ) : (
        <div className="space-y-3">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-cream border border-espresso/10 p-5 flex flex-wrap items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-sans font-medium text-espresso">{branch.name}</p>
                  {!branch.active && (
                    <span className="text-xs font-sans bg-espresso/10 text-espresso/50 px-2 py-0.5">
                      {t.admin.branches.inactive}
                    </span>
                  )}
                </div>
                <p className="font-sans text-sm text-espresso/50">{branch.address}</p>
                {branch.phone && (
                  <p className="font-sans text-sm text-espresso/50">{branch.phone}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(branch)}
                  className="font-sans text-sm text-espresso/50 hover:text-espresso"
                >
                  {t.common.edit}
                </button>
                <button
                  onClick={() => remove.mutate(branch.id)}
                  className="font-sans text-sm text-rose/60 hover:text-rose"
                >
                  {t.common.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
