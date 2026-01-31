import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  MapPin,
  Leaf,
  Mail,
  Phone,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import ThreeBackground from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useFieldMode } from '@/contexts/FieldModeContext';
import { Camera } from 'lucide-react';

const ProfileScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { isFieldMode, toggleFieldMode } = useFieldMode();
  const { user, signOut } = useAuth();
  const { profile: globalProfile, updateProfile, deleteAccount, downloadData, loading } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    alerts: true,
    reports: true,
    updates: false,
  });

  // Local state for form editing
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editFarmName, setEditFarmName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Initialize local state when global profile loads
  useEffect(() => {
    if (globalProfile) {
      setEditName(globalProfile.fullName);
      setEditEmail(globalProfile.email);
      setEditPhone(globalProfile.phone);
      setEditFarmName(globalProfile.farmName);
      setEditLocation(globalProfile.location);

      // Load saved image from local storage
      const savedImage = localStorage.getItem(`profile_image_${user?.id}`);
      if (savedImage) setProfileImage(savedImage);
    }
  }, [globalProfile, user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem(`profile_image_${user?.id}`, base64String);
        toast({
          title: "Photo Updated",
          description: "Your profile photo has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({
      fullName: editName,
      email: editEmail,
      phone: editPhone,
    });
    setIsSaving(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    }
  };

  const handleSaveFarmSettings = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({
      farmName: editFarmName,
      location: editLocation,
    });
    setIsSaving(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Farm settings updated successfully!",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const { error } = await deleteAccount();
      if (!error) {
        navigate('/');
      }
    }
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: 'edit-profile' },
    { icon: MapPin, label: 'Farm Settings', action: 'farm-settings' },
    { icon: Bell, label: 'Notifications', action: 'notifications' },
    { icon: Shield, label: 'Privacy & Security', action: 'privacy' },
    { icon: HelpCircle, label: 'Help & Support', action: 'help' },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ThreeBackground />
      <Header title="Profile" />

      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <label
                htmlFor="profile-upload"
                className="cursor-pointer relative block rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg group"
                title="Click to upload profile photo"
              >
                <Avatar className="h-24 w-24 ring-4 ring-primary/20 group-hover:ring-primary/50 transition-all">
                  <AvatarImage src={profileImage || "./placeholder.svg"} alt="User" className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {globalProfile.fullName ? globalProfile.fullName.split(' ').map((n: string) => n[0]).join('') : (user?.email?.[0].toUpperCase() || 'U')}
                  </AvatarFallback>
                </Avatar>

                {/* Overlay on hover to indicate upload action */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10">
                  <Camera className="h-7 w-7 text-white mb-1" />
                  <span className="text-[8px] text-white font-black uppercase tracking-tighter">Upload</span>
                </div>
              </label>

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-foreground">{globalProfile.fullName || 'User'}</h2>
              <p className="text-muted-foreground">{globalProfile.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Leaf className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{globalProfile.farmName}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Fields', value: '6' },
            { label: 'Sensors', value: '12' },
            { label: 'Alerts', value: '3' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Theme & Field Mode Toggles */}
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-accent" />}
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle theme</p>
              </div>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>

          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium text-foreground">Field Mode</p>
                <p className="text-xs text-muted-foreground">High contrast for sunlight</p>
              </div>
            </div>
            <Switch checked={isFieldMode} onCheckedChange={toggleFieldMode} />
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {menuItems.map((item, index) => (
            <Dialog key={item.action}>
              <DialogTrigger asChild>
                <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </DialogTrigger>
              {index < menuItems.length - 1 && <Separator />}

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{item.label}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {item.action === 'edit-profile' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="mt-1" />
                      </div>
                      <Button className="w-full" onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                  {item.action === 'farm-settings' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="farmName">Farm Name</Label>
                        <Input id="farmName" value={editFarmName} onChange={(e) => setEditFarmName(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="mt-1" placeholder="e.g. Iowa, USA or 41.6, -93.7" />
                        <p className="text-[10px] text-muted-foreground mt-1 text-primary">Map will automatically center to this location.</p>
                      </div>
                      <Button className="w-full" onClick={handleSaveFarmSettings} disabled={isSaving}>
                        {isSaving ? "Updating..." : "Update Farm Settings"}
                      </Button>
                    </div>
                  )}
                  {item.action === 'notifications' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Alert Notifications</p>
                          <p className="text-sm text-muted-foreground">Get notified about critical alerts</p>
                        </div>
                        <Switch
                          checked={notifications.alerts}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, alerts: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weekly Reports</p>
                          <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                        </div>
                        <Switch
                          checked={notifications.reports}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, reports: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Product Updates</p>
                          <p className="text-sm text-muted-foreground">News about new features</p>
                        </div>
                        <Switch
                          checked={notifications.updates}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                        />
                      </div>
                    </div>
                  )}
                  {item.action === 'privacy' && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Your data is securely stored and encrypted. We never share your farm data with third parties without your consent.</p>
                      <Button variant="outline" className="w-full" onClick={downloadData}>
                        Download My Data
                      </Button>
                      <Separator />
                      <div className="pt-2">
                        <p className="text-sm font-semibold text-destructive mb-2">Danger Zone</p>
                        <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  )}
                  {item.action === 'help' && (
                    <div className="space-y-6">
                      <div className="text-center p-4 bg-muted/30 rounded-lg border border-primary/20">
                        <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                        <h4 className="font-bold text-lg mb-1">Email Support</h4>
                        <p className="text-sm text-muted-foreground mb-4">Click below to contact our support team</p>
                        <a
                          href="mailto:thrishanthreddygoli@gmail.com"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        >
                          thrishanthreddygoli@gmail.com
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* App Version */}
        <motion.p
          className="text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ArgoLens v1.0.0 • Made with 💚 for farmers
        </motion.p>
      </div>
    </div>
  );
};

export default ProfileScreen;
