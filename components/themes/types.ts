export interface WishData {
  name: string;
  presence: string;
  message: string;
  timestamp: string;
}

export interface LoveStoryData {
  year: string;
  title: string;
  desc: string;
}

export interface GiftData {
  bank: string;
  acc: string;
  name: string;
}

export interface InvitationData {
  slug?: string;
  theme_id?: string;
  category?: string;
  is_paid?: boolean;
  edit_token?: string;
  bride_data: {
    groom: string;
    bride: string;
    parents_groom: string;
    parents_bride: string;
    groom_ig?: string;
    bride_ig?: string;
  };
  event_data: {
    date: string;
    akad_time: string;
    akad_location: string;
    akad_map?: string;
    resepsi_time: string;
    resepsi_location: string;
    resepsi_map?: string;
    live_stream?: string;
  };
  hero_image?: string;
  bg_middle?: string;
  bg_bottom?: string;
  groom_photo?: string;
  bride_photo?: string;
  gallery?: string[];
  love_story?: LoveStoryData[];
  gifts?: GiftData[];
  wishes?: WishData[];
  video?: string;
  music_url?: string;
  quote?: string;
  createdAt?: string;
}
