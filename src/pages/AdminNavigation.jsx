import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as LucideIcons from 'lucide-react';
import {
  GripVertical, Plus, Trash2, Eye, EyeOff, Save, Edit3,
  Check, X, ChevronDown, ChevronRight, Layout, Upload
} from 'lucide-react';
import './AdminNavigation.css';

// ============================================================
// ICON PICKER — Danh sách icon du lịch/ẩm thực có sẵn
// ============================================================
const ICON_LIST = [
  { name: 'MapPin', label: 'Địa điểm' }, { name: 'Map', label: 'Bản đồ' },
  { name: 'Compass', label: 'La bàn' }, { name: 'Mountain', label: 'Núi' },
  { name: 'Palmtree', label: 'Biển' }, { name: 'Building2', label: 'Thành phố' },
  { name: 'UtensilsCrossed', label: 'Ẩm thực' }, { name: 'Coffee', label: 'Cà phê' },
  { name: 'Soup', label: 'Món ăn' }, { name: 'Fish', label: 'Hải sản' },
  { name: 'Salad', label: 'Rau củ' }, { name: 'IceCream', label: 'Tráng miệng' },
  { name: 'Landmark', label: 'Di tích' }, { name: 'Church', label: 'Đền chùa' },
  { name: 'Globe', label: 'Thế giới' }, { name: 'Camera', label: 'Chụp ảnh' },
  { name: 'BookOpen', label: 'Bài viết' }, { name: 'Star', label: 'Nổi bật' },
  { name: 'Heart', label: 'Yêu thích' }, { name: 'Home', label: 'Trang chủ' },
  { name: 'Users', label: 'Về chúng tôi' }, { name: 'Phone', label: 'Liên hệ' },
  { name: 'Layers', label: 'Danh mục' }, { name: 'Tag', label: 'Nhãn' },
];

// Render icon từ tên
const DynIcon = ({ name, ...props }) => {
  if (!name) return null;
  const Comp = LucideIcons[name];
  return Comp ? <Comp {...props} /> : <span style={{ fontSize: 12, color: '#94a3b8' }}>{name}</span>;
};

// Component picker icon nhỏ gọn
const IconPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="icon-picker-wrap">
      <button type="button" className="icon-picker-trigger" onClick={() => setOpen(!open)} title="Chọn icon">
        {value ? <DynIcon name={value} size={16} /> : <LucideIcons.Smile size={16} color="#94a3b8" />}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="icon-picker-dropdown">
          <div className="icon-grid">
            <button type="button" className="icon-option none-opt" onClick={() => { onChange(''); setOpen(false); }}>
              <X size={14} /> Xóa
            </button>
            {ICON_LIST.map(ic => (
              <button
                key={ic.name}
                type="button"
                className={`icon-option ${value === ic.name ? 'selected' : ''}`}
                title={ic.label}
                onClick={() => { onChange(ic.name); setOpen(false); }}
              >
                <DynIcon name={ic.name} size={18} />
                <span>{ic.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// IMAGE UPLOAD nhỏ gọn
// ============================================================
const InlineImageUpload = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.imageUrl);
      }
    } catch {
      console.warn('Upload ảnh menu thất bại.');
    }
    finally { setUploading(false); }
  };

  return (
    <div className="inline-img-upload">
      {value ? (
        <div className="img-preview-wrap">
          <img src={`http://localhost:5000${value}`} alt="preview" className="img-preview" />
          <button type="button" className="img-remove" onClick={() => onChange('')}><X size={12} /></button>
        </div>
      ) : (
        <label className="img-upload-label" title="Upload ảnh">
          {uploading ? <LucideIcons.Loader2 size={16} className="spin" /> : <Upload size={14} />}
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </label>
      )}
    </div>
  );
};

// ============================================================
// FORM THÊM / SỬA một mục (dùng chung)
// ============================================================
const NavItemForm = ({ initial = {}, onSave, onCancel, isChild = false, rootOptions = [] }) => {
  const [label, setLabel] = useState(initial.label || '');
  const [path, setPath] = useState(initial.path || '/');
  const [icon, setIcon] = useState(initial.icon || '');
  const [imageUrl, setImageUrl] = useState(initial.imageUrl || '');
  const [description, setDescription] = useState(initial.description || '');
  const [parentId, setParentId] = useState(initial.parentId || '');

  const submit = () => {
    if (!label.trim() || !path.trim()) { alert('Cần có Tên và Đường dẫn!'); return; }
    onSave({ 
      label: label.trim(), 
      path: path.trim(), 
      icon, 
      imageUrl, 
      description,
      parentId: parentId ? parseInt(parentId) : null
    });
  };

  return (
    <div className={`nav-form ${isChild ? 'nav-form--child' : ''}`}>
      <div className="nav-form-row">
        <IconPicker value={icon} onChange={setIcon} />
        <input className="nav-form-input" placeholder="Tên hiển thị *" value={label} onChange={e => setLabel(e.target.value)} />
        <input className="nav-form-input nav-form-path" placeholder="/duong-dan *" value={path} onChange={e => setPath(e.target.value)} />
        {isChild && (
          <>
            <InlineImageUpload value={imageUrl} onChange={setImageUrl} />
            <input className="nav-form-input nav-form-desc" placeholder="Mô tả ngắn..." value={description} onChange={e => setDescription(e.target.value)} />
          </>
        )}
        {initial.id && (
          <select 
            className="nav-form-input nav-form-parent-select"
            value={parentId}
            onChange={e => setParentId(e.target.value)}
            style={{ width: '130px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            title="Chọn chuyên mục cha (Cấp cha-con)"
          >
            <option value="">-- Cấp cao nhất --</option>
            {rootOptions.filter(opt => opt.id !== initial.id).map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        )}
        <button type="button" className="nav-btn nav-btn--save" onClick={submit} title="Lưu"><Check size={16} /></button>
        <button type="button" className="nav-btn nav-btn--cancel" onClick={onCancel} title="Hủy"><X size={16} /></button>
      </div>
    </div>
  );
};

// ============================================================
// SINGLE SORTABLE ITEM + ĐỆ QUY con
// ============================================================
const FlatTreeItem = ({ item, collapsedIds, setCollapsedIds, rootOptions, onUpdate, onDelete, onAddChild }) => {
  const [editing, setEditing] = useState(false);
  const [addingChild, setAddingChild] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };

  const hasChildren = item.children && item.children.length > 0;
  const isCollapsed = collapsedIds.has(item.id);

  const toggleCollapse = () => {
    const next = new Set(collapsedIds);
    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      next.add(item.id);
    }
    setCollapsedIds(next);
  };

  return (
    <div ref={setNodeRef} style={style} className={`nav-tree-item depth-${item.depth}`}>
      {/* Row chính */}
      <div className={`nav-row ${!item.isActive ? 'nav-row--hidden' : ''} ${isDragging ? 'nav-row--dragging' : ''}`}>
        {/* Indent theo cấp */}
        <div style={{ width: item.depth * 24, flexShrink: 0 }} />

        {/* Toggle expand */}
        {hasChildren ? (
          <button type="button" className="expand-btn" onClick={toggleCollapse}>
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>
        ) : (
          <span className="expand-placeholder" />
        )}

        {/* Drag handle */}
        <button type="button" className="drag-handle" {...attributes} {...listeners} title="Kéo để sắp xếp và phân cấp">
          <GripVertical size={16} />
        </button>

        {/* Icon */}
        {item.icon && <DynIcon name={item.icon} size={16} className="nav-icon-display" />}

        {/* Label + path */}
        {editing ? (
          <NavItemForm
            initial={item}
            isChild={item.depth > 0}
            rootOptions={rootOptions}
            onSave={(data) => { onUpdate(item.id, data); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="nav-row-info">
            <span className="nav-label">{item.label}</span>
            <span className="nav-path">{item.path}</span>
            {item.description && <span className="nav-desc">{item.description}</span>}
          </div>
        )}

        {/* Thumbnail preview */}
        {item.imageUrl && !editing && (
          <img src={`http://localhost:5000${item.imageUrl}`} alt="" className="nav-thumb" />
        )}

        {/* Actions */}
        {!editing && (
          <div className="nav-row-actions">
            {item.depth === 0 && (
              <button className="nav-btn" onClick={() => setAddingChild(!addingChild)} title="Thêm mục con">
                <Plus size={15} />
              </button>
            )}
            <button className="nav-btn" onClick={() => setEditing(true)} title="Chỉnh sửa">
              <Edit3 size={15} />
            </button>
            <button
              className={`nav-btn ${item.isActive ? '' : 'nav-btn--inactive'}`}
              onClick={() => onUpdate(item.id, { isActive: !item.isActive })}
              title={item.isActive ? 'Ẩn' : 'Hiện'}
            >
              {item.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
            <button
              className="nav-btn nav-btn--delete"
              onClick={() => {
                const msg = hasChildren
                  ? `Xóa "${item.label}" sẽ xóa luôn ${item.children.length} mục con. Tiếp tục?`
                  : `Xóa mục "${item.label}"?`;
                if (window.confirm(msg)) onDelete(item.id);
              }}
              title="Xóa"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Form thêm con */}
      {addingChild && (
        <div style={{ paddingLeft: (item.depth + 1) * 24 + 64 }}>
          <NavItemForm
            isChild
            rootOptions={rootOptions}
            onSave={(data) => { onAddChild(item.id, data); setAddingChild(false); }}
            onCancel={() => setAddingChild(false)}
          />
        </div>
      )}
    </div>
  );
};

// ============================================================
// TRANG CHÍNH AdminNavigation
// ============================================================
const AdminNavigation = () => {
  const location = useLocation();
  const isCategoryView = location.pathname.includes('categories');

  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingRoot, setAddingRoot] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState(new Set());

  const token = localStorage.getItem('token');

  const fetchNav = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/navigation');
      if (res.ok) setTree(await res.json());
    } catch {
      console.warn('Không thể tải dữ liệu menu.');
    }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      void fetchNav();
    }, 0);
    return () => window.clearTimeout(fetchTimer);
  }, [fetchNav]);

  // Cập nhật 1 node trong cây (đệ quy)
  const updateNode = (nodes, id, data) =>
    nodes.map(n => n.id === id
      ? { ...n, ...data }
      : { ...n, children: updateNode(n.children || [], id, data) }
    );

  // Xóa node khỏi cây
  const removeNode = (nodes, id) =>
    nodes
      .filter(n => n.id !== id)
      .map(n => ({ ...n, children: removeNode(n.children || [], id) }));

  // Thêm con vào node cha (local state)
  const addChildLocal = (nodes, parentId, child) =>
    nodes.map(n => n.id === parentId
      ? { ...n, children: [...(n.children || []), child] }
      : { ...n, children: addChildLocal(n.children || [], parentId, child) }
    );
  const getFlatItems = useCallback((nodes, depth = 0, parentId = null) => {
    let list = [];
    for (const node of nodes) {
      list.push({ ...node, depth, parentId });
      if (node.children && node.children.length > 0 && !collapsedIds.has(node.id)) {
        list = list.concat(getFlatItems(node.children, depth + 1, node.id));
      }
    }
    return list;
  }, [collapsedIds]);

  const flatItems = getFlatItems(tree);

  const handleUpdate = async (id, data) => {
    try {
      const res = await fetch(`http://localhost:5000/api/navigation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchNav();
      }
    } catch {
      alert('Lỗi cập nhật!');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/navigation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchNav();
      }
    } catch {
      alert('Lỗi xóa mục!');
    }
  };

  const handleAddChild = async (parentId, data) => {
    try {
      const res = await fetch('http://localhost:5000/api/navigation/child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...data, parentId }),
      });
      if (res.ok) {
        await fetchNav();
      }
    } catch {
      alert('Lỗi thêm mục con!');
    }
  };

  const handleAddRoot = async (data) => {
    try {
      const res = await fetch('http://localhost:5000/api/navigation/root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setAddingRoot(false);
        await fetchNav();
      }
    } catch {
      alert('Lỗi thêm mục!');
    }
  };

  const rootSensors = useSensors(useSensor(PointerSensor));

  const handleFlatDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = flatItems.findIndex(i => i.id === active.id);
    const newIndex = flatItems.findIndex(i => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedFlat = arrayMove(flatItems, oldIndex, newIndex);
    const activeItem = flatItems[oldIndex];
    
    let newParentId = null;
    if (newIndex > 0) {
      const itemAbove = reorderedFlat[newIndex - 1];
      if (itemAbove.depth === 0) {
        if (itemAbove.children?.length > 0 || itemAbove.label === 'Chuyên Mục') {
          newParentId = itemAbove.id;
        } else {
          newParentId = null;
        }
      } else {
        newParentId = itemAbove.parentId;
      }
    } else {
      newParentId = null;
    }

    try {
      if (activeItem.parentId !== newParentId) {
        await fetch(`http://localhost:5000/api/navigation/${activeItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ parentId: newParentId }),
        });
      }

      const updatedFlat = reorderedFlat.map(item => {
        if (item.id === activeItem.id) return { ...item, parentId: newParentId };
        return item;
      });

      const groups = {};
      updatedFlat.forEach(item => {
        const key = item.parentId || 'root';
        if (!groups[key]) groups[key] = [];
        groups[key].push(item.id);
      });

      const reorderPromises = [];
      const newPKey = newParentId || 'root';
      reorderPromises.push(
        fetch('http://localhost:5000/api/navigation/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ orderedIds: groups[newPKey] }),
        })
      );

      const oldPKey = activeItem.parentId || 'root';
      if (oldPKey !== newPKey && groups[oldPKey]) {
        reorderPromises.push(
          fetch('http://localhost:5000/api/navigation/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ orderedIds: groups[oldPKey] }),
          })
        );
      }

      await Promise.all(reorderPromises);
      await fetchNav();
    } catch (e) {
      console.error('Lỗi kéo thả:', e);
      alert('Có lỗi xảy ra khi kéo thả!');
    }
  };

  const totalActive = (nodes) =>
    nodes.reduce((acc, n) => acc + (n.isActive ? 1 : 0) + totalActive(n.children || []), 0);
  const totalAll = (nodes) =>
    nodes.reduce((acc, n) => acc + 1 + totalAll(n.children || []), 0);

  if (loading) return <div className="admin-page"><p style={{ padding: '2rem' }}>Đang tải...</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layout size={22} /> {isCategoryView ? 'Quản Lý Chuyên Mục & Menu' : 'Quản Lý Menu Điều Hướng'}
          </h1>
          <p>{isCategoryView ? 'Kéo-thả để thay đổi thứ tự và phân cấp các chuyên mục trên thanh điều hướng.' : 'Kéo-thả để sắp xếp thứ tự. Bấm [+] để thêm mục con bất kỳ cấp nào.'}</p>
        </div>
        <button className="btn-outline" onClick={() => setAddingRoot(!addingRoot)}>
          <Plus size={18} /> Thêm mục gốc
        </button>
      </div>

      {/* Form thêm mục gốc */}
      {addingRoot && (
        <div className="admin-card" style={{ marginBottom: '1.25rem', border: '1px dashed #10b981' }}>
          <div className="admin-card-body">
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>Thêm mục gốc (cấp 1):</p>
            <NavItemForm onSave={handleAddRoot} onCancel={() => setAddingRoot(false)} />
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>
            Cây menu ({totalAll(tree)} mục · {totalActive(tree)} đang hiển thị)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            ⠿ Kéo-thả sắp xếp và phân cấp tự do &nbsp;·&nbsp; [+] Thêm con &nbsp;·&nbsp; ✏️ Sửa &nbsp;·&nbsp; 👁 Ẩn/Hiện
          </p>
        </div>

        {/* Header cột */}
        <div className="nav-col-header">
          <span style={{ width: 130 }} />
          <span>Tên</span>
          <span>Đường dẫn</span>
          <span>Thao tác</span>
        </div>

        <div className="admin-card-body" style={{ padding: '0.5rem 1rem 1.5rem' }}>
          <DndContext sensors={rootSensors} collisionDetection={closestCenter} onDragEnd={handleFlatDragEnd}>
            <SortableContext items={flatItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {flatItems.map(item => (
                <FlatTreeItem
                  key={item.id}
                  item={item}
                  collapsedIds={collapsedIds}
                  setCollapsedIds={setCollapsedIds}
                  rootOptions={tree.map(n => ({ id: n.id, label: n.label }))}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onAddChild={handleAddChild}
                />
              ))}
            </SortableContext>
          </DndContext>
          {tree.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              Chưa có mục menu nào. Bấm "Thêm mục gốc" để bắt đầu.
            </div>
          )}
        </div>
      </div>

      <div className="nav-preview-hint">
        💡 Thay đổi sẽ được lưu ngay khi bạn thực hiện thao tác. Header website tự cập nhật trong vài giây.
      </div>
    </div>
  );
};

export default AdminNavigation;
