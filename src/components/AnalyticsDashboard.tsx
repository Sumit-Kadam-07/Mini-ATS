import React from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { TrendingUp, Users, Award, Clock, Target, Briefcase } from 'lucide-react'
import { Analytics } from '../types/candidate'

interface AnalyticsDashboardProps {
  analytics: Analytics
}

const COLORS = ['#3B82F6', '#EAB308', '#10B981', '#EF4444']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const statusData = analytics.statusBreakdown.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    percentage: item.percentage,
    color: COLORS[analytics.statusBreakdown.indexOf(item)]
  }))

  const roleData = analytics.roleBreakdown.slice(0, 8) // Show top 8 roles

  const inProgressCount = analytics.statusBreakdown.find(s => s.status === 'interview')?.count || 0
  const offersCount = analytics.statusBreakdown.find(s => s.status === 'offer')?.count || 0
  const rejectedCount = analytics.statusBreakdown.find(s => s.status === 'rejected')?.count || 0
  const conversionRate = analytics.totalCandidates > 0 
    ? Math.round((offersCount / analytics.totalCandidates) * 100) 
    : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Insights into your recruitment pipeline</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-md transition-all duration-200 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalCandidates}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-all duration-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">{inProgressCount}</p>
              <p className="text-xs text-gray-500 mt-1">Currently interviewing</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-all duration-200 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offers Made</p>
              <p className="text-3xl font-bold text-gray-900">{offersCount}</p>
              <p className="text-xs text-gray-500 mt-1">Success rate: {conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-all duration-200 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Experience</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.averageExperience}</p>
              <p className="text-xs text-gray-500 mt-1">years</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Breakdown Pie Chart */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Candidates by Status</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Breakdown Bar Chart */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center space-x-2 mb-6">
            <Briefcase className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Roles</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="role" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Pipeline Health</h4>
          <p className="text-sm text-gray-600">
            {analytics.totalCandidates > 0 ? 'Active' : 'No candidates'} recruitment pipeline
          </p>
        </div>

        <div className="card text-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
          <p className="text-sm text-gray-600">
            {conversionRate}% of candidates receive offers
          </p>
        </div>

        <div className="card text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Experience Level</h4>
          <p className="text-sm text-gray-600">
            {analytics.averageExperience < 3 ? 'Junior' : 
             analytics.averageExperience < 7 ? 'Mid-level' : 'Senior'} candidates on average
          </p>
        </div>
      </div>
    </div>
  )
}