import { useState } from 'react';
import { Button, Input, Spinner } from '@/components/ui';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/admin';
import type { CategoryWithCount } from '@/types';

export function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    await createCategory.mutateAsync(newName.trim());
    setNewName('');
  }

  function startEdit(cat: CategoryWithCount) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    await updateCategory.mutateAsync({ id, name: editName.trim() });
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Cakes must be reassigned first.')) return;
    try {
      await deleteCategory.mutateAsync(id);
    } catch {
      alert('Cannot delete a category that has cakes assigned.');
    }
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
      <h1 className="font-display text-3xl text-espresso mb-2">Categories</h1>
      <p className="font-sans text-sm text-espresso/50 mb-8">
        Organise cakes into collections. Each cake must belong to one category.
      </p>

      <form onSubmit={handleCreate} className="flex gap-3 mb-8">
        <div className="flex-1">
          <Input
            label="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Celebration"
          />
        </div>
        <Button type="submit" loading={createCategory.isPending} className="self-end">
          Add
        </Button>
      </form>

      <div className="bg-cream border border-espresso/10">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-espresso/10 text-left text-espresso/50">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium">Cakes</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat) => (
              <tr key={cat.id} className="border-b border-espresso/5">
                <td className="p-4">
                  {editingId === cat.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-warm border border-espresso/20 px-3 py-1.5 text-sm w-full"
                    />
                  ) : (
                    <span className="text-espresso">{cat.name}</span>
                  )}
                </td>
                <td className="p-4 text-espresso/50">{cat.slug}</td>
                <td className="p-4 text-espresso/70">{cat._count?.cakes ?? 0}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    {editingId === cat.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEdit(cat.id)}
                          className="text-rose hover:text-rose-dark"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-espresso/40"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="text-rose hover:text-rose-dark"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="text-espresso/40 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
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
