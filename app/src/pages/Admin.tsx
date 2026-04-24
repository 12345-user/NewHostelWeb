import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, ImagePlus, X, Shield, Calendar, Users, BookOpen } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!authLoading && isAuthenticated && !isAdmin) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

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

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#EBE5DB] pt-20">
      <div className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#C52A32]" />
            <h1 className="font-heading text-4xl md:text-5xl">管理后台</h1>
          </div>
          <p className="font-body text-base opacity-60">
            管理活动、人员与物品内容
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-2 border-black rounded-none p-0 h-auto mb-8">
            <TabsTrigger
              value="activities"
              className="rounded-none border-r-2 border-black px-6 py-3 data-[state=active]:bg-[#F6C347] data-[state=active]:shadow-none font-ui text-sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              活动管理
            </TabsTrigger>
            <TabsTrigger
              value="people"
              className="rounded-none border-r-2 border-black px-6 py-3 data-[state=active]:bg-[#0E92A9] data-[state=active]:text-white data-[state=active]:shadow-none font-ui text-sm"
            >
              <Users className="w-4 h-4 mr-2" />
              人员管理
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="rounded-none px-6 py-3 data-[state=active]:bg-[#5D9484] data-[state=active]:text-white data-[state=active]:shadow-none font-ui text-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              物品管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities">
            <ActivityManager />
          </TabsContent>
          <TabsContent value="people">
            <PeopleManager />
          </TabsContent>
          <TabsContent value="items">
            <ItemManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ActivityManager() {
  const utils = trpc.useUtils();
  const { data: activities, isLoading } = trpc.activity.list.useQuery();
  const createMutation = trpc.activity.create.useMutation({
    onSuccess: () => utils.activity.list.invalidate(),
  });
  const updateMutation = trpc.activity.update.useMutation({
    onSuccess: () => utils.activity.list.invalidate(),
  });
  const deleteMutation = trpc.activity.delete.useMutation({
    onSuccess: () => utils.activity.list.invalidate(),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    participants: '',
    summary: '',
    description: '',
    images: [] as string[],
  });

  const resetForm = () => {
    setFormData({ title: '', date: '', participants: '', summary: '', description: '', images: [] });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (activity: any) => {
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
    if (confirm('确定要删除这个活动吗？')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      // For now, use the file name as a reference. In production, you'd upload to server.
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl">活动列表</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-[#C52A32] hover:bg-[#a8222a] text-white border-2 border-black rounded-none font-ui"
            >
              <Plus className="w-4 h-4 mr-2" />
              新增活动
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#EBE5DB] border-2 border-black rounded-none">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingId ? '编辑活动' : '新增活动'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="font-ui text-sm mb-1 block">标题</label>
                <Input
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">日期</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">参与人员</label>
                <Input
                  value={formData.participants}
                  onChange={e => setFormData(prev => ({ ...prev, participants: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">摘要</label>
                <Input
                  value={formData.summary}
                  onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">详细描述</label>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">图片</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 border-2 border-black">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, idx) => idx !== i),
                        }))}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-[#C52A32] text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-ui text-sm">
                  <ImagePlus className="w-4 h-4" />
                  添加图片
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  className="bg-black text-white hover:bg-[#C52A32] border-2 border-black rounded-none font-ui"
                >
                  {editingId ? '保存修改' : '创建活动'}
                </Button>
                <Button
                  onClick={() => { setIsDialogOpen(false); resetForm(); }}
                  variant="outline"
                  className="border-2 border-black rounded-none font-ui"
                >
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-black/10" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {activities?.map(activity => (
            <div key={activity.id} className="border-2 border-black bg-white p-4 flex items-start gap-4">
              {activity.images?.[0] && (
                <img src={activity.images[0]} alt={activity.title} className="w-24 h-24 object-cover border border-black" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg">{activity.title}</h3>
                <p className="font-body text-sm opacity-60">{activity.date} · {activity.participants}</p>
                <p className="font-body text-sm opacity-50 truncate">{activity.summary}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(activity)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-black rounded-none"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(activity.id)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#C52A32] text-[#C52A32] hover:bg-[#C52A32] hover:text-white rounded-none"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PeopleManager() {
  const utils = trpc.useUtils();
  const { data: people, isLoading } = trpc.people.list.useQuery();
  const createMutation = trpc.people.create.useMutation({
    onSuccess: () => utils.people.list.invalidate(),
  });
  const updateMutation = trpc.people.update.useMutation({
    onSuccess: () => utils.people.list.invalidate(),
  });
  const deleteMutation = trpc.people.delete.useMutation({
    onSuccess: () => utils.people.list.invalidate(),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    contact: '',
    avatar: '',
    images: [] as string[],
  });

  const resetForm = () => {
    setFormData({ name: '', bio: '', skills: '', contact: '', avatar: '', images: [] });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (person: any) => {
    setFormData({
      name: person.name,
      bio: person.bio || '',
      skills: person.skills || '',
      contact: person.contact || '',
      avatar: person.avatar || '',
      images: person.images || [],
    });
    setEditingId(person.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这个人员吗？')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'images') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (field === 'avatar') {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl">人员列表</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-[#0E92A9] hover:bg-[#0b7a8d] text-white border-2 border-black rounded-none font-ui"
            >
              <Plus className="w-4 h-4 mr-2" />
              新增人员
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#EBE5DB] border-2 border-black rounded-none">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingId ? '编辑人员' : '新增人员'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="font-ui text-sm mb-1 block">姓名</label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">简介</label>
                <Textarea
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">技能（逗号分隔）</label>
                <Input
                  value={formData.skills}
                  onChange={e => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">联系方式</label>
                <Input
                  value={formData.contact}
                  onChange={e => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">头像</label>
                <div className="flex items-center gap-4">
                  {formData.avatar && (
                    <img src={formData.avatar} alt="Avatar" className="w-16 h-16 object-cover border-2 border-black" />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-ui text-sm">
                    <ImagePlus className="w-4 h-4" />
                    上传头像
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'avatar')} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  className="bg-black text-white hover:bg-[#0E92A9] border-2 border-black rounded-none font-ui"
                >
                  {editingId ? '保存修改' : '创建人员'}
                </Button>
                <Button
                  onClick={() => { setIsDialogOpen(false); resetForm(); }}
                  variant="outline"
                  className="border-2 border-black rounded-none font-ui"
                >
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-black/10" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {people?.map(person => (
            <div key={person.id} className="border-2 border-black bg-white p-4 flex items-start gap-4">
              {person.avatar && (
                <img src={person.avatar} alt={person.name} className="w-16 h-16 object-cover border border-black" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg">{person.name}</h3>
                <p className="font-body text-sm opacity-60 line-clamp-1">{person.bio}</p>
                <p className="font-body text-xs opacity-40">{person.skills}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(person)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-black rounded-none"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(person.id)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#C52A32] text-[#C52A32] hover:bg-[#C52A32] hover:text-white rounded-none"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ItemManager() {
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.item.list.useQuery();
  const createMutation = trpc.item.create.useMutation({
    onSuccess: () => utils.item.list.invalidate(),
  });
  const updateMutation = trpc.item.update.useMutation({
    onSuccess: () => utils.item.list.invalidate(),
  });
  const deleteMutation = trpc.item.delete.useMutation({
    onSuccess: () => utils.item.list.invalidate(),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    image: '',
  });

  const resetForm = () => {
    setFormData({ name: '', date: '', description: '', image: '' });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      date: item.date || '',
      description: item.description || '',
      image: item.image || '',
    });
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这个物品吗？')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl">物品列表</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-[#5D9484] hover:bg-[#4a7869] text-white border-2 border-black rounded-none font-ui"
            >
              <Plus className="w-4 h-4 mr-2" />
              新增物品
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#EBE5DB] border-2 border-black rounded-none">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingId ? '编辑物品' : '新增物品'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="font-ui text-sm mb-1 block">名称</label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">日期</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">介绍</label>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="border-2 border-black rounded-none bg-white"
                />
              </div>
              <div>
                <label className="font-ui text-sm mb-1 block">图片</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img src={formData.image} alt="Item" className="w-20 h-20 object-cover border-2 border-black" />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-ui text-sm">
                    <ImagePlus className="w-4 h-4" />
                    上传图片
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  className="bg-black text-white hover:bg-[#5D9484] border-2 border-black rounded-none font-ui"
                >
                  {editingId ? '保存修改' : '创建物品'}
                </Button>
                <Button
                  onClick={() => { setIsDialogOpen(false); resetForm(); }}
                  variant="outline"
                  className="border-2 border-black rounded-none font-ui"
                >
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-black/10" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {items?.map(item => (
            <div key={item.id} className="border-2 border-black bg-white p-4 flex items-start gap-4">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover border border-black" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg">{item.name}</h3>
                <p className="font-body text-sm opacity-60">{item.date}</p>
                <p className="font-body text-sm opacity-50 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(item)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-black rounded-none"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#C52A32] text-[#C52A32] hover:bg-[#C52A32] hover:text-white rounded-none"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
