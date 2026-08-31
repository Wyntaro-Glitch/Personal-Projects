export default function Ribbon({ activeMenu }) {
  if (!activeMenu) return null;

  const ribbonContent = {
    file: {
      sections: [
        {
          name: 'New',
          items: [
            { icon: '📄', label: 'New Canvas', action: () => {} },
            { icon: '📁', label: 'Open', action: () => {} }
          ]
        },
        {
          name: 'Save',
          items: [
            { icon: '💾', label: 'Save', action: () => {} },
            { icon: '📥', label: 'Save As', action: () => {} },
            { icon: '📤', label: 'Export', action: () => {} }
          ]
        },
        {
          name: 'Print',
          items: [
            { icon: '🖨️', label: 'Print', action: () => {} }
          ]
        }
      ]
    },
    edit: {
      sections: [
        {
          name: 'History',
          items: [
            { icon: '↩️', label: 'Undo', shortcut: 'Ctrl+Z', action: 'undo' },
            { icon: '↪️', label: 'Redo', shortcut: 'Ctrl+Y', action: 'redo' }
          ]
        },
        {
          name: 'Clipboard',
          items: [
            { icon: '📋', label: 'Copy', action: () => {} },
            { icon: '📌', label: 'Paste', action: () => {} },
            { icon: '✂️', label: 'Cut', action: () => {} }
          ]
        },
        {
          name: 'Find',
          items: [
            { icon: '🔍', label: 'Find', action: () => {} }
          ]
        }
      ]
    },
    layers: {
      sections: [
        {
          name: 'Layers',
          items: [
            { icon: '➕', label: 'Add Layer', action: () => {} },
            { icon: '🗑️', label: 'Delete Layer', action: () => {} },
            { icon: '📋', label: 'Duplicate', action: () => {} }
          ]
        },
        {
          name: 'Arrange',
          items: [
            { icon: '⬆️', label: 'Bring Front', action: () => {} },
            { icon: '⬇️', label: 'Send Back', action: () => {} },
            { icon: '🔼', label: 'Bring Forward', action: () => {} },
            { icon: '🔽', label: 'Send Backward', action: () => {} }
          ]
        },
        {
          name: 'Opacity',
          items: [
            { icon: '👁️', label: 'Visibility', action: () => {} },
            { icon: '🔒', label: 'Lock', action: () => {} }
          ]
        }
      ]
    },
    select: {
      sections: [
        {
          name: 'Selection',
          items: [
            { icon: '🔲', label: 'Select All', shortcut: 'Ctrl+A', action: () => {} },
            { icon: '❌', label: 'Deselect', shortcut: 'Ctrl+D', action: () => {} },
            { icon: '🔄', label: 'Invert Selection', action: () => {} }
          ]
        },
        {
          name: 'Transform',
          items: [
            { icon: '↔️', label: 'Move', action: () => {} },
            { icon: '↔️', label: 'Resize', action: () => {} },
            { icon: '🔄', label: 'Rotate', action: () => {} }
          ]
        },
        {
          name: 'Align',
          items: [
            { icon: '⬅️', label: 'Align Left', action: () => {} },
            { icon: '➡️', label: 'Align Right', action: () => {} },
            { icon: '⬆️', label: 'Align Top', action: () => {} },
            { icon: '⬇️', label: 'Align Bottom', action: () => {} }
          ]
        }
      ]
    }
  };

  const content = ribbonContent[activeMenu];
  if (!content) return null;

  return (
    <div className="ribbon">
      {content.sections.map((section, idx) => (
        <div key={idx} className="ribbon-section">
          <div className="ribbon-section-name">{section.name}</div>
          <div className="ribbon-items">
            {section.items.map((item, itemIdx) => (
              <button
                key={itemIdx}
                className="ribbon-item"
                onClick={item.action}
                title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
              >
                <span className="ribbon-item-icon">{item.icon}</span>
                <span className="ribbon-item-label">{item.label}</span>
                {item.shortcut && (
                  <span className="ribbon-item-shortcut">{item.shortcut}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
