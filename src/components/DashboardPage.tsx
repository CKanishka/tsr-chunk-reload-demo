export const DashboardPage = () => (
  <section>
    <h1>Dashboard</h1>
    <p>Lazy route B — another split chunk for testing.</p>
    <ul>
      {Array.from({ length: 8 }, (_, index) => (
        <li key={index}>Widget {index + 1}</li>
      ))}
    </ul>
  </section>
);
