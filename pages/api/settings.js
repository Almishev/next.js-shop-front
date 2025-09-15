import {mongooseConnect} from "@/lib/mongoose";
import {Settings} from "@/models/Settings";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    const settings = await Settings.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.name] = setting.value;
    });
    res.json(settingsObj);
  }
}
