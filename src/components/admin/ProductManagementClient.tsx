"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/actions/product-actions";
import { ProductItem } from "@/types";

interface Props {
  initialProducts: ProductItem[];
  categories: { id: string; name: string; slug: string }[];
}

export function ProductManagementClient({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add Form State
  const [addForm, setAddForm] = useState({
    name: "",
    categoryId: categories[0]?.id || "",
    mukhi: "5",
    price: "4500",
    stock: "10",
    origin: "Nepal (Sankhuwasabha)",
    description: "Authentic sacred Nepali Rudraksha with deep natural Mukhi lines.",
    imageUrl: "/images/products/rudraksha-beads.jpg",
    isCertified: true,
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    categoryId: "",
    mukhi: "",
    price: "",
    stock: "",
    origin: "",
    description: "",
    isCertified: true,
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.origin.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "ALL" || p.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const res = await createProductAction({
      name: addForm.name,
      categoryId: addForm.categoryId,
      mukhi: addForm.mukhi ? Number(addForm.mukhi) : null,
      price: Number(addForm.price),
      stock: Number(addForm.stock),
      origin: addForm.origin,
      description: addForm.description,
      imageUrl: addForm.imageUrl,
      isCertified: addForm.isCertified,
    });

    setLoading(false);
    if (res.success && res.product) {
      setProducts([res.product as any, ...products]);
      setShowAddModal(false);
      setFeedback({ type: "success", message: `Successfully added "${res.product.name}"!` });
      setAddForm({
        name: "",
        categoryId: categories[0]?.id || "",
        mukhi: "5",
        price: "4500",
        stock: "10",
        origin: "Nepal (Sankhuwasabha)",
        description: "Authentic sacred Nepali Rudraksha with deep natural Mukhi lines.",
        imageUrl: "/images/products/rudraksha-beads.jpg",
        isCertified: true,
      });
    } else {
      setFeedback({ type: "error", message: res.error || "Failed to add specimen." });
    }
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setEditForm({
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      mukhi: product.mukhi ? String(product.mukhi) : "",
      price: String(product.price),
      stock: String(product.stock),
      origin: product.origin,
      description: product.description,
      isCertified: Boolean(product.isCertified),
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const res = await updateProductAction({
      id: editForm.id,
      name: editForm.name,
      categoryId: editForm.categoryId,
      mukhi: editForm.mukhi ? Number(editForm.mukhi) : null,
      price: Number(editForm.price),
      stock: Number(editForm.stock),
      origin: editForm.origin,
      description: editForm.description,
      isCertified: editForm.isCertified,
    });

    setLoading(false);
    if (res.success && res.product) {
      setProducts(
        products.map((p) => (p.id === editForm.id ? (res.product as any) : p))
      );
      setEditingProduct(null);
      setFeedback({ type: "success", message: `Updated details for "${res.product.name}".` });
    } else {
      setFeedback({ type: "error", message: res.error || "Failed to update specimen." });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the catalog?`)) return;

    setLoading(true);
    setFeedback(null);
    const res = await deleteProductAction(id);
    setLoading(false);

    if (res.success) {
      setProducts(products.filter((p) => p.id !== id));
      setFeedback({ type: "success", message: res.message || "Specimen removed." });
    } else {
      setFeedback({ type: "error", message: res.error || "Failed to delete specimen." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar: Search & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-sacred-200">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by specimen name or origin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-sacred-200 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-sacred-200 bg-sacred-50 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="gap-1.5 self-start sm:self-auto font-bold"
        >
          <Plus className="w-4 h-4" /> Add New Specimen
        </Button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-sacred-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sacred-100/80 border-b border-sacred-200 font-serif font-bold text-sacred-900 uppercase tracking-wider">
              <tr>
                <th className="p-4">Specimen</th>
                <th className="p-4">Category</th>
                <th className="p-4">Mukhi</th>
                <th className="p-4">Origin</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Price (NPR)</th>
                <th className="p-4">Certification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sacred-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-sacred-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-sacred-100 flex-shrink-0">
                      <Image
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <span className="font-serif font-bold text-sacred-950 max-w-[200px] truncate block">
                        {product.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        /{product.slug}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sacred-700">
                    {product.category?.name || "Rudraksha"}
                  </td>
                  <td className="p-4 font-semibold text-sacred-900">
                    {product.mukhi ? `${product.mukhi} Mukhi` : "Special"}
                  </td>
                  <td className="p-4 text-muted-foreground">{product.origin}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        product.stock <= 3
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="p-4 font-bold text-sacred-950">
                    Rs. {product.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {product.isCertified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Certified
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Standard</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                      <Link href={`/products/${product.slug}`} target="_blank" title="View product">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(product)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Edit specimen"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id, product.name)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete specimen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground text-xs">
                    No matching specimens found in catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-sacred-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-sacred-200 pb-3">
              <h2 className="font-serif text-lg font-bold text-sacred-950 flex items-center gap-2">
                <Plus className="w-5 h-5 text-saffron-700" />
                Add New Himalayan Specimen
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Specimen Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Mukhi Collector Rudraksha"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none focus:ring-1 focus:ring-saffron-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Category *</label>
                  <select
                    value={addForm.categoryId}
                    onChange={(e) => setAddForm({ ...addForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Price (NPR Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={addForm.stock}
                    onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Mukhi Facets (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    max="21"
                    placeholder="1-14 (leave blank for combinations)"
                    value={addForm.mukhi}
                    onChange={(e) => setAddForm({ ...addForm, mukhi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Himalayan Origin</label>
                  <input
                    type="text"
                    value={addForm.origin}
                    onChange={(e) => setAddForm({ ...addForm, origin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sacred-900">Botanical Description</label>
                <textarea
                  rows={3}
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sacred-900">Product Image URL</label>
                <input
                  type="text"
                  placeholder="e.g. /images/products/rudraksha-beads.jpg"
                  value={addForm.imageUrl}
                  onChange={(e) => setAddForm({ ...addForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="certifiedCheck"
                  checked={addForm.isCertified}
                  onChange={(e) => setAddForm({ ...addForm, isCertified: e.target.checked })}
                  className="rounded border-sacred-300 text-saffron-600 focus:ring-saffron-500"
                />
                <label htmlFor="certifiedCheck" className="text-sacred-900 font-semibold cursor-pointer">
                  Includes Official X-Ray / Laboratory Certificate Record
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-sacred-200 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={loading}>
                  {loading ? "Adding Specimen..." : "Create Specimen"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-sacred-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-sacred-200 pb-3">
              <h2 className="font-serif text-lg font-bold text-sacred-950 flex items-center gap-2">
                <Edit className="w-5 h-5 text-saffron-700" />
                Edit Specimen: {editingProduct.name}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Specimen Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Category</label>
                  <select
                    value={editForm.categoryId}
                    onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Price (NPR Rs.)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Available Stock Units</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Mukhi Facets</label>
                  <input
                    type="number"
                    min="1"
                    max="21"
                    value={editForm.mukhi}
                    onChange={(e) => setEditForm({ ...editForm, mukhi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sacred-900">Origin</label>
                  <input
                    type="text"
                    value={editForm.origin}
                    onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sacred-900">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editCertifiedCheck"
                  checked={editForm.isCertified}
                  onChange={(e) => setEditForm({ ...editForm, isCertified: e.target.checked })}
                  className="rounded border-sacred-300 text-saffron-600 focus:ring-saffron-500"
                />
                <label htmlFor="editCertifiedCheck" className="text-sacred-900 font-semibold cursor-pointer">
                  Certified Himalayan Specimen
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-sacred-200 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={loading}>
                  {loading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
