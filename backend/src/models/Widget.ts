import mongoose, { Schema, Document } from 'mongoose';

export interface IWidget extends Document {
  widgetId: string;
  type: 'button' | 'thermometer';  // Solo estos dos tipos permitidos
  title: string;
  device?: string;
  config?: {
    chartType?: 'line' | 'bar' | 'gauge';
    dataType?: 'temperature' | 'humidity';
    controlType?: 'toggle' | 'momentary';
  };
}

const WidgetSchema: Schema = new Schema({
  widgetId: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    required: true,
    enum: ['button', 'thermometer']
  },
  title: { type: String, required: true },
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
  config: {
    chartType: { 
      type: String, 
      enum: ['line', 'bar', 'gauge'],
      default: null 
    },
    dataType: { 
      type: String, 
      enum: ['temperature', 'humidity'],
      default: null 
    },
    controlType: { 
      type: String, 
      enum: ['toggle', 'momentary'],
      default: null 
    }
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
WidgetSchema.index({ widgetId: 1 }, { unique: true });
WidgetSchema.index({ type: 1 });
WidgetSchema.index({ device: 1 });

// Middleware pre-save para validar la configuración según el tipo
WidgetSchema.pre('save', function(next) {
  // Validar que el dispositivo esté presente para todos los tipos de widgets
  if (!this.device) {
    next(new Error('Todos los widgets requieren un dispositivo asociado'));
    return;
  }

  // Validaciones específicas según el tipo
  switch (this.type) {
    case 'thermometer':
      if (!this.config) {
        this.config = {
          chartType: 'gauge',
          dataType: 'temperature'
        };
      }
      break;
    case 'button':
      if (!this.config) {
        this.config = {
          controlType: 'toggle'
        };
      }
      break;
    default:
      next(new Error('Tipo de widget no soportado'));
      return;
  }

  next();
});

export default mongoose.model<IWidget>('Widget', WidgetSchema); 