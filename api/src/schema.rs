table! {
  users (user_id) {
      user_id -> Int4,
      user_uuid -> Uuid,
      hash -> Bytea,
      salt -> Varchar,
      email -> Varchar,
      created_at -> Timestamp,
      updated_at -> Timestamp,
      username -> Varchar,
      play_count -> Int4,
      win_count -> Int4,
      experience -> Int4,
      score -> Int4,
      profile_picture -> Int4,
  }
}
table! {
  profile_pictures(profile_picture_id) {
    profile_picture_id -> Int4,
    url -> Varchar,
    created_at -> Timestamp,
    updated_at -> Timestamp,
  }
}

joinable!(users -> profile_pictures (profile_picture))

allow_tables_to_appear_in_same_query!(
    users,
    profile_pictures,
)