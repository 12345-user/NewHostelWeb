import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, ImagePlus, X, Shield, Calendar, Users, BookOpen, LockKeyhole } from 'lucide-react';

type ActivityRecord = {
  id: number;
  title: string;
  date: string;
  participants?: string | null;
  summary?: string | null;
  description?: string | null;
  images?: string[];
};

type PersonRecord = {
  id: number;
  name: string;
  bio?: string | null;
  skills?: string | null;
  contact?: string | null;
  avatar?: string | null;
  images?: string[];
};

type ItemRecord = {
  id: number;
  name: string;
  date?: string | null;
  description?: string | null;
  image?: string | null;
};

type PermissionProps = {
  canDelete: boolean;
};

async function saveAdminRecord(
  path: string,
  data: Record<string, string | number | null | undefined>,
) {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) params.set(key, String(value));
  });
  params.set('t', String(Date.now()));

  const response = await fetch(`${path}?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  const result = (await response.json().catch(() => null)) as
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(result?.error || '保存失败，请稍后重试');
  }
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const canManage = user?.role === 'owner' || user?.role === 'admin';
  const canDelete = user?.role === 'owner';

  useEffect(() => {
    if (!authLoading && isAuthenticated && !canManage) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, canManage, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#EBE5DB] pt-24 px-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-12 bg-black/10 w-1/4 mb-4" />
          <div className="h-64 bg-black/10" />
        </div>
      </div>
    );
  }

  if (!canManage) return null;

  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-20">
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-[#C52A32]" />
                <h1 className="font-heading text-4xl md:text-5xl">管理后台</h1>
              </div>
              <p className="font-body text-base opacity-60">
                管理活动、人员和物品内容。负责人可删除，管理员只能新增和编辑。
              </p>
            </div>
            <div className="border-2 border-black bg-white px-4 py-3 font-ui text-sm">
              <div className="font-semibold">{user?.name}</div>
              <div className="mt-1 flex items-center gap-2 opacity-60">
                <LockKeyhole className="w-4 h-4" />
                {canDelete ? '负责人权限：新增、编辑、删除' : '管理员权限：新增、编辑'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-2 border-black rounded-none p-0 h-auto mb-6 sm:mb-8 overflow-x-auto">
            <TabsTrigger value="activities" className="shrink-0 rounded-none border-r-2 border-black px-4 py-3 data-[state=active]:bg-[#F6C347] data-[state=active]:shadow-none font-ui text-sm sm:px-6">
              <Calendar className="w-4 h-4 mr-2" />
              活动管理
            </TabsTrigger>
            <TabsTrigger value="people" className="shrink-0 rounded-none border-r-2 border-black px-4 py-3 data-[state=active]:bg-[#0E92A9] data-[state=active]:text-white data-[state=active]:shadow-none font-ui text-sm sm:px-6">
              <Users className="w-4 h-4 mr-2" />
              人员管理
            </TabsTrigger>
            <TabsTrigger value="items" className="shrink-0 rounded-none px-4 py-3 data-[state=active]:bg-[#5D9484] data-[state=active]:text-white data-[state=active]:shadow-none font-ui text-sm sm:px-6">
              <BookOpen className="w-4 h-4 mr-2" />
              物品管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities">
            <ActivityManager canDelete={canDelete} />
          </TabsContent>
          <TabsContent value="people">
            <PeopleManager canDelete={canDelete} />
          </TabsContent>
          <TabsContent value="items">
            <ItemManager canDelete={canDelete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ActivityManager({ canDelete }: PermissionProps) {
  const utils = trpc.useUtils();
  const { data: activities, isLoading } = trpc.activity.list.useQuery();
  const deleteMutation = trpc.activity.delete.useMutation({ onSuccess: () => utils.activity.list.invalidate() });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', date: '', participants: '', summary: '', description: '', images: [] as string[] });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({ title: '', date: '', participants: '', summary: '', description: '', images: [] });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setIsSaving(true);
    try {
      await saveAdminRecord('/api/admin/activity/save', {
        id: editingId ?? undefined,
        title: formData.title,
        date: formData.date,
        participants: formData.participants,
        summary: formData.summary,
        description: formData.description,
      });
      await utils.activity.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (activity: ActivityRecord) => {
    setFormData({
      title: activity.title,
      date: activity.date,
      participants: activity.participants || '',
      summary: activity.summary || '',
      description: activity.description || '',
      images: activity.images || [],
    });
    setEditingId(activity.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (canDelete && confirm('确定要删除这个活动吗？')) deleteMutation.mutate({ id });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setFormData((prev) => ({ ...prev, images: [...prev.images, reader.result as string] }));
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <ManagerHeader title="活动列表" actionLabel="新增活动" color="bg-[#C52A32]" onCreate={() => { resetForm(); setIsDialogOpen(true); }} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="max-h-[88vh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto bg-[#EBE5DB] border-2 border-black rounded-none">
          <DialogHeader><DialogTitle className="font-heading text-xl">{editingId ? '编辑活动' : '新增活动'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <Field label="标题"><Input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="日期"><Input type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="参与人员"><Input value={formData.participants} onChange={(e) => setFormData((p) => ({ ...p, participants: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="摘要"><Input value={formData.summary} onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="详细描述"><Textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={4} className="border-2 border-black rounded-none bg-white" /></Field>
            <ImageList images={formData.images} onRemove={(index) => setFormData((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }))} />
            <UploadButton multiple onChange={handleImageUpload} label="添加图片" />
            {errorMessage && <p className="border border-[#C52A32] bg-[#C52A32]/10 px-3 py-2 font-body text-sm text-[#8C1F25]">{errorMessage}</p>}
            <DialogActions editing={!!editingId} isSaving={isSaving} createText="创建活动" updateText="保存修改" onSubmit={handleSubmit} onCancel={() => { setIsDialogOpen(false); resetForm(); }} />
          </div>
        </DialogContent>
      </Dialog>
      <RecordList isLoading={isLoading}>
        {activities?.map((activity) => (
          <div key={activity.id} className="border-2 border-black bg-white p-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            {activity.images?.[0] && <img src={activity.images[0]} alt={activity.title} className="w-24 h-24 object-cover border border-black" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg">{activity.title}</h3>
              <p className="font-body text-sm opacity-60">{activity.date} / {activity.participants}</p>
              <p className="font-body text-sm opacity-50 truncate">{activity.summary}</p>
            </div>
            <ActionButtons canDelete={canDelete} onEdit={() => handleEdit(activity)} onDelete={() => handleDelete(activity.id)} />
          </div>
        ))}
      </RecordList>
    </div>
  );
}

function PeopleManager({ canDelete }: PermissionProps) {
  const utils = trpc.useUtils();
  const { data: people, isLoading } = trpc.people.list.useQuery();
  const deleteMutation = trpc.people.delete.useMutation({ onSuccess: () => utils.people.list.invalidate() });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', bio: '', skills: '', contact: '', avatar: '', images: [] as string[] });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', bio: '', skills: '', contact: '', avatar: '', images: [] });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setIsSaving(true);
    try {
      await saveAdminRecord('/api/admin/person/save', {
        id: editingId ?? undefined,
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills,
        contact: formData.contact,
      });
      await utils.people.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (person: PersonRecord) => {
    setFormData({ name: person.name, bio: person.bio || '', skills: person.skills || '', contact: person.contact || '', avatar: person.avatar || '', images: person.images || [] });
    setEditingId(person.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (canDelete && confirm('确定要删除这个人员吗？')) deleteMutation.mutate({ id });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <ManagerHeader title="人员列表" actionLabel="新增人员" color="bg-[#0E92A9]" onCreate={() => { resetForm(); setIsDialogOpen(true); }} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="max-h-[88vh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto bg-[#EBE5DB] border-2 border-black rounded-none">
          <DialogHeader><DialogTitle className="font-heading text-xl">{editingId ? '编辑人员' : '新增人员'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <Field label="姓名"><Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="简介"><Textarea value={formData.bio} onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))} rows={3} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="技能/标签（逗号分隔）"><Input value={formData.skills} onChange={(e) => setFormData((p) => ({ ...p, skills: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="联系方式"><Input value={formData.contact} onChange={(e) => setFormData((p) => ({ ...p, contact: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            {formData.avatar && <img src={formData.avatar} alt="头像预览" className="w-20 h-20 object-cover border-2 border-black" />}
            <UploadButton onChange={handleAvatarUpload} label="上传头像" />
            {errorMessage && <p className="border border-[#C52A32] bg-[#C52A32]/10 px-3 py-2 font-body text-sm text-[#8C1F25]">{errorMessage}</p>}
            <DialogActions editing={!!editingId} isSaving={isSaving} createText="创建人员" updateText="保存修改" onSubmit={handleSubmit} onCancel={() => { setIsDialogOpen(false); resetForm(); }} />
          </div>
        </DialogContent>
      </Dialog>
      <RecordList isLoading={isLoading}>
        {people?.map((person) => (
          <div key={person.id} className="border-2 border-black bg-white p-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            {person.avatar && <img src={person.avatar} alt={person.name} className="w-16 h-16 object-cover border border-black" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg">{person.name}</h3>
              <p className="font-body text-sm opacity-60 line-clamp-1">{person.bio}</p>
              <p className="font-body text-xs opacity-40">{person.skills}</p>
            </div>
            <ActionButtons canDelete={canDelete} onEdit={() => handleEdit(person)} onDelete={() => handleDelete(person.id)} />
          </div>
        ))}
      </RecordList>
    </div>
  );
}

function ItemManager({ canDelete }: PermissionProps) {
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.item.list.useQuery();
  const createMutation = trpc.item.create.useMutation({ onSuccess: () => utils.item.list.invalidate() });
  const updateMutation = trpc.item.update.useMutation({ onSuccess: () => utils.item.list.invalidate() });
  const deleteMutation = trpc.item.delete.useMutation({ onSuccess: () => utils.item.list.invalidate() });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', date: '', description: '', image: '' });

  const resetForm = () => {
    setFormData({ name: '', date: '', description: '', image: '' });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) updateMutation.mutate({ id: editingId, ...formData });
    else createMutation.mutate(formData);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item: ItemRecord) => {
    setFormData({ name: item.name, date: item.date || '', description: item.description || '', image: item.image || '' });
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (canDelete && confirm('确定要删除这个物品吗？')) deleteMutation.mutate({ id });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <ManagerHeader title="物品列表" actionLabel="新增物品" color="bg-[#5D9484]" onCreate={() => { resetForm(); setIsDialogOpen(true); }} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="max-h-[88vh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto bg-[#EBE5DB] border-2 border-black rounded-none">
          <DialogHeader><DialogTitle className="font-heading text-xl">{editingId ? '编辑物品' : '新增物品'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <Field label="名称"><Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="日期"><Input type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} className="border-2 border-black rounded-none bg-white" /></Field>
            <Field label="介绍"><Textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={4} className="border-2 border-black rounded-none bg-white" /></Field>
            {formData.image && <img src={formData.image} alt="物品预览" className="w-20 h-20 object-cover border-2 border-black" />}
            <UploadButton onChange={handleImageUpload} label="上传图片" />
            <DialogActions editing={!!editingId} createText="创建物品" updateText="保存修改" onSubmit={handleSubmit} onCancel={() => { setIsDialogOpen(false); resetForm(); }} />
          </div>
        </DialogContent>
      </Dialog>
      <RecordList isLoading={isLoading}>
        {items?.map((item) => (
          <div key={item.id} className="border-2 border-black bg-white p-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            {item.image && <img src={item.image} alt={item.name} className="w-20 h-20 object-cover border border-black" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg">{item.name}</h3>
              <p className="font-body text-sm opacity-60">{item.date}</p>
              <p className="font-body text-sm opacity-50 line-clamp-2">{item.description}</p>
            </div>
            <ActionButtons canDelete={canDelete} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
          </div>
        ))}
      </RecordList>
    </div>
  );
}

function ManagerHeader({ title, actionLabel, color, onCreate }: { title: string; actionLabel: string; color: string; onCreate: () => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
      <h2 className="font-heading text-2xl">{title}</h2>
      <Button onClick={onCreate} className={`${color} hover:brightness-90 text-white border-2 border-black rounded-none font-ui w-full sm:w-auto`}>
        <Plus className="w-4 h-4 mr-2" />
        {actionLabel}
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-ui text-sm mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function UploadButton({ label, multiple, onChange }: { label: string; multiple?: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-ui text-sm">
      <ImagePlus className="w-4 h-4" />
      {label}
      <input type="file" accept="image/*" multiple={multiple} onChange={onChange} className="hidden" />
    </label>
  );
}

function ImageList({ images, onRemove }: { images: string[]; onRemove: (index: number) => void }) {
  if (images.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {images.map((img, index) => (
        <div key={`${img}-${index}`} className="relative w-20 h-20 border-2 border-black">
          <img src={img} alt="" className="w-full h-full object-cover" />
          <button onClick={() => onRemove(index)} className="absolute -top-2 -right-2 w-5 h-5 bg-[#C52A32] text-white rounded-full flex items-center justify-center">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function DialogActions({ editing, isSaving, createText, updateText, onSubmit, onCancel }: { editing: boolean; isSaving?: boolean; createText: string; updateText: string; onSubmit: () => void; onCancel: () => void }) {
  return (
    <div className="flex flex-col gap-3 pt-4 sm:flex-row">
      <Button onClick={onSubmit} disabled={isSaving} className="bg-black text-white hover:bg-[#C52A32] border-2 border-black rounded-none font-ui min-h-11 disabled:bg-black/50">
        {isSaving ? '保存中...' : editing ? updateText : createText}
      </Button>
      <Button onClick={onCancel} disabled={isSaving} variant="outline" className="border-2 border-black rounded-none font-ui min-h-11">
        取消
      </Button>
    </div>
  );
}

function RecordList({ isLoading, children }: { isLoading: boolean; children: ReactNode }) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((item) => <div key={item} className="h-20 bg-black/10" />)}
      </div>
    );
  }

  return <div className="space-y-4">{children}</div>;
}

function ActionButtons({ canDelete, onEdit, onDelete }: { canDelete: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-2 sm:ml-auto">
      <Button onClick={onEdit} variant="outline" size="sm" className="border-2 border-black rounded-none">
        <Edit className="w-4 h-4" />
      </Button>
      {canDelete && (
        <Button onClick={onDelete} variant="outline" size="sm" className="border-2 border-[#C52A32] text-[#C52A32] hover:bg-[#C52A32] hover:text-white rounded-none">
          <Trash className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
