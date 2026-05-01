import React, { useState } from 'react';
import Layout from "../../components/Layout";

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Normalize role casing to handle legacy values
  const rawRole = user.role || "Receptionist";
  const roleMap: Record<string, string> = {
    'ADMIN': 'Administrator',
    'FINANCE': 'Finance Officer',
    'MANAGER': 'Manager',
    'RECEPTIONIST': 'Receptionist'
  };
  const role = roleMap[rawRole] || rawRole;

  if (role !== 'Administrator') {
    return (
      <Layout>
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>You do not have permission to access system settings.</p>
        </div>
      </Layout>
    );
  }

  const settingsStyles = `
    .settingsPage {
      max-width: 1000px;
      margin: 0 auto;
    }

    .settingsHeader {
      margin-bottom: 40px;
    }

    .settingsHeader h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .settingsHeader p {
      color: var(--color-body);
    }

    .settingsGrid {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 48px;
    }

    .settingsNav {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .settingsNavItem {
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;
      color: var(--color-label);
      transition: all 0.2s;
      border: none;
      background: transparent;
      text-align: left;
    }

    .settingsNavItem:hover {
      background: #f8fafc;
      color: var(--stripe-purple);
    }

    .settingsNavItem.active {
      background: var(--magenta-light);
      color: var(--stripe-purple);
      font-weight: 500;
    }

    .settingsContent {
      background: white;
      padding: 32px;
      border-radius: 12px;
      border: 1px solid var(--border-default);
      box-shadow: var(--shadow-standard);
    }

    .sectionTitle {
      font-size: 18px;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-default);
    }

    .formGroup {
      margin-bottom: 24px;
    }

    .formGroup label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-heading);
      margin-bottom: 8px;
    }

    .formGroup input, .formGroup select, .formGroup textarea {
      width: 100%;
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid var(--border-default);
      font-size: 14px;
      color: var(--color-heading);
      transition: border-color 0.2s;
    }

    .formGroup input:focus {
      border-color: var(--stripe-purple);
      outline: none;
      box-shadow: 0 0 0 3px rgba(83, 58, 253, 0.1);
    }

    .formRow {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .saveBar {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border-default);
      display: flex;
      justify-content: flex-end;
    }

    .btnSave {
      background: var(--stripe-purple);
      color: white;
      padding: 10px 24px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btnSave:hover {
      background: var(--purple-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(83, 58, 253, 0.2);
    }
  `;

  return (
    <Layout>
      <style>{settingsStyles}</style>
      <div className="settingsPage">
        <header className="settingsHeader">
          <h1>System Settings</h1>
          <p>Manage your hotel's global configuration and preferences.</p>
        </header>

        <div className="settingsGrid">
          <aside className="settingsNav">
            <button 
              className={`settingsNavItem ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General Configuration
            </button>
            <button 
              className={`settingsNavItem ${activeTab === 'localization' ? 'active' : ''}`}
              onClick={() => setActiveTab('localization')}
            >
              Localization
            </button>
            <button 
              className={`settingsNavItem ${activeTab === 'branding' ? 'active' : ''}`}
              onClick={() => setActiveTab('branding')}
            >
              Branding & Identity
            </button>
            <button 
              className={`settingsNavItem ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security & Access
            </button>
          </aside>

          <main className="settingsContent">
            {activeTab === 'general' && (
              <section>
                <h3 className="sectionTitle">General Configuration</h3>
                <div className="formGroup">
                  <label>Hotel Name</label>
                  <input type="text" defaultValue="Grand Antigravity Resort" />
                </div>
                <div className="formGroup">
                  <label>Support Email</label>
                  <input type="email" defaultValue="ops@antigravity-hotels.com" />
                </div>
                <div className="formRow">
                  <div className="formGroup">
                    <label>Check-in Time</label>
                    <input type="time" defaultValue="14:00" />
                  </div>
                  <div className="formGroup">
                    <label>Check-out Time</label>
                    <input type="time" defaultValue="11:00" />
                  </div>
                </div>
                <div className="formGroup">
                  <label>Maintenance Mode</label>
                  <select>
                    <option value="disabled">Disabled (Active)</option>
                    <option value="enabled">Enabled (Maintenance)</option>
                  </select>
                </div>
              </section>
            )}

            {activeTab === 'localization' && (
              <section>
                <h3 className="sectionTitle">Localization</h3>
                <div className="formGroup">
                  <label>Default Currency</label>
                  <select>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label>Timezone</label>
                  <select defaultValue="UTC-7">
                    <option value="UTC-8">Pacific Time (PT)</option>
                    <option value="UTC-7">Mountain Time (MT)</option>
                    <option value="UTC-5">Eastern Time (ET)</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label>Date Format</label>
                  <select>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </section>
            )}

            {activeTab === 'branding' && (
              <section>
                <h3 className="sectionTitle">Branding & Identity</h3>
                <div className="formGroup">
                  <label>Brand Primary Color</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="color" defaultValue="#533afd" style={{ width: '60px', height: '40px', padding: '2px' }} />
                    <input type="text" defaultValue="#533afd" style={{ flexGrow: 1 }} />
                  </div>
                </div>
                <div className="formGroup">
                  <label>Dashboard Logo</label>
                  <div style={{ border: '2px dashed var(--border-default)', padding: '32px', textAlign: 'center', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-body)' }}>Drag and drop logo or click to upload</p>
                    <button className="btnSave" style={{ background: '#f1f5f9', color: '#475569', marginTop: '12px' }}>Choose File</button>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'security' && (
              <section>
                <h3 className="sectionTitle">Security & Access</h3>
                <div className="formGroup">
                  <label>Session Timeout (Minutes)</label>
                  <input type="number" defaultValue="60" />
                </div>
                <div className="formGroup">
                  <label>Two-Factor Authentication</label>
                  <select>
                    <option value="required">Required for all Admins</option>
                    <option value="optional">Optional</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label>Password Strength Requirement</label>
                  <select>
                    <option value="high">High (12+ chars, special symbols)</option>
                    <option value="medium">Medium (8+ chars)</option>
                  </select>
                </div>
              </section>
            )}

            <div className="saveBar">
              <button className="btnSave">Save Changes</button>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default SystemSettings;
