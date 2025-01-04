export const commonStyles = {
  card: "bg-[rgb(var(--bg-secondary))] shadow-lg rounded-xl border border-[rgb(var(--bg-tertiary))]",
  input: "bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[rgb(var(--accent-primary))] outline-none",
  button: {
    primary: `
      relative overflow-hidden
      bg-gradient-to-r from-blue-500 to-blue-600
      hover:from-blue-600 hover:to-blue-700
      text-white font-medium
      rounded-xl px-6 py-3
      shadow-lg shadow-blue-500/30
      transform transition-all duration-200
      hover:scale-[1.02] active:scale-[0.98]
      before:absolute before:inset-0
      before:bg-white/20 before:translate-x-[-150%] before:skew-x-[45deg]
      hover:before:translate-x-[150%] before:transition-transform before:duration-500
    `,
    secondary: `
      relative overflow-hidden
      bg-gradient-to-r from-gray-700 to-gray-800
      hover:from-gray-600 hover:to-gray-700
      text-gray-200 font-medium
      rounded-xl px-6 py-3
      shadow-lg shadow-gray-900/30
      transform transition-all duration-200
      hover:scale-[1.02] active:scale-[0.98]
      before:absolute before:inset-0
      before:bg-white/10 before:translate-x-[-150%] before:skew-x-[45deg]
      hover:before:translate-x-[150%] before:transition-transform before:duration-500
    `,
    danger: `
      relative overflow-hidden
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-600 hover:to-red-700
      text-white font-medium
      rounded-xl px-6 py-3
      shadow-lg shadow-red-500/30
      transform transition-all duration-200
      hover:scale-[1.02] active:scale-[0.98]
      before:absolute before:inset-0
      before:bg-white/20 before:translate-x-[-150%] before:skew-x-[45deg]
      hover:before:translate-x-[150%] before:transition-transform before:duration-500
    `,
    icon: {
      primary: `
        p-2 rounded-lg
        bg-blue-500/10 hover:bg-blue-500/20
        text-blue-400 hover:text-blue-300
        transition-colors duration-200
      `,
      danger: `
        p-2 rounded-lg
        bg-red-500/10 hover:bg-red-500/20
        text-red-400 hover:text-red-300
        transition-colors duration-200
      `
    }
  },
  text: {
    primary: "text-[rgb(var(--text-primary))]",
    secondary: "text-[rgb(var(--text-secondary))]"
  },
  status: {
    online: "flex items-center gap-1.5 text-green-400 text-sm",
    offline: "flex items-center gap-1.5 text-red-400 text-sm",
    dot: {
      base: "w-2 h-2 rounded-full",
      online: "bg-green-400 animate-pulse",
      offline: "bg-red-400"
    }
  },
  widget: {
    container: `
      relative bg-gradient-to-br from-gray-800/90 to-gray-900/90
      backdrop-blur-md rounded-2xl overflow-hidden
      border border-gray-700/50 hover:border-blue-500/30
      transition-all duration-300 shadow-lg
      hover:shadow-blue-500/5
      p-5
    `,
    header: "flex items-center justify-between mb-4",
    title: "text-lg font-medium text-gray-200",
    status: {
      online: "text-green-400",
      offline: "text-red-400",
    },
    button: {
      edit: "p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors",
      delete: "p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors",
    },
    reading: {
      container: "grid grid-cols-2 gap-4",
      item: `
        relative bg-gray-800/50 rounded-xl p-4
        border border-gray-700/30
        flex flex-col gap-2
      `,
      label: "flex items-center gap-2 text-gray-400 text-sm",
      value: {
        temperature: "text-3xl font-bold text-red-400/90",
        humidity: "text-3xl font-bold text-blue-400/90",
        default: "text-3xl font-bold text-gray-200"
      },
      icon: {
        temperature: "p-2 bg-red-500/10 rounded-lg text-red-400",
        humidity: "p-2 bg-blue-500/10 rounded-lg text-blue-400"
      }
    }
  }
}; 