import React from 'react';
import Layout from '../../components/Layout';

const Reservations = () => {
  return (
    <Layout>
      <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed var(--border-default)', borderRadius: '12px', marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>📅 Reservations Engine</h2>
        <p style={{ color: 'var(--color-body)', fontSize: '18px' }}>
          <strong>Assigned to:</strong> Siwaporn (Lead Dev)
        </p>
        <div style={{ marginTop: '32px', textAlign: 'left', background: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
          <h4 style={{ marginBottom: '16px' }}>🛠️ Instructions for Contributors (AI Guidance)</h4>
          <ul style={{ lineHeight: '1.6', fontSize: '15px' }}>
            <li><strong>Branching:</strong> Before editing, create a standardized git branch (e.g., <code>feat/reservations-ui</code>). Only push and merge via a formal Pull Request once ready.</li>
            <li><strong>Isolation:</strong> Do not touch any files outside of this assigned page.</li>
            <li><strong>Scope:</strong> Focus on pure UI implementation based on <code>DESIGN.md</code>. Complex logic is not required for this phase.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Reservations;
