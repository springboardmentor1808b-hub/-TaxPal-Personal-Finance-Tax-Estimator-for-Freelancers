
// src/pages/SettingsOverlay.jsx
import SettingLayout from "./SettingLayout";

export default function SettingsOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex bg-black/40">
      {/* clickable dark background */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* white card that holds the settings layout */}
      <div className="relative z-10 flex-1 bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl m-0 md:m-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 shadow-sm hover:bg-white"
        >
          ✕ Close
        </button>

        {/* Your existing settings layout (sidebar + content) */}
        <SettingLayout />
      </div>
    </div>
  );
}
