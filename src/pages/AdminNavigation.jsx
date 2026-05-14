import React, { useState, useEffect, useCallback } from 'react';
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
const NavItemForm = ({ initial = {}, onSave, onCancel, isChild = false }) => {
  const [label, setLabel] = useState(initial.label || '');
  const [path, setPath] = useState(initial.path || '/');
  const [icon, setIcon] = useState(initial.icon || '');
  const [imageUrl, setImageUrl] = useState(initial.imageUrl || '');
  const [description, setDescription] = useState(initial.description || '');

  const submit = () => {
    if (!label.trim() || !path.trim()) { alert('Cần có Tên và Đường dẫn!'); return; }
    onSave({ label: label.trim(), path: path.trim(), icon, imageUrl, description });
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
        <button type="button" className="nav-btn nav-btn--save" onClick={submit} title="Lưu"><Check size={16} /></button>
        <button type="button" className="nav-btn nav-btn--cancel" onClick={onCancel} title="Hủy"><X size={16} /></button>
      </div>
    </div>
  );
};

// ============================================================
// SINGLE SORTABLE ITEM + ĐỆ QUY con
// ============================================================
const NavTreeItem = ({ item, depth = 0, onUpdate, onDelete, onAddChild, onReorder }) => {
  const [expanded, setExpanded] = useState(true);
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

  return (
    <div ref={setNodeRef} style={style} className={`nav-tree-item depth-${depth}`}>
      {/* Row chính */}
      <div className={`nav-row ${!item.isActive ? 'nav-row--hidden' : ''} ${isDragging ? 'nav-row--dragging' : ''}`}>
        {/* Indent theo cấp */}
        <div style={{ width: depth * 20, flexShrink: 0 }} />

        {/* Toggle expand */}
        {hasChildren ? (
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="expand-placeholder" />
        )}

        {/* Drag handle */}
        <button className="drag-handle" {...attributes} {...listeners} title="Kéo để sắp xếp">
          <GripVertical size={16} />
        </button>

        {/* Icon */}
        {item.icon && <DynIcon name={item.icon} size={16} className="nav-icon-display" />}

        {/* Label + path */}
        {editing ? (
          <NavItemForm
            initial={item}
            isChild={depth > 0}
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
            <button className="nav-btn" onClick={() => setAddingChild(!addingChild)} title="Thêm mục con">
              <Plus size={15} />
            </button>
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
        <div style={{ paddingLeft: (depth + 1) * 20 + 64 }}>
          <NavItemForm
            isChild
            onSave={(data) => { onAddChild(item.id, data); setAddingChild(false); setExpanded(true); }}
            onCancel={() => setAddingChild(false)}
          />
        </div>
      )}

      {/* Children (DnD riêng cho cấp này) */}
      {expanded && hasChildren && (
        <ChildrenList
          items={item.children}
          depth={depth + 1}
          parentId={item.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddChild={onAddChild}
          onReorder={onReorder}
        />
      )}
    </div>
  );
};

// DnD context bao quanh children cùng cấp
const ChildrenList = ({ items, depth, parentId, onUpdate, onDelete, onAddChild, onReorder }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder(parentId, reordered.map(i => i.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map(child => (
          <NavTreeItem
            key={child.id}
            item={child}
            depth={depth}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddChild={onAddChild}
            onReorder={onReorder}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

// ============================================================
// TRANG CHÍNH AdminNavigation
// ============================================================
const AdminNavigation = () => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingRoot, setAddingRoot] = useState(false);

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

  // Reorder children tại parentId (local state)
  const reorderLocal = (nodes, parentId, orderedIds) =>
    nodes.map(n => {
      if (n.id === parentId) {
        const sorted = orderedIds.map(id => n.children.find(c => c.id === id)).filter(Boolean);
        return { ...n, children: sorted };
      }
      return { ...n, children: reorderLocal(n.children || [], parentId, orderedIds) };
    });

  // Handlers gọi API + cập nhật local tree
  const handleUpdate = async (id, data) => {
    try {
      await fetch(`http://localhost:5000/api/navigation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      setTree(prev => updateNode(prev, id, data));
    } catch {
      alert('Lỗi cập nhật!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/navigation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setTree(prev => removeNode(prev, id));
    } catch {
      alert('Lỗi xóa!');
    }
  };

  const handleAddChild = async (parentId, data) => {
    try {
      const res = await fetch(`http://localhost:5000/api/navigation/${parentId}/children`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newItem = await res.json();
        setTree(prev => addChildLocal(prev, parentId, { ...newItem, children: [] }));
      }
    } catch {
      alert('Lỗi thêm mục con!');
    }
  };

  const handleReorder = async (parentId, orderedIds) => {
    // Cập nhật local trước, rồi gửi API
    if (parentId === 'root') {
      const sorted = orderedIds.map(id => tree.find(n => n.id === id)).filter(Boolean);
      setTree(sorted);
    } else {
      setTree(prev => reorderLocal(prev, parentId, orderedIds));
    }
    try {
      await fetch('http://localhost:5000/api/navigation/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderedIds }),
      });
    } catch {
      console.warn('Không thể lưu thứ tự menu.');
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
        const newItem = await res.json();
        setTree(prev => [...prev, { ...newItem, children: [] }]);
        setAddingRoot(false);
      }
    } catch {
      alert('Lỗi thêm mục!');
    }
  };

  // DnD cho cấp gốc (root level)
  const rootSensors = useSensors(useSensor(PointerSensor));
  const handleRootDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tree.findIndex(i => i.id === active.id);
    const newIndex = tree.findIndex(i => i.id === over.id);
    const reordered = arrayMove(tree, oldIndex, newIndex);
    handleReorder('root', reordered.map(i => i.id));
    setTree(reordered);
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
            <Layout size={22} /> Quản Lý Menu Điều Hướng
          </h1>
          <p>Kéo-thả để sắp xếp thứ tự. Bấm [+] để thêm mục con bất kỳ cấp nào.</p>
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
            ⠿ Kéo-thả sắp xếp trong cùng cấp &nbsp;·&nbsp; [+] Thêm con &nbsp;·&nbsp; ✏️ Sửa &nbsp;·&nbsp; 👁 Ẩn/Hiện
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
          <DndContext sensors={rootSensors} collisionDetection={closestCenter} onDragEnd={handleRootDragEnd}>
            <SortableContext items={tree.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {tree.map(item => (
                <NavTreeItem
                  key={item.id}
                  item={item}
                  depth={0}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onAddChild={handleAddChild}
                  onReorder={handleReorder}
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
