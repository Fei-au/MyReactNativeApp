

export type userType = {
    user_id?: number,
    staff_id?: number,
}

export type imageType = {
  full_image_url?: string,
  id?: number,
  local_image?: string,
}

export interface itemType {
  id: number,
  title?: string,
  images?: Array<imageType>,
  item_number?: number,
  location?: string,
}