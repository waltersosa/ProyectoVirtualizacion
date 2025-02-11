export const commonStyles = {
  card: "bg-[rgb(var(--bg-secondary))] shadow-lg rounded-xl border border-[rgb(var(--bg-tertiary))]",
  input: "bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-primary))] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[rgb(var(--accent-primary))] outline-none",
  button: {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors',
    secondary: 'bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors',
    danger: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors',
    icon: 'p-2 rounded-lg text-white transition-colors'
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
    container: 'bg-gray-800 rounded-lg p-4 shadow-lg',
    header: 'flex justify-between items-center mb-4',
    title: 'text-lg font-semibold text-white',
    button: {
      edit: 'text-blue-500 hover:text-blue-400',
      delete: 'text-red-500 hover:text-red-400'
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