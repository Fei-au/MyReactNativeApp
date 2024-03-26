

export type userType = {
    user_id: number,
    staff_id: number,
}

export type imageType = {
  id?: number,
  full_image_url?: string,
  local_image?: string,
  external_url: string,
  has_saved?: boolean,
  item?: number,
}

export interface itemType {
  id: number,
  title?: string,
  images?: Array<imageType>,
  item_number?: number,
  location?: string,
  category?: {id: number, name: string} | {id: string, name: string},
  category_id?: string,
  status?: {id: string, name: string} | {id: number, name: string},
}

export interface loginType{
  username: string,
  password: string,
}

