import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

const COLORS = {
  primary: '#8884d8',
  secondary: '#82ca9d',
  tertiary: '#ffc658',
  quaternary: '#ff7300',
  linkedin: '#0077B5',
  email: '#34D399',
  phone: '#F59E0B',
  other: '#8B5CF6',
  success: '#10B981',
  pending: '#F59E0B',
  failed: '#EF4444'
};

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ReportingModule = () => {
  const { companies, communications, communicationMethods } = useStore();
  const [dateRange, setDateRange] = useState('30');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');

  const monthRange = useMemo(() => {
    const end = endOfMonth(new Date());
    const start = startOfMonth(subMonths(end, parseInt(dateRange)));
    return eachMonthOfInterval({ start, end });
  }, [dateRange]);

  const filteredCommunications = useMemo(() => {
    return communications.filter(comm => 
      (selectedCompany === 'all' || comm.companyId === selectedCompany) &&
      (selectedMethod === 'all' || comm.type === selectedMethod)
    );
  }, [communications, selectedCompany, selectedMethod]);

  // Communication Frequency Data with Method Breakdown
  const frequencyData = useMemo(() => {
    const data = communicationMethods.map(method => ({
      name: method.name,
      count: filteredCommunications.filter(c => c.type === method.name).length
    }));
    return data.sort((a, b) => b.count - a.count);
  }, [filteredCommunications, communicationMethods]);

  // Engagement Effectiveness with Response Rates
  const engagementData = useMemo(() => {
    return communicationMethods.map(method => {
      const methodComms = filteredCommunications.filter(c => c.type === method.name);
      const total = methodComms.length;
      const successful = methodComms.filter(c => c.status === 'successful').length;
      const responseRate = total > 0 ? (successful / total) * 100 : 0;

      return {
        name: method.name,
        value: responseRate,
        total,
        successful
      };
    }).filter(data => data.total > 0);
  }, [filteredCommunications, communicationMethods]);

  // Overdue Trends by Company
  const overdueData = useMemo(() => {
    return monthRange.map(month => {
      const monthData = {
        name: format(month, 'MMM yyyy')
      };

      companies.forEach(company => {
        const count = filteredCommunications.filter(comm =>
          comm.companyId === company.id &&
          comm.status === 'overdue' &&
          format(new Date(comm.date), 'MMM yyyy') === format(month, 'MMM yyyy')
        ).length;
        if (count > 0 || selectedCompany === company.id) {
          monthData[company.name] = count;
        }
      });

      return monthData;
    });
  }, [monthRange, companies, filteredCommunications, selectedCompany]);

  // Real-time Activity Log
  const activityLog = useMemo(() => {
    return filteredCommunications
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(comm => ({
        ...comm,
        companyName: companies.find(c => c.id === comm.companyId)?.name || 'Unknown'
      }));
  }, [filteredCommunications, companies]);

  const exportData = (exportFormat: 'csv' | 'pdf') => {
    if (exportFormat === 'csv') {
      const headers = ['Date', 'Company', 'Type', 'Status', 'Follow-up Required'];
      const rows = filteredCommunications.map(comm => [
        format(new Date(comm.date), 'yyyy-MM-dd'),
        companies.find(c => c.id === comm.companyId)?.name,
        comm.type,
        comm.status,
        comm.hasFollowUp ? 'Yes' : 'No'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `communications-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
    } else if (exportFormat === 'pdf') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 180 days</option>
            <option value="365">Last year</option>
          </select>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Companies</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="all">All Methods</option>
            {communicationMethods.map(method => (
              <option key={method.name} value={method.name}>{method.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => exportData('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => exportData('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Communication Frequency Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Communication Frequency</h3>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Effectiveness */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Engagement Effectiveness</h3>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overdue Communication Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Overdue Communication Trends</h3>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <AreaChart data={overdueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedCompany === 'all'
                  ? companies.map((company, index) => (
                      <Area
                        key={company.id}
                        type="monotone"
                        dataKey={company.name}
                        stackId="1"
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))
                  : companies
                      .filter(c => c.id === selectedCompany)
                      .map((company, index) => (
                        <Area
                          key={company.id}
                          type="monotone"
                          dataKey={company.name}
                          fill={PIE_COLORS[index]}
                          stroke={PIE_COLORS[index]}
                        />
                      ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Activity Log */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="overflow-y-auto max-h-[400px]">
            <div className="space-y-3">
              {activityLog.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium">{activity.companyName}</p>
                    <p className="text-sm text-gray-500">{activity.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {format(new Date(activity.date), 'MMM d, yyyy')}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'successful'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingModule;