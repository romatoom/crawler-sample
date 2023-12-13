import { URLGetter } from "#utils/classes/urlGetter/urlGetter.js"

const urls = [
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/2008_slice_aero_owners_manual_supplement_de.pdf",
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/2008_slice_aero_owners_manual_supplement_fr.pdf",
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/2008_slice_aero_owners_manual_supplement_es.pdf",
  "https://dorelrl.widen.net/s/sfdf85pnwc/023_191928-rev0-cd-cargowagon-neo-oms-062623_en",
  "https://dorelrl.widen.net/s/gvd6csglgw/023_191928-rev0-cd-cargowagen-neo-oms-062623_de",
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/2008_slice_aero_owners_manual_supplement_it.pdf",
  "https://dorelrl.widen.net/s/qcgn26lchq/023_191928-rev0-cd-cargowagen-neo-oms-062623_fr",
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/2008_slice_aero_owners_manual_supplement_nl.pdf",
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/2008_slice_aero_seatpost_bottlecage_technote_en.pdf",
  "https://dorelrl.widen.net/s/vphkcqbmkm/023_191928-rev0-cd-cargowagen-neo-oms-062623_es",
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/015_Can_Slice_OMS_EN.pdf",
  "https://dorelrl.widen.net/s/v25zvfrkcz/023_191928-rev0-cd-cargowagen-neo-oms-062623_it",
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/015_Can_Slice_OMS_GE.pdf",
  "https://dorelrl.widen.net/s/hxh798mfz7/023_191928-rev0-cd-cargowagen-neo-oms-062623_nl",
  "https://www.cannondale.com/-/media/files/manual-uploads/manuals/015_Can_Slice_OMS_FR.pdf",
  "https://www.cannondale.com/-/media/files/manual-uploads/cy23/151990-rev1-cd-compact-neo-w_hyena-032223.ashx",
];

const urlGetter = URLGetter.build(urls);//.getURLsHashes();

