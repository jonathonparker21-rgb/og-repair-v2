import { Hono } from 'hono';

const app = new Hono();

// ==================== HOME / INTAKE ====================
app.get('/', (c) => {
  return c.html(`...`); // Keeping the intake form from before (shortened for space)
});

// ==================== REPAIRS LIST + STATUS UPDATE ====================
app.get('/repairs', async (c) => {
  const db = c.env.DB;

  const repairs = await db.prepare(`
    SELECT 
      r.id as repair_id,
      r.status,
      r.problem,
      r.estimate_amount,
      r.created_at,
      c.name as customer_name,
      c.phone,
      d.brand,
      d.model
    FROM repairs r
    JOIN devices d ON r.device_id = d.id
    JOIN customers c ON d.customer_id = c.id
    ORDER BY r.created_at DESC
  `).all();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Repairs • OG Repair</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-zinc-950 text-zinc-200">
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold">All Repairs</h1>
        <p class="text-zinc-400">Manage and update repair tickets</p>
      </div>
      <a href="/" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl flex items-center gap-2">
        <i class="fas fa-plus"></i> New Intake
      </a>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      <table class="w-full">
        <thead class="bg-zinc-950">
          <tr>
            <th class="text-left px-6 py-4 text-sm font-medium text-zinc-400">ID</th>
            <th class="text-left px-6 py-4 text-sm font-medium text-zinc-400">Customer</th>
            <th class="text-left px-6 py-4 text-sm font-medium text-zinc-400">Device</th>
            <th class="text-left px-6 py-4 text-sm font-medium text-zinc-400">Problem</th>
            <th class="text-left px-6 py-4 text-sm font-medium text-zinc-400">Estimate</th>
            <th class="text-left px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
            <th class="text-left px-6 py-4 text-sm font-medium text-zinc-400">Date</th>
            <th class="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800">
          ${repairs.results.map(r => `
            <tr>
              <td class="px-6 py-4 font-mono text-sm">#${r.repair_id}</td>
              <td class="px-6 py-4">
                <div class="font-medium">${r.customer_name}</div>
                <div class="text-xs text-zinc-400">${r.phone}</div>
              </td>
              <td class="px-6 py-4 text-sm">${r.brand || ''} ${r.model || ''}</td>
              <td class="px-6 py-4 text-sm max-w-xs truncate">${r.problem || '-'}</td>
              <td class="px-6 py-4">$${r.estimate_amount || '0.00'}</td>
              <td class="px-6 py-4">
                <form method="POST" action="/api/repairs/${r.repair_id}/status" class="flex gap-2">
                  <select name="status" class="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1 text-sm">
                    <option value="intake" ${r.status === 'intake' ? 'selected' : ''}>Intake</option>
                    <option value="in_progress" ${r.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${r.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="picked_up" ${r.status === 'picked_up' ? 'selected' : ''}>Picked Up</option>
                  </select>
                  <button type="submit" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm">Update</button>
                </form>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-400">${new Date(r.created_at).toLocaleDateString()}</td>
              <td class="px-6 py-4 text-right">
                <a href="#" class="text-emerald-400 hover:text-emerald-300 text-sm">View</a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;

  return c.html(html);
});

// Update repair status
app.post('/api/repairs/:id/status', async (c) => {
  const db = c.env.DB;
  const repairId = c.req.param('id');
  const { status } = await c.req.parseBody();

  await db.prepare(
    "UPDATE repairs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(status, repairId).run();

  return c.redirect('/repairs');
});

// ==================== API: Create Repair ====================
app.post('/api/intake', async (c) => {
  // ... existing code from before
});

export default app;
