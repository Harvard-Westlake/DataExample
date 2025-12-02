import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Import CSV files as raw text so we can parse them ourselves
import monthlyCsv from './assets/primaryEnergyOverview/Monthly Data-Table 1.csv?raw'
import annualCsv from './assets/primaryEnergyOverview/Annual Data-Table 1.csv?raw'

function parseMonthly(csvText) {
  const lines = csvText.split(/\r?\n/)

  // Find the header row that starts with "Month,"
  const headerIndex = lines.findIndex((line) => line.startsWith('Month,'))
  if (headerIndex === -1) return []

  const headers = lines[headerIndex].split(',')

  // Skip the header row and the units row right after it
  const dataLines = lines.slice(headerIndex + 2)

  return dataLines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('Table 1.1')) // ignore any trailing notes
    .map((line) => {
      const cols = line.split(',')
      const row = {}

      headers.forEach((h, i) => {
        const key = h.trim()
        const value = (cols[i] || '').trim()

        if (key === 'Month') {
          // e.g. "1973 January"
          row.Month = value
        } else {
          const num = Number(value)
          row[key] = Number.isNaN(num) ? null : num
        }
      })

      return row
    })
}

function parseAnnual(csvText) {
  const lines = csvText.split(/\r?\n/)

  // Find the header row that starts with "Annual Total,"
  const headerIndex = lines.findIndex((line) => line.startsWith('Annual Total,'))
  if (headerIndex === -1) return []

  const headers = lines[headerIndex].split(',')

  // Skip the header row and the units row right after it
  const dataLines = lines.slice(headerIndex + 2)

  return dataLines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('Table 1.1')) // ignore any trailing notes
    .map((line) => {
      const cols = line.split(',')
      const row = {}

      headers.forEach((h, i) => {
        const key = h.trim()
        const value = (cols[i] || '').trim()

        if (key === 'Annual Total') {
          // Treat the annual total column as the year label
          row.Year = value
        } else {
          const num = Number(value)
          row[key] = Number.isNaN(num) ? null : num
        }
      })

      return row
    })
}

function EnergyCharts() {
  const monthlyData = useMemo(() => parseMonthly(monthlyCsv), [])
  const annualData = useMemo(() => parseAnnual(annualCsv), [])

  return (
    <main className="energy-app">
      <header className="energy-header">
        <h1 className="energy-title">U.S. Primary Energy Overview</h1>
        <p className="energy-subtitle">
          Monthly and annual primary energy consumption in the United States, measured in quadrillion Btu.
        </p>
        <p className="energy-source">
          Data source:{' '}
          <a
            href="https://catalog.data.gov/dataset/monthly-and-annual-energy-consumption-by-sector/resource/521de5ae-b112-405b-8474-4214ddd5675b"
            target="_blank"
            rel="noreferrer"
          >
            U.S. Energy Information Administration – Energy Consumption (Data.gov)
          </a>
        </p>
      </header>

      <section className="chart-section">
        <div className="chart-card">
          <div className="chart-text">
            <h2 className="chart-title">Monthly total primary energy consumption</h2>
            <p className="chart-description">Quadrillion Btu, by month, beginning in 1973.</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="Month" tick={{ fontSize: 10 }} minTickGap={16} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Total Primary Energy Consumption"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="chart-section">
        <div className="chart-card">
          <div className="chart-text">
            <h2 className="chart-title">Annual total primary energy consumption</h2>
            <p className="chart-description">Quadrillion Btu, annual totals from 1949 onward.</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer>
              <LineChart data={annualData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="Year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Total Primary Energy Consumption"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </main>
  )
}

export default EnergyCharts


