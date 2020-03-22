use crate::schema::*;
use chrono::*;

#[derive(Debug, Serialize, Deserialize, Queryable, juniper::GraphQLObject)]
pub struct ProfilePicture {
    pub profile_picture_id: i32,
    pub url: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Insertable)]
#[table_name = "profile_pictures"]
pub struct ProfilePictureInsert {
    pub url: String,
}

impl ProfilePicture {
    pub fn new<S: Into<String>>(
        url: S,
    ) -> ProfilePictureInsert {
        ProfilePictureInsert {
            url: url.into(),
        }
    }
}