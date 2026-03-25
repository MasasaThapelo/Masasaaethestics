'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
    Plus, Upload, X, Loader2, GripVertical, Eye, EyeOff,
    Trash2, Edit, Save, ChevronDown, Image as ImageIcon, Search,
    ArrowRight, ArrowLeft, Smartphone, Tag, Database
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    category: string;
    phoneModel: string;
    price: number;
    imageUrl: string;
    description?: string;
    isLive: boolean;
    position: number;
    createdAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);
    const [dragOverZone, setDragOverZone] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        phoneModel: '',
        price: 200,
        description: '',
        imageUrl: '',
        isLive: false,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const liveProducts = products.filter(p => p.isLive).sort((a, b) => a.position - b.position);
    const draftProducts = products.filter(p => !p.isLive).sort((a, b) => a.position - b.position);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Seed products
    const handleSeed = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed' }),
            });
            const data = await res.json();
            if (data.seeded) {
                await fetchProducts();
            }
            alert(data.message);
        } catch (error) {
            alert('Failed to seed products');
        } finally {
            setIsSaving(false);
        }
    };

    // Image handling
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return formData.imageUrl || null;
        setIsUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', imageFile);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.url) return data.url;
            alert('Image upload failed: ' + (data.error || 'Unknown error'));
            return null;
        } catch (error) {
            alert('Image upload failed');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    // Save product (create or update)
    const handleSaveProduct = async () => {
        if (!formData.name || !formData.phoneModel || !formData.category) {
            alert('Please fill in name, phone model, and category');
            return;
        }

        setIsSaving(true);
        try {
            const imageUrl = await uploadImage();
            if (!imageUrl && !formData.imageUrl) {
                alert('Please upload an image');
                setIsSaving(false);
                return;
            }

            if (editingProduct) {
                // Update
                const res = await fetch('/api/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingProduct.id,
                        name: formData.name,
                        category: formData.category,
                        phoneModel: formData.phoneModel,
                        price: formData.price,
                        description: formData.description,
                        imageUrl: imageUrl || formData.imageUrl,
                        isLive: formData.isLive,
                    }),
                });
                if (!res.ok) throw new Error('Failed to update');
            } else {
                // Create
                const maxPosition = Math.max(...products.map(p => p.position), -1) + 1;
                const id = `${formData.phoneModel}-${formData.name}`
                    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    + '-' + Math.random().toString(36).substring(2, 6);

                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id,
                        ...formData,
                        imageUrl: imageUrl || formData.imageUrl,
                        position: maxPosition,
                        createdAt: new Date().toISOString(),
                    }),
                });
                if (!res.ok) throw new Error('Failed to create');
            }

            resetForm();
            await fetchProducts();
        } catch (error) {
            alert('Failed to save product');
        } finally {
            setIsSaving(false);
        }
    };

    // Delete product
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            await fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    // Edit product
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            phoneModel: product.phoneModel,
            price: product.price,
            description: product.description || '',
            imageUrl: product.imageUrl,
            isLive: product.isLive,
        });
        setImagePreview(product.imageUrl);
        setImageFile(null);
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', category: '', phoneModel: '', price: 200, description: '', imageUrl: '', isLive: false });
        setImageFile(null);
        setImagePreview('');
    };

    // --- DRAG AND DROP ---
    const handleDragStart = (e: React.DragEvent, product: Product) => {
        setDraggedProduct(product);
        e.dataTransfer.effectAllowed = 'move';
        (e.target as HTMLElement).style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1';
        setDraggedProduct(null);
        setDragOverZone(null);
    };

    const handleDragOver = (e: React.DragEvent, zone: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverZone(zone);
    };

    const handleDragLeave = () => {
        setDragOverZone(null);
    };

    const handleDrop = (e: React.DragEvent, targetZone: 'live' | 'draft', dropIndex?: number) => {
        e.preventDefault();
        setDragOverZone(null);

        if (!draggedProduct) return;
        performMove(draggedProduct, targetZone, dropIndex);
    };

    const performMove = (product: Product, targetZone: 'live' | 'draft', dropIndex?: number) => {
        const isMovingToLive = targetZone === 'live';
        const wasLive = product.isLive;

        // Update the product's live status
        const updatedProducts = products.map(p => {
            if (p.id === product.id) {
                return { ...p, isLive: isMovingToLive };
            }
            return p;
        });

        // Re-index positions within the target zone
        const targetList = updatedProducts
            .filter(p => p.isLive === isMovingToLive)
            .sort((a, b) => a.position - b.position);

        // If dropping/moving at a specific index, reorder
        if (dropIndex !== undefined) {
            const movedItem = targetList.find(p => p.id === product.id);
            if (movedItem) {
                const filtered = targetList.filter(p => p.id !== product.id);
                filtered.splice(dropIndex, 0, movedItem);
                filtered.forEach((p, i) => p.position = i);
            }
        } else {
            // If just moving to a new zone without a specific index, put at the end
            targetList.forEach((p, i) => p.position = i);
        }

        // Also re-index the source zone if item moved between zones
        if (wasLive !== isMovingToLive) {
            const sourceList = updatedProducts
                .filter(p => p.isLive === wasLive)
                .sort((a, b) => a.position - b.position);
            sourceList.forEach((p, i) => p.position = i);
        }

        setProducts(updatedProducts);
        setHasUnsavedChanges(true);
    };

    const handleMoveInZone = (product: Product, direction: 'up' | 'down') => {
        const zoneProducts = products
            .filter(p => p.isLive === product.isLive)
            .sort((a, b) => a.position - b.position);

        const currentIndex = zoneProducts.findIndex(p => p.id === product.id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= zoneProducts.length) return;

        // Swap positions
        const targetProduct = zoneProducts[targetIndex];
        const updatedProducts = products.map(p => {
            if (p.id === product.id) return { ...p, position: targetIndex };
            if (p.id === targetProduct.id) return { ...p, position: currentIndex };
            return p;
        });

        setProducts(updatedProducts);
        setHasUnsavedChanges(true);
    };

    // Save positions to database
    const savePositions = async () => {
        setIsSaving(true);
        try {
            const updates = products.map(p => ({ id: p.id, position: p.position, isLive: p.isLive }));
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updatePositions', updates }),
            });
            if (!res.ok) throw new Error('Failed');
            setHasUnsavedChanges(false);
        } catch (error) {
            alert('Failed to save layout');
        } finally {
            setIsSaving(false);
        }
    };

    // Group live products by phone model for preview
    const liveByModel: Record<string, Product[]> = {};
    liveProducts.forEach(p => {
        if (!liveByModel[p.phoneModel]) liveByModel[p.phoneModel] = [];
        liveByModel[p.phoneModel].push(p);
    });

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500">Upload covers, drag to go live, and preview the storefront.</p>
                </div>
                <div className="flex items-center gap-3">
                    {products.length === 0 && (
                        <button
                            onClick={handleSeed}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Database className="h-4 w-4" />
                            Import Existing
                        </button>
                    )}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${showPreview
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Eye className="h-4 w-4" />
                        {showPreview ? 'Hide' : 'Show'} Preview
                    </button>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Unsaved Changes Banner */}
            {hasUnsavedChanges && (
                <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                    <p className="text-sm font-medium text-yellow-800">
                        You have unsaved layout changes. Save to update the live site.
                    </p>
                    <button
                        onClick={savePositions}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-bold text-white hover:bg-yellow-700 transition-colors"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Layout
                    </button>
                </div>
            )}

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 rounded-t-2xl">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Product Image *</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden"
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-medium">Click to change</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                                            <p className="text-sm text-gray-500">Click to upload image</p>
                                            <p className="text-xs text-gray-400">JPG, PNG, WEBP up to 10MB</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Botanical Blossom"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Model *</label>
                                    <input
                                        type="text"
                                        placeholder="iPhone 15 Pro"
                                        value={formData.phoneModel}
                                        onChange={e => setFormData({ ...formData, phoneModel: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Category *</label>
                                    <input
                                        type="text"
                                        placeholder="Botanical Blossom"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Price (R)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    placeholder="Beautiful botanical design with floral patterns..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isLive}
                                        onChange={e => setFormData({ ...formData, isLive: e.target.checked })}
                                        className="w-4 h-4 text-primary rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                                </label>
                                <div className="flex gap-3">
                                    <button onClick={resetForm} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProduct}
                                        disabled={isSaving || isUploading}
                                        className="inline-flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                    >
                                        {(isSaving || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {editingProduct ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Drag and Drop Board */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LIVE Column */}
                <div
                    onDragOver={(e) => handleDragOver(e, 'live')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'live')}
                    className={`rounded-2xl border-2 transition-colors min-h-[300px] ${dragOverZone === 'live'
                        ? 'border-green-400 bg-green-50/50'
                        : 'border-green-200 bg-green-50/20'
                        }`}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-green-100">
                        <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-bold text-green-900">Live</h3>
                            <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                                {liveProducts.length}
                            </span>
                        </div>
                        <p className="text-xs text-green-600">Visible on the storefront</p>
                    </div>

                    <div className="p-4 space-y-3">
                        {liveProducts.length === 0 ? (
                            <p className="py-10 text-center text-sm text-green-400 italic">
                                Drag products here to go live
                            </p>
                        ) : (
                            liveProducts.map((product, index) => (
                                <DraggableCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    isFirst={index === 0}
                                    isLast={index === liveProducts.length - 1}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDrop={(e) => handleDrop(e, 'live', index)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleLive={() => performMove(product, product.isLive ? 'draft' : 'live')}
                                    onMove={(dir) => handleMoveInZone(product, dir)}
                                    variant="live"
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* DRAFT Column */}
                <div
                    onDragOver={(e) => handleDragOver(e, 'draft')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'draft')}
                    className={`rounded-2xl border-2 transition-colors min-h-[300px] ${dragOverZone === 'draft'
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 bg-gray-50/50'
                        }`}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <EyeOff className="h-5 w-5 text-gray-400" />
                            <h3 className="text-lg font-bold text-gray-700">Drafts</h3>
                            <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                                {draftProducts.length}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400">Not visible to customers</p>
                    </div>

                    <div className="p-4 space-y-3">
                        {draftProducts.length === 0 ? (
                            <p className="py-10 text-center text-sm text-gray-400 italic">
                                Drag products here to unpublish
                            </p>
                        ) : (
                            draftProducts.map((product, index) => (
                                <DraggableCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    isFirst={index === 0}
                                    isLast={index === draftProducts.length - 1}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDrop={(e) => handleDrop(e, 'draft', index)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleLive={() => performMove(product, product.isLive ? 'draft' : 'live')}
                                    onMove={(dir) => handleMoveInZone(product, dir)}
                                    variant="draft"
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            {showPreview && (
                <div className="rounded-2xl border-2 border-primary/30 bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 bg-primary/5 border-b border-primary/10">
                        <div className="flex items-center gap-3">
                            <Eye className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold text-primary">Storefront Preview</h3>
                        </div>
                        <p className="text-xs text-primary/60">This is how customers will see your products</p>
                    </div>

                    <div className="p-8 space-y-12 bg-gray-50">
                        {Object.keys(liveByModel).length === 0 ? (
                            <p className="py-20 text-center text-gray-400 italic">No live products to preview</p>
                        ) : (
                            Object.entries(liveByModel).map(([model, modelProducts]) => (
                                <section key={model} className="space-y-6">
                                    <div className="flex items-end justify-between border-b border-gray-200 pb-3">
                                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{model}</h2>
                                        <span className="text-sm text-gray-400">{modelProducts.length} Designs</span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {modelProducts.map(product => (
                                            <div key={product.id} className="group relative">
                                                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="mt-3 flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</h3>
                                                        <p className="text-xs text-gray-500 mt-0.5">{product.phoneModel}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-primary">R{product.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Draggable Card Component ---
function DraggableCard({
    product,
    index,
    isFirst,
    isLast,
    onDragStart,
    onDragEnd,
    onDrop,
    onEdit,
    onDelete,
    onToggleLive,
    onMove,
    variant,
}: {
    product: Product;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    onDragStart: (e: React.DragEvent, product: Product) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onToggleLive: () => void;
    onMove: (dir: 'up' | 'down') => void;
    variant: 'live' | 'draft';
}) {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, product)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => { e.stopPropagation(); onDrop(e); }}
            className={`flex items-center gap-4 rounded-xl p-3 border cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${variant === 'live'
                ? 'bg-white border-green-100'
                : 'bg-white border-gray-100 opacity-90'
                }`}
        >
            {/* Grab handle - visible on desktop, hidden on mobile */}
            <GripVertical className="h-5 w-5 text-gray-300 flex-shrink-0 hidden md:block" />

            <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded uppercase">{product.phoneModel}</span>
                    <span>R{product.price}</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Mobile reordering - Visible only on small screens */}
                <div className="flex items-center gap-1 md:hidden">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMove('up'); }}
                        disabled={isFirst}
                        className="p-1 px-1.5 text-gray-400 hover:text-primary disabled:opacity-30 border border-gray-100 rounded"
                    >
                        <ArrowLeft className="h-3 w-3 rotate-90" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMove('down'); }}
                        disabled={isLast}
                        className="p-1 px-1.5 text-gray-400 hover:text-primary disabled:opacity-30 border border-gray-100 rounded"
                    >
                        <ArrowLeft className="h-3 w-3 -rotate-90" />
                    </button>
                    <div className="w-px h-4 bg-gray-100 mx-1" />
                </div>

                {/* Status Toggle - Visible on all screens */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleLive(); }}
                    className={`p-1.5 rounded-lg transition-colors border ${variant === 'live'
                        ? 'text-green-600 border-green-100 hover:bg-green-50'
                        : 'text-gray-400 border-gray-100 hover:bg-gray-100'
                        }`}
                    title={variant === 'live' ? 'Move to Drafts' : 'Move to Live'}
                >
                    {variant === 'live' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/10 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit className="h-4 w-4" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
