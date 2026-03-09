'use client'

import { useState } from 'react'

// Proposition 1: Customer Information + Contact Details
const PROPOSITION_1_COLUMNS = {
  'Customer Information': [
    'Customer Name/Company Name',
    'Type of Business (Semiconductor Foundry/Integrated Device Manufacturer (IDM))',
    'Primary Industry Segment (Electronics and Semiconductor/Automotive/Telecommunications/Aerospace)',
    'Primary Device Focus Power Devices (MOSFET, IGBT, SiC MOSFET)/Logic Devices (CPU)',
    'Throughput Capacity (Wafers per month (WPM)/Fab utilization rate)',
  ],
  'Contact Details': [
    'Key Contact Person',
    'Designation/Role',
    'Email Address',
    'Phone/WhatsApp Number',
    'LinkedIn Profile',
    'Website URL',
  ],
}

// Proposition 2: Customer Information + Contact Details + Procurement & Purchase Metrics
const PROPOSITION_2_COLUMNS = {
  'Customer Information': [
    'Customer Name/Company Name',
    'Type of Business (Semiconductor Foundry/Integrated Device Manufacturer (IDM))',
    'Primary Industry Segment (Electronics and Semiconductor)',
    'Primary Device Focus Power Devices (MOSFET)',
    'Throughput Capacity (Wafers per month (WPM)/Fab utilization)',
  ],
  'Contact Details': [
    'Key Contact Person',
    'Designation/Role',
    'Email Address',
    'Phone/WhatsApp Number',
    'LinkedIn Profile',
    'Website URL',
  ],
  'Procurement & Purchase Metrics': [
    'Annual Semiconductor or Materials Procurement Budget (US$)',
    'Annual Epitaxial Wafer Procurement Budget',
    'Preferred Procurement Model (OEM direct supply/Long term supply agreement/Distributor)',
    'Average Procurement Lead Time',
  ],
}

// Proposition 3: Everything from Proposition 2 + Digital & Technology + Future Demand + CMI Insights
const PROPOSITION_3_COLUMNS = {
  'Customer Information': [
    'Customer Name/Company Name',
    'Type of Business (Semiconductor Foundry/Integrated Device Manufacturer (IDM))',
    'Primary Industry Segment (Electronics and Semiconductor)',
    'Primary Device Focus Power Devices (MOSFET)',
    'Throughput Capacity (Wafers per month (WPM)/Fab utilization)',
  ],
  'Contact Details': [
    'Key Contact Person',
    'Designation/Role',
    'Email Address',
    'Phone/WhatsApp Number',
    'LinkedIn Profile',
    'Website URL',
  ],
  'Procurement & Purchase Metrics': [
    'Annual Semiconductor or Materials Procurement Budget (US$)',
    'Annual Epitaxial Wafer Procurement Budget',
    'Preferred Procurement Model (OEM direct supply/Long term supply agreement/Distributor)',
    'Average Procurement Lead Time',
    'Key Purchase Drivers (Yield improvement/Device performance/Cost per wafer)',
    'Robotics Adoption Level (Wafer handling robotics/Automated wafer transport systems)',
    'MES/ERP Integration (Manufacturing Execution System integration/ERP integration)',
  ],
  'Digital & Technology Adoption Metrics': [
    'AI Driven Process Control Adoption',
    'Digital Twin and Smart Fab Technologies',
    'Yield Monitoring and Real Time Analytics Systems',
  ],
  'Future Demand & Expansion Metrics': [
    'Planned Fab Capacity Expansion (Next 3 to 5 Years)',
    'Planned Wafer Production Increase',
    'Planned Technology Node Transition',
    'Regional Fab Expansion Plans',
  ],
  'CMI Insights': [
    'Customer Benchmarking Summary (Potential Customers)',
    'Additional Comments/Notes By CMI team',
  ],
}

const SECTION_COLORS: Record<string, { header: string; bg: string }> = {
  'Customer Information': { header: 'bg-[#F4CCCC]', bg: 'bg-[#FFF2F2]' },
  'Contact Details': { header: 'bg-[#D5EAD8]', bg: 'bg-[#F0F8F0]' },
  'Procurement & Purchase Metrics': { header: 'bg-[#FCE5CD]', bg: 'bg-[#FFF8F0]' },
  'Digital & Technology Adoption Metrics': { header: 'bg-[#D0E0F0]', bg: 'bg-[#F0F5FA]' },
  'Future Demand & Expansion Metrics': { header: 'bg-[#D9EAD3]', bg: 'bg-[#F0F8EC]' },
  'CMI Insights': { header: 'bg-[#EAD1DC]', bg: 'bg-[#F8F0F4]' },
}

const ROW_COUNT = 10

interface PropositionTableProps {
  title: string
  columns: Record<string, string[]>
  rowCount?: number
}

function PropositionTable({ title, columns, rowCount = ROW_COUNT }: PropositionTableProps) {
  const allColumns = Object.entries(columns).flatMap(([section, cols]) =>
    cols.map(col => ({ section, name: col }))
  )
  const sections = Object.entries(columns)

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="border-collapse text-xs" style={{ minWidth: '100%' }}>
          {/* Section header row */}
          <thead>
            <tr>
              {sections.map(([section, cols]) => {
                const color = SECTION_COLORS[section] || { header: 'bg-gray-200', bg: 'bg-gray-50' }
                return (
                  <th
                    key={section}
                    colSpan={cols.length}
                    className={`${color.header} text-center font-bold text-[11px] text-black px-2 py-2 border border-gray-300`}
                  >
                    {section}
                  </th>
                )
              })}
            </tr>
            {/* Column header row */}
            <tr>
              {allColumns.map((col, idx) => {
                const color = SECTION_COLORS[col.section] || { header: 'bg-gray-200', bg: 'bg-gray-50' }
                return (
                  <th
                    key={idx}
                    className={`${color.bg} text-center font-semibold text-[10px] text-black px-3 py-2 border border-gray-300 min-w-[120px]`}
                    style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                  >
                    {col.name}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {allColumns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className="text-center text-[11px] text-gray-500 px-2 py-3 border border-gray-200"
                  >
                    {colIdx === 0 ? `Customer ${rowIdx + 1}` : 'xx'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CustomerIntelligencePropositions() {
  const [activeProposition, setActiveProposition] = useState<1 | 2 | 3>(1)

  const propositions = [
    { id: 1 as const, label: 'Proposition 1 - Basic', description: 'Customer Information + Contact Details', columns: PROPOSITION_1_COLUMNS, rows: 10 },
    { id: 2 as const, label: 'Proposition 2 - Advanced', description: 'Customer Info + Contact + Procurement Metrics', columns: PROPOSITION_2_COLUMNS, rows: 11 },
    { id: 3 as const, label: 'Proposition 3 - Premium', description: 'Full Profile + Digital Adoption + Future Demand + CMI Insights', columns: PROPOSITION_3_COLUMNS, rows: 11 },
  ]

  const active = propositions.find(p => p.id === activeProposition)!

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Customer Intelligence Database</h2>
      </div>

      {/* Proposition Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {propositions.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveProposition(p.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-colors ${
              activeProposition === p.id
                ? 'bg-white text-blue-700 border-gray-300 shadow-sm -mb-px'
                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <PropositionTable
        title={active.label}
        columns={active.columns}
        rowCount={active.rows}
      />
    </div>
  )
}
