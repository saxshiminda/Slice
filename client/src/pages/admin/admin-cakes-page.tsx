import { useState } from 'react';
import { Button, Input, Spinner } from '@/components/ui';
import {
  useAdminCakes,
  useAdminCategories,
  useCreateCake,
  useUpdateCake,
  useDeleteCake,
  CakeImageUpload,
  type CakeInput,
} from '@/features/admin';
import { resolveImageSrc } from '@/lib/images';
import type { Cake } from '@/types';

const emptyForm: CakeInput = {
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  imageUrl: '',
  featured: false,
  available: true,
};

export function AdminCakesPage() {
  const { data: cakes, isLoading } = useAdminCakes();
  const { data: categories = [] } = useAdminCategories();
  const createCake = useCreateCake();
  const updateCake = useUpdateCake();
  const deleteCake = useDeleteCake();

  const [editing, setEditing] = useState<Cake | null>(null);
  const [form, setForm] = useState<CakeInput>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '' });
    setShowForm(true);
  }

  function openEdit(cake: Cake) {
    setEditing(cake);
    setForm({
      name: cake.name,
      description: cake.description,
      price: cake.price,
      categoryId: cake.categoryId,
      imageUrl: cake.imageUrl,
      featured: cake.featured,
      available: cake.available,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateCake.mutateAsync({ id: editing.id, input: form });
    } else {
      await createCake.mutateAsync(form);
    }
    closeForm();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this cake?')) return;
    await deleteCake.mutateAsync(id);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-espresso">Cakes</h1>
          <p className="font-sans text-sm text-espresso/50 mt-1">Manage menu items and details</p>
        </div>
        <Button type="button" onClick={openCreate}>
          Add cake
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-cream p-6 lg:p-8 mb-8 border border-espresso/10 space-y-4 max-w-4xl mx-auto"
        >
          <h2 className="font-display text-xl text-espresso text-center lg:text-left">
            {editing ? 'Edit cake' : 'New cake'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Input
                  label="Price (£)"
                  type="number"
                  value={form.price || ''}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-sans font-medium text-espresso/80">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso focus:outline-none focus:border-rose resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-sans font-medium text-espresso/80">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso focus:outline-none focus:border-rose"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm font-sans text-espresso/70">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm font-sans text-espresso/70">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                  />
                  Available
                </label>
              </div>
            </div>

            <CakeImageUpload
              value={form.imageUrl}
              onChange={(imageUrl) => setForm((f) => ({ ...f, imageUrl }))}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={createCake.isPending || updateCake.isPending}>
              {editing ? 'Save changes' : 'Create cake'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="bg-cream border border-espresso/10 overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-espresso/10 text-left text-espresso/50">
              <th className="p-4 font-medium w-20">Image</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cakes?.map((cake) => (
              <tr key={cake.id} className="border-b border-espresso/5">
                <td className="p-4">
                  <div className="w-14 h-14 overflow-hidden bg-warm border border-espresso/10">
                    {cake.imageUrl ? (
                      <img
                        src={resolveImageSrc(cake.imageUrl)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-espresso/5" />
                    )}
                  </div>
                </td>
                <td className="p-4 text-espresso">{cake.name}</td>
                <td className="p-4 text-espresso/70">{cake.category.name}</td>
                <td className="p-4 price text-espresso">£{cake.price}</td>
                <td className="p-4 text-espresso/70">
                  {cake.available ? 'Available' : 'Hidden'}
                  {cake.featured ? ' · Featured' : ''}
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => openEdit(cake)}
                      className="text-rose hover:text-rose-dark"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cake.id)}
                      className="text-espresso/40 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
