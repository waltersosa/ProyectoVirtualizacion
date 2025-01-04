import mongoose from 'mongoose';

interface IWidget {
  widgetId: string;
  type: string;
  title: string;
  device?: string;
  config?: {
    chartType?: 'line' | 'bar' | 'gauge';
    dataType?: 'temperature' | 'humidity' | 'pressure';
  };
}

const widgetSchema = new mongoose.Schema<IWidget>({
  widgetId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['gauge', 'chart', 'control', 'dht11', 'thermometer', 'relay']
  },
  title: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: false
  },
  config: {
    chartType: {
      type: String,
      enum: ['line', 'bar', 'gauge'],
      required: false
    },
    dataType: {
      type: String,
      enum: ['temperature', 'humidity', 'pressure'],
      required: false
    }
  }
});

// Middleware pre-save para validar la configuración según el tipo
widgetSchema.pre('save', function(next) {
  if (this.type === 'chart') {
    if (!this.config || !this.config.chartType || !this.config.dataType) {
      next(new Error('Los widgets de tipo chart requieren configuración de chartType y dataType'));
      return;
    }
  }
  next();
});

const Widget = mongoose.model<IWidget>('Widget', widgetSchema);
export default Widget; 