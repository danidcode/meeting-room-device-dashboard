import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import history from '../../status-history.json'
import { chartStatusColors, statusLabels, statuses } from '../constants/deviceStatus'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const labels = history.map((row) => monthFormatter.format(new Date(`${row.period}-01T00:00:00Z`)))
const data = {
  labels,
  datasets: statuses.map((status) => ({
    label: statusLabels[status],
    data: history.map((row) => row[status]),
    borderColor: chartStatusColors[status],
    backgroundColor: chartStatusColors[status],
    pointRadius: 0,
    pointHitRadius: 12,
    borderWidth: 2,
    tension: 0.2,
  })),
}
const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#4d6376', usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 20 },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#607487', maxTicksLimit: 6, maxRotation: 0 } },
    y: {
      beginAtZero: true,
      grid: { color: '#edf1f6' },
      ticks: { color: '#607487', precision: 0 },
      border: { display: false },
    },
  },
}

export default function StatusChart() {
  return (
    <section className="panel p-6" aria-labelledby="history-title">
      <h2 id="history-title" className="text-lg font-semibold">
        Status over time
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Monthly sample history, independent of changes to the current fleet.
      </p>
      <div className="mt-6 h-72">
        <Line
          data={data}
          options={options}
          role="img"
          aria-label="Line chart of monthly device counts for online, in meeting, offline, and deactivated statuses. The same values are available in the chart data table below."
        />
      </div>
      <details className="mt-3 text-sm text-slate-600">
        <summary className="w-fit cursor-pointer rounded py-2 font-medium">View chart data</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Status over time</caption>
            <thead>
              <tr>
                {['Month', ...statuses.map((status) => statusLabels[status])].map((label) => (
                  <th key={label} scope="col" className="p-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((row, index) => (
                <tr key={row.period} className="border-t border-slate-100">
                  <th scope="row" className="whitespace-nowrap p-3 font-medium">
                    {labels[index]}
                  </th>
                  {statuses.map((status) => (
                    <td key={status} className="p-3">
                      {row[status]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  )
}
