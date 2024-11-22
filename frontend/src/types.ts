type Gender = "male" | "female" | "other";
export type Role = "super_admin" | "artist_manager" | "artist";

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: Gender;
  dob: string;
  phone: string;
  address: string;
  role: Role
};

export type Artist = Omit<User, "role"> & { role: "artist"; first_release_year: number; no_of_albums_released: number; };

type Genre = "rnb" | "country" | "classic" | "rock" | "jazz";

export type Song = {
  id?: number;
  title: string;
  album_name: string;
  genre: Genre
};
