import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Loader2,
  FileSpreadsheet,
  FileJson,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import ThreeBackground from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReports } from '@/hooks/useReports';
import { useFields } from '@/hooks/useFields';

const ReportsScreen = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedField, setSelectedField] = useState<string>('all');
  
  const { isGenerating, currentReport, generateReport, downloadCSV, exportToJSON } = useReports();
  const { fields } = useFields();

  const handleGenerate = () => {
    generateReport.mutate({
      reportType,
      fieldId: selectedField !== 'all' ? selectedField : undefined,
    });
  };

  const handleDownloadCSV = () => {
    downloadCSV.mutate({
      reportType,
      fieldId: selectedField !== 'all' ? selectedField : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <ThreeBackground />
      <Header title="Reports" />

      <div className="p-4 md:p-6 space-y-6">
        {/* Report Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Generate Report
              </CardTitle>
              <CardDescription>
                Create comprehensive reports with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Report Type</label>
                  <Select value={reportType} onValueChange={(v) => setReportType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Report</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Field</label>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fields</SelectItem>
                      {fields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Results */}
        {currentReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Report Summary
                    </CardTitle>
                    <CardDescription>
                      {new Date(currentReport.period.start).toLocaleDateString()} - {new Date(currentReport.period.end).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToJSON}>
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-foreground whitespace-pre-wrap">{currentReport.summary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {currentReport.satelliteAverages.healthScore.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Health Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-secondary/10 p-2">
                      <Calendar className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {currentReport.dataPoints.sensorReadings}
                      </p>
                      <p className="text-sm text-muted-foreground">Sensor Readings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {currentReport.alerts.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Alerts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-destructive/10 p-2">
                      <BarChart3 className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {currentReport.satelliteAverages.ndvi.toFixed(3)}
                      </p>
                      <p className="text-sm text-muted-foreground">Avg NDVI</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Metrics */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Sensor Averages */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Sensor Averages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(currentReport.sensorAverages).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium text-foreground">
                          {typeof value === 'number' ? value.toFixed(1) : value}
                          {key.includes('Moisture') || key.includes('humidity') ? '%' : ''}
                          {key.includes('temperature') ? '°C' : ''}
                          {['nitrogen', 'phosphorus', 'potassium'].includes(key) ? ' ppm' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Field Summary */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Fields Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentReport.fields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-foreground">{field.name}</p>
                          <p className="text-sm text-muted-foreground">{field.cropType}</p>
                        </div>
                        <span className="text-muted-foreground">{field.area} acres</span>
                      </div>
                    ))}
                    {currentReport.fields.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No fields in report</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts Summary */}
            {currentReport.alerts.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Alert History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentReport.alerts.slice(0, 10).map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          alert.severity === 'critical' ? 'bg-destructive/10' :
                          alert.severity === 'high' ? 'bg-accent/10' :
                          'bg-muted/50'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-foreground">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.isResolved ? 'bg-primary/10 text-primary' : 
                          alert.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
                          'bg-accent text-accent-foreground'
                        }`}>
                          {alert.isResolved ? 'Resolved' : alert.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!currentReport && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Report Generated</h3>
            <p className="text-muted-foreground mb-4">
              Select a report type and click "Generate Report" to create an AI-powered analysis of your farm data.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportsScreen;
