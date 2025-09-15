import {model, models, Schema} from "mongoose";

const SettingsSchema = new Schema({
  name: {type:String, required:true, unique:true},
  value: {type:Object},
}, {
  timestamps: true,
});

export const Settings = models?.Settings || model('Settings', SettingsSchema);
