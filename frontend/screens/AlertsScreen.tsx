import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Bug,
  Droplets,
  Thermometer,
  CloudRain,
  Leaf,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import ThreeBackground from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateAlerts, generateSensorData, generatePestRisks, generateCropHealth } from '@/lib/mockData';

type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
type StatusFilter = 'all' | 'active' | 'resolved';


const AlertsScreen = () => {
  const [alerts, setAlerts] = useState<ReturnType<typeof generateAlerts>>([]);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  useEffect(() => {
    // Generate initial alerts
    const sensor = generateSensorData();
    const health = generateCropHealth();
    const risks = generatePestRisks(sensor.humidity, sensor.temperature, health.ndvi);
    const initialAlerts = generateAlerts(sensor, risks);

    // Add more mock alerts for variety
    const extendedAlerts = [
      ...initialAlerts,
      {
        id: 'alert-extra-1',
        type: 'pest_risk' as const,
        severity: 'high' as const,
        title: 'Aphid Infestation Detected',
        message: 'High aphid activity detected in Southeast Field. Recommend immediate treatment.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        field: 'Southeast Field',
      },
      {
        id: 'alert-extra-2',
        type: 'nutrient' as const,
        severity: 'medium' as const,
        title: 'Nitrogen Deficiency',
        message: 'Low nitrogen levels in Valley Field. Schedule fertilizer application.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isRead: true,
        field: 'Valley Field',
      },
      {
        id: 'alert-extra-3',
        type: 'weather' as const,
        severity: 'low' as const,
        title: 'Frost Warning',
        message: 'Overnight frost expected. Consider protective measures for sensitive crops.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        isRead: true,
        field: 'All Fields',
      },
    ];

    setAlerts(extendedAlerts);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'pest_risk':
        return Bug;
      case 'water':
        return Droplets;
      case 'temperature':
        return Thermometer;
      case 'weather':
        return CloudRain;
      case 'nutrient':
        return Leaf;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-accent text-accent-foreground';
      case 'medium':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (statusFilter === 'active' && alert.isRead) return false;
    if (statusFilter === 'resolved' && !alert.isRead) return false;
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleResolve = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    active: alerts.filter(a => !a.isRead).length,
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ThreeBackground />
      <Header title="Alerts" />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Alerts', value: alertStats.total, icon: Bell, color: 'text-foreground' },
            { label: 'Critical', value: alertStats.critical, icon: XCircle, color: 'text-destructive' },
            { label: 'High Priority', value: alertStats.high, icon: AlertTriangle, color: 'text-accent' },
            { label: 'Active', value: alertStats.active, icon: Bell, color: 'text-primary' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg bg-muted p-2 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as SeverityFilter)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredAlerts.map((alert, index) => {
              const Icon = getAlertIcon(alert.type);
              const isExpanded = selectedAlert === alert.id;

              return (
                <motion.div
                  key={alert.id}
                  className={`glass-card overflow-hidden ${alert.isRead ? 'opacity-60' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: alert.isRead ? 0.6 : 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedAlert(isExpanded ? null : alert.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-2 ${alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                        alert.severity === 'high' ? 'bg-accent/10 text-accent' :
                          'bg-muted text-muted-foreground'
                        }`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-semibold text-foreground truncate">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.isRead && (
                            <Badge variant="outline" className="text-primary border-primary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{alert.field || 'Unknown Field'}</span>
                          <span>•</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      {!alert.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolve(alert.id);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 bg-muted/30 space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2">Details</h5>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-2">Recommendations</h5>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              <li>Monitor the affected area closely</li>
                              <li>Consider preventive treatment options</li>
                              <li>Update sensor calibration if needed</li>
                            </ul>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">Take Action</Button>
                            <Button size="sm" variant="outline">View on Map</Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredAlerts.length === 0 && (
            <motion.div
              className="glass-card p-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">All Clear!</h3>
              <p className="text-muted-foreground">No alerts match your current filters.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsScreen;
